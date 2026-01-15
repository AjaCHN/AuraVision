import { useState, useCallback, useRef } from 'react';
import { SongInfo, Language, Region } from '../types';
import { identifySongFromAudio } from '../services/geminiService';

interface UseIdentificationProps {
  language: Language;
  region: Region;
  provider: 'GEMINI' | 'MOCK' | 'OPENAI' | 'CLAUDE' | 'GROK' | 'DEEPSEEK' | 'QWEN';
  showLyrics: boolean;
}

export const useIdentification = ({ language, region, provider, showLyrics }: UseIdentificationProps) => {
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [currentSong, setCurrentSong] = useState<SongInfo | null>(null);
  // Ref to track the latest request, preventing race conditions.
  const latestRequestId = useRef(0);

  const performIdentification = useCallback(async (stream: MediaStream) => {
    if (!showLyrics || isIdentifying) return;
    
    const requestId = ++latestRequestId.current;
    setIsIdentifying(true);
    
    try {
      let recorder: MediaRecorder;
      try {
        const recorderOptions = {
          mimeType: 'audio/webm;codecs=opus',
          bitsPerSecond: 128000
        };
        recorder = new MediaRecorder(stream, recorderOptions);
      } catch (e) {
        console.warn("High-quality MediaRecorder options not supported, falling back.", e);
        recorder = new MediaRecorder(stream);
      }

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        try {
          const mimeType = recorder.mimeType || 'audio/webm';
          const blob = new Blob(chunks, { type: mimeType });
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = async () => {
            // Ensure this is still the latest request before processing
            if (requestId !== latestRequestId.current) {
              console.log("Stale identification request ignored.");
              return;
            }
            const base64Data = (reader.result as string).split(',')[1];
            const info = await identifySongFromAudio(base64Data, mimeType, language, region, provider);
            
            // Final check before setting state
            if (requestId === latestRequestId.current && info && info.identified) {
              setCurrentSong(info);
            }
          };
        } catch (e) {
          console.error("Error during identification processing:", e);
        } finally {
          // Ensure loading state is reset even if errors occur inside onloadend
          if (requestId === latestRequestId.current) {
            setIsIdentifying(false);
          }
        }
      };
      recorder.start();
      setTimeout(() => {
        if (recorder.state === 'recording') recorder.stop();
      }, 4000); 
    } catch (e) {
      console.error("Recording error:", e);
      // Ensure loading state is reset if recorder setup fails
      if (requestId === latestRequestId.current) {
         setIsIdentifying(false);
      }
    }
  }, [showLyrics, isIdentifying, language, region, provider]);

  return { isIdentifying, currentSong, setCurrentSong, performIdentification };
};