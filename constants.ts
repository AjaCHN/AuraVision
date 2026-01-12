
import { VisualizerMode, Region } from './types';

export const APP_VERSION = '0.2.0';

export const GEMINI_MODEL = 'gemini-3-flash-preview';

export const VISUALIZER_PRESETS = {
  [VisualizerMode.PLASMA]: {
    name: 'Plasma Flow',
    description: 'Fluid liquid color gradients'
  },
  [VisualizerMode.BARS]: {
    name: 'Frequency Bars',
    description: 'Classic spectrum analyzer'
  },
  [VisualizerMode.PARTICLES]: {
    name: 'Starfield',
    description: 'Particles accelerated by treble'
  },
  [VisualizerMode.TUNNEL]: {
    name: 'Geometric Tunnel',
    description: '3D deep space tunnel'
  },
  [VisualizerMode.SHAPES]: {
    name: 'Abstract Shapes',
    description: 'Dancing geometric primitives'
  },
  [VisualizerMode.RINGS]: {
    name: 'Neon Rings',
    description: 'Concentric circles reactive to mids'
  },
  [VisualizerMode.NEBULA]: {
    name: 'Cosmic Nebula',
    description: 'Dense, swirling clouds of color'
  },
  [VisualizerMode.KALEIDOSCOPE]: {
    name: 'Kaleidoscope',
    description: 'Psychedelic mandala patterns'
  },
  [VisualizerMode.LASERS]: {
    name: 'Concert Lasers',
    description: 'Converging sweeping light beams'
  },
  [VisualizerMode.STROBE]: {
    name: 'Stage Wall',
    description: 'Massive LED grid pulsing to the beat'
  },
  [VisualizerMode.SILK]: {
    name: 'Silk Waves',
    description: 'Iridescent flowing fabric (WebGL)'
  },
  [VisualizerMode.LIQUID]: {
    name: 'Liquid Sphere',
    description: 'Ferrofluid-like reactive matter (WebGL)'
  },
  [VisualizerMode.TERRAIN]: {
    name: 'Low Poly Terrain',
    description: 'Flying over reactive mountains (WebGL)'
  }
};

export const COLOR_THEMES = [
  ['#ef4444', '#f59e0b', '#fbbf24'], // 0: Sunset
  ['#3b82f6', '#8b5cf6', '#ec4899'], // 1: Cyberpunk
  ['#10b981', '#34d399', '#6ee7b7'], // 2: Matrix
  ['#64748b', '#475569', '#1e293b'], // 3: Dark Slate
  ['#0ea5e9', '#22d3ee', '#67e8f9'], // 4: Ocean
  ['#f472b6', '#d946ef', '#8b5cf6'], // 5: Vaporwave
  ['#eab308', '#facc15', '#fef08a'], // 6: Golden Hour
  ['#6366f1', '#a855f7', '#ec4899'], // 7: Aurora
  ['#4338ca', '#1e1b4b', '#312e81'], // 8: Midnight Deep
  ['#f87171', '#dc2626', '#991b1b'], // 9: Blood Moon
  ['#fcd34d', '#f97316', '#ea580c'], // 10: Magma
  ['#94a3b8', '#e2e8f0', '#f8fafc'], // 11: Silver Frost
  ['#001219', '#005f73', '#0a9396'], // 12: Deep Sea
  ['#064e3b', '#059669', '#34d399'], // 13: Emerald Forest
  ['#4c1d95', '#8b5cf6', '#ddd6fe'], // 14: Lavender Dream
  ['#78350f', '#f59e0b', '#fef3c7'], // 15: Spicy Mango
  ['#ecfeff', '#a5f3fc', '#22d3ee'], // 16: Ice Cold
  ['#9d174d', '#db2777', '#fbcfe8'], // 17: Cherry Blossom
  ['#84cc16', '#22c55e', '#15803d'], // 18: Lime Punch
  ['#ffedd5', '#fed7aa', '#fdba74'], // 19: Peachy
  ['#312e81', '#1e1b4b', '#4c1d95'], // 20: Royal Void
  ['#f1f5f9', '#94a3b8', '#334155'], // 21: Monotone
];

export const REGION_NAMES: Record<Region, string> = {
  global: 'Global',
  US: 'USA / West',
  CN: 'China',
  JP: 'Japan',
  KR: 'Korea',
  EU: 'Europe',
  LATAM: 'Latin America'
};
