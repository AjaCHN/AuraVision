
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { VisualizerMode, VisualizerSettings, SmartPreset } from '../types';
import { COLOR_THEMES } from '../constants';

const DEFAULT_MODE = VisualizerMode.PLASMA;
const DEFAULT_THEME_INDEX = 1;

export const useVisualsState = (hasStarted: boolean, initialSettings: VisualizerSettings) => {
  const { getStorage, setStorage } = useLocalStorage();

  const [mode, setModeInternal] = useState<VisualizerMode>(() => getStorage('mode', DEFAULT_MODE));
  const [colorTheme, setColorThemeInternal] = useState<string[]>(() => getStorage('theme', COLOR_THEMES[DEFAULT_THEME_INDEX]));
  const [settings, setSettings] = useState<VisualizerSettings>(initialSettings);
  const [activePreset, setActivePreset] = useState<string>('');
  
  const rotateIntervalRef = useRef<number | null>(null);
  const colorIntervalRef = useRef<number | null>(null);

  const setMode = useCallback((value: React.SetStateAction<VisualizerMode>) => {
    setModeInternal(value);
    setActivePreset('');
  }, []);

  const setColorTheme = useCallback((value: React.SetStateAction<string[]>) => {
    setColorThemeInternal(value);
    setActivePreset('');
  }, []);

  useEffect(() => {
    if (settings.autoRotate && hasStarted) {
      rotateIntervalRef.current = window.setInterval(() => {
        setModeInternal(currentMode => {
          const modes = Object.values(VisualizerMode);
          const currentIndex = modes.indexOf(currentMode);
          const nextIndex = (currentIndex + 1) % modes.length;
          return modes[nextIndex];
        });
      }, settings.rotateInterval * 1000);
    } else if (rotateIntervalRef.current) {
      clearInterval(rotateIntervalRef.current);
      rotateIntervalRef.current = null;
    }
    return () => { if (rotateIntervalRef.current) clearInterval(rotateIntervalRef.current); };
  }, [settings.autoRotate, settings.rotateInterval, hasStarted]);

  useEffect(() => {
    if (settings.cycleColors && hasStarted) {
      colorIntervalRef.current = window.setInterval(() => {
        const randomIndex = Math.floor(Math.random() * COLOR_THEMES.length);
        setColorThemeInternal(COLOR_THEMES[randomIndex]);
      }, settings.colorInterval * 1000);
    } else if (colorIntervalRef.current) {
      clearInterval(colorIntervalRef.current);
      colorIntervalRef.current = null;
    }
    return () => { if (colorIntervalRef.current) clearInterval(colorIntervalRef.current); };
  }, [settings.cycleColors, settings.colorInterval, hasStarted]);

  useEffect(() => {
    setStorage('mode', mode);
  }, [mode, setStorage]);

  useEffect(() => {
    setStorage('theme', colorTheme);
  }, [colorTheme, setStorage]);

  const randomizeSettings = useCallback(() => {
    setColorThemeInternal(COLOR_THEMES[Math.floor(Math.random() * COLOR_THEMES.length)]);
    const modes = Object.values(VisualizerMode);
    setModeInternal(modes[Math.floor(Math.random() * modes.length)]);
    setSettings(p => ({ ...p, speed: 0.8 + Math.random() * 0.8, sensitivity: 1.2 + Math.random() * 1.0, glow: Math.random() > 0.15, trails: Math.random() > 0.2, smoothing: 0.7 + Math.random() * 0.2 }));
    setActivePreset('');
  }, [setSettings]);

  const applyPreset = useCallback((preset: SmartPreset) => {
    setModeInternal(preset.settings.mode);
    setColorThemeInternal(preset.settings.colorTheme);
    setSettings(p => ({
      ...p,
      speed: preset.settings.speed,
      sensitivity: preset.settings.sensitivity,
      glow: preset.settings.glow,
      trails: preset.settings.trails,
      smoothing: preset.settings.smoothing,
      // Apply fftSize if present, otherwise keep current or default
      fftSize: preset.settings.fftSize ?? p.fftSize,
    }));
    setActivePreset(preset.nameKey);
  }, [setSettings]);

  const resetVisualSettings = useCallback(() => {
    setModeInternal(DEFAULT_MODE);
    setColorThemeInternal(COLOR_THEMES[DEFAULT_THEME_INDEX]);
    setSettings(p => ({
      ...p,
      speed: initialSettings.speed,
      sensitivity: initialSettings.sensitivity,
      glow: initialSettings.glow,
      trails: initialSettings.trails,
      autoRotate: initialSettings.autoRotate,
      cycleColors: initialSettings.cycleColors,
      smoothing: initialSettings.smoothing,
      hideCursor: initialSettings.hideCursor,
      quality: initialSettings.quality,
    }));
    setActivePreset('');
  }, [setSettings, initialSettings]);

  return {
    mode, setMode,
    colorTheme, setColorTheme,
    settings, setSettings,
    activePreset, setActivePreset,
    randomizeSettings,
    resetVisualSettings,
    applyPreset
  };
};
