
import { useState, useCallback } from 'react';
import { SongInfo, Language, Region } from '../types';
import { identifySongFromAudio } from '../services/geminiService';

interface UseIdentificationProps {
  language: Language;
  region: Region;
  provider: 'GEMINI' | 'MOCK' | 'OPENAI' | 'CLAUDE' | 'GROK';
  showLyrics: boolean;
}

export const useIdentification = ({ language, region, provider, showLyrics }: UseIdentificationProps) => {
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [currentSong, setCurrentSong] = useState<SongInfo | null>(null);

  const performIdentification = useCallback(async (stream: MediaStream) => {
    if (!showLyrics || isIdentifying) return;
    setIsIdentifying(true);
    try {
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        const mimeType = recorder.mimeType || 'audio/webm';
        const blob = new Blob(chunks, { type: mimeType });
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async () => {
          const base64Data = (reader.result as string).split(',')[1];
          const info = await identifySongFromAudio(base64Data, mimeType, language, region, provider);
          if (info && info.identified) setCurrentSong(info);
          setIsIdentifying(false);
        };
      };
      recorder.start();
      setTimeout(() => {
        if (recorder.state === 'recording') recorder.stop();
      }, 7000); 
    } catch (e) {
      console.error("Recording error:", e);
      setIsIdentifying(false);
    }
  }, [showLyrics, isIdentifying, language, region, provider]);

  return { isIdentifying, currentSong, setCurrentSong, performIdentification };
};
