
import { VisualizerMode, Region } from './types';

export const APP_VERSION = '0.2.3';

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
    name: 'Deep Nebula',
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
    name: 'Grid Matrix',
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
    name: 'Low-Poly Terrain',
    description: 'Flying over reactive mountains (WebGL)'
  }
};

/**
 * 严选 28 套配色方案 (4x7 布局)
 * 剔除视觉效果一般的类似色系，保留最具辨识度的艺术风格
 */
export const COLOR_THEMES = [
  // --- 1-7: 高能赛博 & 电子 (Cyber & High-Energy) ---
  ['#3b82f6', '#8b5cf6', '#ec4899'], // 赛博朋克 (Cyberpunk)
  ['#ff00ff', '#00ffff', '#ffff00'], // 极致鲜艳 (CMYK Funk)
  ['#6366f1', '#a855f7', '#ec4899'], // 极光 (Aurora)
  ['#f7ff00', '#db36a4', '#000000'], // 东京霓虹 (Tokyo Neon)
  ['#ff4d00', '#ff00ff', '#00ff4d'], // 幻觉 (Acid Trip)
  ['#f472b6', '#d946ef', '#8b5cf6'], // 蒸汽波 (Vaporwave)
  ['#2e1065', '#6b21a8', '#d8b4fe'], // 复古浪潮 (Retro Wave)

  // --- 8-14: 炽热熔岩 & 暖阳 (Magma & Warmth) ---
  ['#ef4444', '#f59e0b', '#fbbf24'], // 落日余晖 (Sunset)
  ['#fcd34d', '#f97316', '#ea580c'], // 岩浆 (Magma)
  ['#f87171', '#dc2626', '#991b1b'], // 血月 (Blood Moon)
  ['#fa709a', '#fee140', '#ffffff'], // 晨曦 (Sunshine)
  ['#450a0a', '#991b1b', '#f87171'], // 耀斑 (Solar Flare)
  ['#7f1d1d', '#b91c1c', '#f87171'], // 熔岩流 (Lava Flow)
  ['#eab308', '#facc15', '#fef08a'], // 黄金时代 (Golden Hour)

  // --- 15-21: 有机自然 & 深海 (Organic & Deep Sea) ---
  ['#10b981', '#34d399', '#6ee7b7'], // 黑客帝国 (Matrix)
  ['#0ea5e9', '#22d3ee', '#67e8f9'], // 纯净海洋 (Ocean)
  ['#064e3b', '#059669', '#34d399'], // 翡翠森林 (Emerald Forest)
  ['#001219', '#005f73', '#0a9396'], // 深海幽闭 (Deep Sea)
  ['#082f49', '#075985', '#0ea5e9'], // 深邃之蓝 (Abyss)
  ['#a3e635', '#22c55e', '#14532d'], // 强效绿光 (Biohazard)
  ['#1a2a6c', '#b21f1f', '#fdbb2d'], // 皇家日落 (Royal Sunset)

  // --- 22-28: 高级极简 & 幽邃 (Elegant & Ethereal) ---
  ['#4c1d95', '#8b5cf6', '#ddd6fe'], // 薰衣草之梦 (Lavender)
  ['#ee9ca7', '#ffdde1', '#ffffff'], // 樱花 (Sakura)
  ['#94a3b8', '#e2e8f0', '#f8fafc'], // 银霜 (Silver Frost)
  ['#000000', '#ffffff', '#cccccc'], // 黑色电影 (Noir)
  ['#312e81', '#1e1b4b', '#4c1d95'], // 皇家虚空 (Royal Void)
  ['#111827', '#374151', '#9ca3af'], // 黑曜石 (Obsidian)
  ['#00ffff', '#3b82f6', '#1d4ed8'], // 电子深蓝 (Electric Deep Blue)
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
