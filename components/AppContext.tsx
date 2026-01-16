/**
 * File: components/AppContext.tsx
 * Version: 0.7.5
 * Author: Aura Vision Team
 * Copyright (c) 2024 Aura Vision. All rights reserved.
 */

import React, { useState, useEffect, useCallback, useRef, createContext, useContext, useMemo } from 'react';
import { VisualizerMode, LyricsStyle, Language, VisualizerSettings, Region, AudioDevice, SongInfo, SmartPreset } from '../core/types';
import { useAudio } from '../core/hooks/useAudio';
import { useLocalStorage } from '../core/hooks/useLocalStorage';
import { useAppState } from '../core/hooks/useAppState';
import { useVisualsState } from '../core/hooks/useVisualsState';
import { useAiState } from '../core/hooks/useAiState';

// --- Type Definitions for Context ---

interface AppContextType {
  mode: VisualizerMode; setMode: React.Dispatch<React.SetStateAction<VisualizerMode>>;
  colorTheme: string[]; setColorTheme: React.Dispatch<React.SetStateAction<string[]>>;
  settings: VisualizerSettings; setSettings: React.Dispatch<React.SetStateAction<VisualizerSettings>>;
  lyricsStyle: LyricsStyle; setLyricsStyle: React.Dispatch<React.SetStateAction<LyricsStyle>>;
  showLyrics: boolean; setShowLyrics: React.Dispatch<React.SetStateAction<boolean>>;
  language: Language; setLanguage: React.Dispatch<React.SetStateAction<Language>>;
  region: Region; setRegion: React.Dispatch<React.SetStateAction<Region>>;
  selectedDeviceId: string; onDeviceChange: React.Dispatch<React.SetStateAction<string>>;
  
  activePreset: string; setActivePreset: React.Dispatch<React.SetStateAction<string>>;

  isListening: boolean; isSimulating: boolean; isIdentifying: boolean;
  analyser: AnalyserNode | null; mediaStream: MediaStream | null; audioDevices: AudioDevice[];
  currentSong: SongInfo | null; setCurrentSong: React.Dispatch<React.SetStateAction<SongInfo | null>>;
  errorMessage: string | null; setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
  
  hasStarted: boolean; setHasStarted: React.Dispatch<React.SetStateAction<boolean>>;
  isUnsupported: boolean;
  showOnboarding: boolean;
  isThreeMode: boolean;
  
  startMicrophone: (deviceId?: string) => Promise<void>;
  toggleMicrophone: (deviceId: string) => void;
  startDemoMode: () => Promise<void>;
  performIdentification: (stream: MediaStream) => Promise<void>;
  randomizeSettings: () => void;
  resetSettings: () => void;
  resetVisualSettings: () => void;
  resetTextSettings: () => void;
  resetAudioSettings: () => void;
  resetAiSettings: () => void;
  applyPreset: (preset: SmartPreset) => void;
  handleOnboardingComplete: () => void;
  toggleFullscreen: () => void;
  t: any;
}

// --- Context Creation ---

const AppContext = createContext<AppContextType | null>(null);
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within an AppProvider");
  return context;
};

// --- Constants & Defaults ---

// Fix: Removed 'aiApiKey' from DEFAULT_SETTINGS as it is not defined in the VisualizerSettings type definition.
const DEFAULT_SETTINGS: VisualizerSettings = {
  sensitivity: 1.5, speed: 1.0, glow: false, trails: true, autoRotate: false, rotateInterval: 30,
  cycleColors: false, colorInterval: 10, hideCursor: false, smoothing: 0.8, fftSize: 512, 
  quality: 'high', monitor: false, wakeLock: false, customText: 'AURA', showCustomText: false,
  textPulse: true, customTextRotation: 0, customTextSize: 12, customTextFont: 'Inter, sans-serif',
  customTextOpacity: 0.35, customTextColor: '#ffffff', customTextPosition: 'mc', customTextCycleColor: false, customTextCycleInterval: 5,
  lyricsPosition: 'mc', recognitionProvider: 'GEMINI', lyricsFont: 'Inter, sans-serif', lyricsFontSize: 4,
  // System Defaults
  showFps: false, showTooltips: true, doubleClickFullscreen: true, autoHideUi: true, mirrorDisplay: false
};

