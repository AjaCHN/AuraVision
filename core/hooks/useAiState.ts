// FIX: Import React to provide types for React.Dispatch and React.SetStateAction.
import React, { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { useIdentification } from './useIdentification';
import { LyricsStyle, Language, Region, VisualizerSettings } from '../types';

const DEFAULT_LYRICS_STYLE = LyricsStyle.KARAOKE;
const DEFAULT_SHOW_LYRICS = false;

interface AiStateProps {
  language: Language;
  region: Region;
  provider: 'GEMINI' | 'MOCK' | 'OPENAI' | 'CLAUDE' | 'GROK' | 'DEEPSEEK' | 'QWEN';
  isListening: boolean;
  isSimulating: boolean;
  mediaStream: MediaStream | null;
  initialSettings: VisualizerSettings;
  setSettings: React.Dispatch<React.SetStateAction<VisualizerSettings>>;
}

export const useAiState = ({ 
  language, region, provider, isListening, 
  isSimulating, mediaStream, initialSettings, setSettings 
}: AiStateProps) => {
  const { getStorage, setStorage } = useLocalStorage();

  const [lyricsStyle, setLyricsStyle] = useState<LyricsStyle>(() => getStorage('lyricsStyle', DEFAULT_LYRICS_STYLE));
  const [showLyrics, setShowLyrics] = useState<boolean>(() => getStorage('showLyrics', DEFAULT_SHOW_LYRICS));
  
  const { isIdentifying, currentSong, setCurrentSong, performIdentification } = useIdentification({
    language, region, provider, showLyrics
  });

  useEffect(() => {
    setStorage('lyricsStyle', lyricsStyle);
    setSettings(s => ({ ...s, lyricsStyle }));
  }, [lyricsStyle, setStorage, setSettings]);

  useEffect(() => {
    setStorage('showLyrics', showLyrics);
  }, [showLyrics, setStorage]);
  
  useEffect(() => {
    let interval: number;
    if (isListening && mediaStream && showLyrics && !isSimulating) {
      performIdentification(mediaStream);
      interval = window.setInterval(() => performIdentification(mediaStream), 20000);
    }
    return () => clearInterval(interval);
  }, [isListening, mediaStream, showLyrics, performIdentification, isSimulating]);

  const resetAiSettings = useCallback(() => {
    setShowLyrics(DEFAULT_SHOW_LYRICS);
    setLyricsStyle(DEFAULT_LYRICS_STYLE);
    setSettings(p => ({
      ...p,
      lyricsPosition: initialSettings.lyricsPosition,
      recognitionProvider: initialSettings.recognitionProvider,
      lyricsFont: initialSettings.lyricsFont,
      lyricsFontSize: initialSettings.lyricsFontSize
    }));
  }, [setSettings, initialSettings]);

  return {
    lyricsStyle, setLyricsStyle,
    showLyrics, setShowLyrics,
    isIdentifying,
    currentSong, setCurrentSong,
    performIdentification,
    resetAiSettings
  };
};