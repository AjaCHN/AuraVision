
/**
 * File: core/types/index.ts
 * Version: 0.7.0
 * Author: Aura Vision Team
 * Copyright (c) 2024 Aura Vision. All rights reserved.
 */

import * as React from 'react';
import { ThreeElements } from '@react-three/fiber';

export type Language = 'en' | 'zh' | 'tw' | 'ja' | 'es' | 'ko' | 'de' | 'fr';

export type Region = 'global' | 'US' | 'CN' | 'JP' | 'KR' | 'EU' | 'LATAM';

export type Position = 'tl' | 'tc' | 'tr' | 'ml' | 'mc' | 'mr' | 'bl' | 'bc' | 'br';

export enum VisualizerMode {
  BARS = 'BARS',
  PLASMA = 'PLASMA',
  PARTICLES = 'PARTICLES',
  TUNNEL = 'TUNNEL',
  RINGS = 'RINGS',
  NEBULA = 'NEBULA', 
  LASERS = 'LASERS',
  FLUID_CURVES = 'FLUID_CURVES',
  MACRO_BUBBLES = 'MACRO_BUBBLES',
  // WebGL Modes
  SILK = 'SILK',
  LIQUID = 'LIQUID',
  TERRAIN = 'TERRAIN'
}

export enum LyricsStyle {
  STANDARD = 'STANDARD',
  KARAOKE = 'KARAOKE',
  MINIMAL = 'MINIMAL'
}

export interface SongInfo {
  title: string;
  artist: string;
  lyricsSnippet?: string;
  mood?: string;
  identified: boolean;
  searchUrl?: string;
  matchSource?: 'AI' | 'LOCAL' | 'MOCK' | 'GEMINI' | 'OPENAI' | 'CLAUDE' | 'GROK' | 'DEEPSEEK' | 'QWEN' | 'PREVIEW';
}

export interface VisualizerSettings {
  sensitivity: number;
  speed: number;
  glow: boolean;
  trails: boolean;
  autoRotate: boolean;
  rotateInterval: number;
  cycleColors: boolean;
  colorInterval: number;
  hideCursor: boolean;
  smoothing: number;
  fftSize: number;
  quality: 'low' | 'med' | 'high';
  monitor: boolean;
  wakeLock: boolean;
  // System Settings
  showFps: boolean;
  showTooltips: boolean;
  doubleClickFullscreen: boolean;
  autoHideUi: boolean;
  mirrorDisplay: boolean;
  
  customText: string;
  showCustomText: boolean;
  textPulse: boolean;
  customTextRotation: number;
  customTextSize: number;
  customTextFont: string;
  customTextOpacity: number;
  customTextColor: string;
  customTextPosition: Position;
  customTextCycleColor: boolean;
  customTextCycleInterval: number; // Controls the speed of the rainbow cycle in seconds
  lyricsPosition: Position;
  recognitionProvider: 'GEMINI' | 'MOCK' | 'OPENAI' | 'CLAUDE' | 'GROK' | 'DEEPSEEK' | 'QWEN';
  aiApiKey?: string;
  lyricsStyle?: LyricsStyle;
  lyricsFont?: string;
  lyricsFontSize?: number;
  region?: Region;
}

export interface VisualizerConfig {
  mode: VisualizerMode;
  sensitivity: number;
  colorTheme: string[];
}

export interface SmartPreset {
  nameKey: string;
  settings: {
    mode: VisualizerMode;
    colorTheme: string[];
    speed: number;
    sensitivity: number;
    glow: boolean;
    trails: boolean;
    smoothing: number;
  };
}

export interface IVisualizerRenderer {
  init(canvas: HTMLCanvasElement): void;
  draw(
    ctx: CanvasRenderingContext2D, 
    data: Uint8Array, 
    width: number, 
    height: number, 
    colors: string[], 
    settings: VisualizerSettings,
    rotation: number
  ): void;
  cleanup?(): void;
}

export interface AudioDevice {
  deviceId: string;
  label: string;
}

// Correctly extend global JSX namespace for React Three Fiber
declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}
