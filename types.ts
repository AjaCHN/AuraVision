
export type Language = 'en' | 'zh';

export type Region = 'global' | 'US' | 'CN' | 'JP' | 'KR' | 'EU' | 'LATAM';

export enum VisualizerMode {
  BARS = 'BARS',
  PLASMA = 'PLASMA',
  PARTICLES = 'PARTICLES',
  TUNNEL = 'TUNNEL',
  SHAPES = 'SHAPES',
  RINGS = 'RINGS',
  NEBULA = 'NEBULA', // Renamed from SMOKE
  KALEIDOSCOPE = 'KALEIDOSCOPE',
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
  matchSource?: 'AI' | 'LOCAL';
}

export interface VisualizerSettings {
  sensitivity: number; // 1.0 to 3.0
  speed: number;       // 0.5 to 2.0
  glow: boolean;       // Enable shadowBlur
  trails: boolean;     // Enable transparency clearing
  autoRotate: boolean; // Automatically switch modes
  rotateInterval: number; // Seconds between rotation
  hideCursor: boolean; // Whether to hide the mouse cursor
}

export interface VisualizerConfig {
  mode: VisualizerMode;
  sensitivity: number;
  colorTheme: string[];
}

// Strategy Pattern Interface for Visualizers
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
