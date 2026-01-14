
import 'react';

export type Language = 'en' | 'zh' | 'tw' | 'ja' | 'es' | 'ko' | 'de' | 'fr';

export type Region = 'global' | 'US' | 'CN' | 'JP' | 'KR' | 'EU' | 'LATAM';

export enum VisualizerMode {
  BARS = 'BARS',
  PLASMA = 'PLASMA',
  PARTICLES = 'PARTICLES',
  TUNNEL = 'TUNNEL',
  SHAPES = 'SHAPES',
  RINGS = 'RINGS',
  NEBULA = 'NEBULA', 
  KALEIDOSCOPE = 'KALEIDOSCOPE',
  LASERS = 'LASERS',   
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
  matchSource?: 'AI' | 'LOCAL' | 'MOCK';
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
  // Custom Text Settings
  customText: string;
  showCustomText: boolean;
  textPulse: boolean;
  customTextRotation: number; // degrees -180 to 180
  customTextSize: number; // Scale factor 1 to 100
  customTextFont: string;
  // AI & Lyrics Settings
  lyricsPosition: 'top' | 'center' | 'bottom';
  recognitionProvider: 'GEMINI' | 'MOCK';
}

export interface VisualizerConfig {
  mode: VisualizerMode;
  sensitivity: number;
  colorTheme: string[];
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

// React 18+ / React-JSX Module Augmentation
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      group: any;
      pointLight: any;
      spotLight: any;
      ambientLight: any;
      primitive: any;
      color: any;
      fog: any;
      circleGeometry: any;
      meshBasicMaterial: any;
      meshStandardMaterial: any;
      meshPhysicalMaterial: any;
      planeGeometry: any;
      icosahedronGeometry: any;
    }
  }
}

// Global JSX IntrinsicElements augmentation for backwards compatibility or global usage
declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      group: any;
      pointLight: any;
      spotLight: any;
      ambientLight: any;
      primitive: any;
      color: any;
      fog: any;
      circleGeometry: any;
      meshBasicMaterial: any;
      meshStandardMaterial: any;
      meshPhysicalMaterial: any;
      planeGeometry: any;
      icosahedronGeometry: any;
    }
  }
}
