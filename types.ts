
export type Language = 'en' | 'zh';

export type Region = 'global' | 'US' | 'CN' | 'JP' | 'KR' | 'EU' | 'LATAM';

export enum VisualizerMode {
  PLASMA = 'PLASMA',
  BARS = 'BARS',
  PARTICLES = 'PARTICLES',
  TUNNEL = 'TUNNEL',
  SHAPES = 'SHAPES',
  RINGS = 'RINGS',
  SMOKE = 'SMOKE',
  RIPPLE = 'RIPPLE'
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
}

export interface VisualizerConfig {
  mode: VisualizerMode;
  sensitivity: number;
  colorTheme: string[];
}