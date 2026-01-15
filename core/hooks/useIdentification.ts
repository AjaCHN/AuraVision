import { useState, useCallback, useRef, useEffect } from 'react';
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
  
  const isMounted = useRef(true);
  const latestRequestId = useRef(0);
  const recorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    isMounted.current = true;
    return () => { 
      isMounted.current = false; 
      if (recorderRef.current && recorderRef.current.state === 'recording') {
        recorderRef.current.stop();
      }
    };
  }, []);

  const performIdentification = useCallback(async (stream: MediaStream) => {
    if (!showLyrics || isIdentifying || !stream.active) return;
    
    const requestId = ++latestRequestId.current;
    setIsIdentifying(true);
    
    try {
      const mimeType = 'audio/webm;codecs=opus';
      const recorder = new MediaRecorder(stream, { mimeType });
      recorderRef.current = recorder;

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = async () => {
        if (!isMounted.current || requestId !== latestRequestId.current || chunks.length === 0) {
          setIsIdentifying(false);
          return;
        }

        try {
          const blob = new Blob(chunks, { type: mimeType });
          const reader = new FileReader();
          
          reader.onloadend = async () => {
            if (!isMounted.current || requestId !== latestRequestId.current) return;
            
            const base64Data = (reader.result as string).split(',')[1];
            const info = await identifySongFromAudio(base64Data, mimeType, language, region, provider);
            
            if (isMounted.current && requestId === latestRequestId.current) {
              if (info && info.identified) {
                setCurrentSong(info);
              }
              setIsIdentifying(false);
            }
          };
          reader.readAsDataURL(blob);
        } catch (e) {
          console.error("[AI] Process Error:", e);
          setIsIdentifying(false);
        }
      };

      recorder.start();
      
      // Auto-stop after 6 seconds to capture enough spectral data
      setTimeout(() => {
        if (recorder.state === 'recording') recorder.stop();
      }, 6000); 

    } catch (e) {
      console.error("[AI] Recorder Error:", e);
      setIsIdentifying(false);
    }
  }, [showLyrics, isIdentifying, language, region, provider]);

  return { isIdentifying, currentSong, setCurrentSong, performIdentification };
};