// --- Provider Component ---

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { getStorage, setStorage } = useLocalStorage();
  
  const initialSettings = useMemo(() => {
      const savedSettings = getStorage<Partial<VisualizerSettings>>('settings', {});
      return { ...DEFAULT_SETTINGS, ...savedSettings, showCustomText: savedSettings.showCustomText ?? false };
  }, [getStorage]);

  const {
    hasStarted, setHasStarted, showOnboarding, isUnsupported, language, setLanguage,
    region, setRegion, t, manageWakeLock, handleOnboardingComplete, resetSettings
  } = useAppState();
  
  const { 
    mode, setMode, colorTheme, setColorTheme, settings, setSettings, activePreset, setActivePreset,
    randomizeSettings, resetVisualSettings, applyPreset
  } = useVisualsState(hasStarted, initialSettings);

  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(() => getStorage('deviceId', ''));
  
  const { 
    isListening, isSimulating, analyser, mediaStream, audioDevices, 
    errorMessage, setErrorMessage, startMicrophone, startDemoMode, toggleMicrophone 
  } = useAudio({ settings, language });

  const {
    lyricsStyle, setLyricsStyle, showLyrics, setShowLyrics, isIdentifying,
    currentSong, setCurrentSong, performIdentification, resetAiSettings
  } = useAiState({
      language, region, provider: settings.recognitionProvider,
      isListening, isSimulating, mediaStream, initialSettings: DEFAULT_SETTINGS, setSettings
  });
  
  useEffect(() => {
    manageWakeLock(settings.wakeLock);
  }, [settings.wakeLock, hasStarted, manageWakeLock]);

  useEffect(() => {
    setStorage('settings', settings);
    setStorage('deviceId', selectedDeviceId);
  }, [settings, selectedDeviceId, setStorage]);

  const resetTextSettings = useCallback(() => setSettings(p => ({ ...p, customText: DEFAULT_SETTINGS.customText, showCustomText: DEFAULT_SETTINGS.showCustomText, textPulse: DEFAULT_SETTINGS.textPulse, customTextRotation: DEFAULT_SETTINGS.customTextRotation, customTextSize: DEFAULT_SETTINGS.customTextSize, customTextFont: DEFAULT_SETTINGS.customTextFont, customTextOpacity: DEFAULT_SETTINGS.customTextOpacity, customTextColor: DEFAULT_SETTINGS.customTextColor, customTextPosition: DEFAULT_SETTINGS.customTextPosition, customTextCycleColor: DEFAULT_SETTINGS.customTextCycleColor, customTextCycleInterval: DEFAULT_SETTINGS.customTextCycleInterval })), []);
  const resetAudioSettings = useCallback(() => setSettings(p => ({ ...p, sensitivity: DEFAULT_SETTINGS.sensitivity, smoothing: DEFAULT_SETTINGS.smoothing, fftSize: DEFAULT_SETTINGS.fftSize })), []);

  useEffect(() => {
    if (analyser) {
      analyser.smoothingTimeConstant = settings.smoothing;
      if (analyser.fftSize !== settings.fftSize) analyser.fftSize = settings.fftSize;
    }
  }, [settings.smoothing, settings.fftSize, analyser]);

  const toggleFullscreen = useCallback(() => {
    const doc = window.document as any;
    const elem = doc.documentElement as any;
    const isFullscreen = doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement;

    if (!isFullscreen) {
        if (elem.requestFullscreen) elem.requestFullscreen();
        else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
        else if (elem.mozRequestFullScreen) elem.mozRequestFullScreen();
        else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
    } else {
        if (doc.exitFullscreen) doc.exitFullscreen();
        else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen();
        else if (doc.mozCancelFullScreen) doc.mozCancelFullScreen();
        else if (doc.msExitFullscreen) doc.msExitFullscreen();
    }
  }, []);

  const isThreeMode = useMemo(() => mode === VisualizerMode.SILK || mode === VisualizerMode.LIQUID || mode === VisualizerMode.TERRAIN, [mode]);

  const contextValue: AppContextType = {
    mode, setMode, colorTheme, setColorTheme, settings, setSettings, lyricsStyle, setLyricsStyle, showLyrics, setShowLyrics,
    language, setLanguage, region, setRegion, selectedDeviceId, onDeviceChange: setSelectedDeviceId, isListening,
    isSimulating, isIdentifying, analyser, mediaStream, audioDevices, currentSong, setCurrentSong, errorMessage, setErrorMessage,
    startMicrophone, toggleMicrophone, startDemoMode, performIdentification, randomizeSettings, resetSettings,
    resetVisualSettings, resetTextSettings, resetAudioSettings, resetAiSettings, applyPreset, activePreset, setActivePreset, t,
    hasStarted, setHasStarted, isUnsupported, showOnboarding, isThreeMode, handleOnboardingComplete, toggleFullscreen
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};