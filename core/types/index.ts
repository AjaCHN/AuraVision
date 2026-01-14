import * as React from 'react';
import type { ThreeElements } from '@react-three/fiber';

export type Language = 'en' | 'zh' | 'tw' | 'ja' | 'es' | 'ko' | 'de' | 'fr';

export type Region = 'global' | 'US' | 'CN' | 'JP' | 'KR' | 'EU' | 'LATAM';

export type Position = 'tl' | 'tc' | 'tr' | 'ml' | 'mc' | 'mr' | 'bl' | 'bc' | 'br';

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
  matchSource?: 'AI' | 'LOCAL' | 'MOCK' | 'GEMINI' | 'OPENAI' | 'CLAUDE' | 'GROK';
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
  customText: string;
  showCustomText: boolean;
  textPulse: boolean;
  customTextRotation: number;
  customTextSize: number;
  customTextFont: string;
  customTextOpacity: number;
  customTextColor: string;
  customTextPosition: Position;
  lyricsPosition: Position;
  recognitionProvider: 'GEMINI' | 'MOCK' | 'OPENAI' | 'CLAUDE' | 'GROK';
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

declare global {
  // FIX: Switched from `JSX` to `React.JSX` namespace to correctly augment intrinsic elements
  // for the modern JSX transform used by Vite's React plugin by default.
  namespace React.JSX {
    /**
     * @zh
     * 此处通过“声明合并” (declaration merging) 对全局的 JSX 命名空间进行扩展。
     * 它将 `@react-three/fiber` 提供的 `ThreeElements` 类型（包含了所有 Three.js 的原生元素）
     * 添加到标准的 `IntrinsicElements` 中。这一步至关重要，它使得 TypeScript 能够识别并正确
     * 类型检查在 React 组件中使用的 Three.js 元素（例如 `<mesh>`, `<pointLight>`）。
     * 采用这种全局扩展的方式，可以有效避免在某些打包器配置下可能出现的循环依赖或模块解析问题。
     * 
     * @en
     * This declaration merging augments the global JSX namespace.
     * It extends the standard `IntrinsicElements` (like 'div', 'span') with `ThreeElements`
     * from `@react-three/fiber`. This is crucial for TypeScript to recognize and type-check
     * Three.js primitive elements (e.g., `<mesh>`, `<pointLight>`) used as React components.
     * This approach is preferred over extending `React.JSX.IntrinsicElements` directly, as it
     * can avoid potential circular dependency or module resolution issues in some bundler setups.
     */
    interface IntrinsicElements extends ThreeElements {}
  }
}