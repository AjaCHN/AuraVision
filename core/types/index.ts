/**
 * File: core/types/index.ts
 * Version: 0.8.2
 * Author: Aura Vision Team
 * Copyright (c) 2024 Aura Vision. All rights reserved.
 */

import React from 'react';

export type Language = 'en' | 'zh' | 'tw' | 'ja' | 'es' | 'ko' | 'de' | 'fr' | 'ar' | 'ru';

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
  // Overlay Settings
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
  customTextCycleInterval: number;
  lyricsPosition: Position;
  recognitionProvider: 'GEMINI' | 'MOCK' | 'OPENAI' | 'CLAUDE' | 'GROK' | 'DEEPSEEK' | 'QWEN';
  lyricsStyle?: LyricsStyle;
  lyricsFont?: string;
  lyricsFontSize?: number;
  region?: Region;
  // System Settings
  showFps: boolean;
  showTooltips: boolean;
  doubleClickFullscreen: boolean;
  autoHideUi: boolean;
  mirrorDisplay: boolean;
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
    fftSize?: number;
  };
}

// RenderContext uses any to avoid bringing in DOM types that might crash Workers
export type RenderContext = any; 

export interface IVisualizerRenderer {
  init(canvas: any): void;
  draw(
    ctx: RenderContext, 
    data: Uint8Array, 
    width: number, 
    height: number, 
    colors: string[], 
    settings: VisualizerSettings,
    rotation: number, 
    beat: boolean
  ): void;
  cleanup?(): void;
}

export interface AudioDevice {
  deviceId: string;
  label: string;
}

// Worker Messages
export type WorkerMessage = 
  | { type: 'INIT'; canvas: OffscreenCanvas; width: number; height: number; devicePixelRatio: number }
  | { type: 'RESIZE'; width: number; height: number }
  | { type: 'FRAME'; data: Uint8Array }
  | { type: 'CONFIG'; mode: VisualizerMode; settings: VisualizerSettings; colors: string[] };

// Define the interface for R3F elements
interface ReactThreeFiberElements {
  mesh: any;
  pointLight: any;
  spotLight: any;
  ambientLight: any;
  group: any;
  primitive: any;
  meshPhysicalMaterial: any;
  meshStandardMaterial: any;
  rectAreaLight: any;
  color: any;
  fog: any;
  directionalLight: any;
  points: any;
  bufferGeometry: any;
  bufferAttribute: any;
  shaderMaterial: any;
}

// Global augmentation for React Three Fiber elements
declare global {
  namespace JSX {
    interface IntrinsicElements extends ReactThreeFiberElements {}
  }
}

// Augment React JSX namespace (needed for React 18+ and newer TS versions)
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements extends ReactThreeFiberElements {}
  }
}
