/**
 * File: core/constants/index.ts
 * Version: 0.7.5
 * Author: Aura Vision Team
 * Copyright (c) 2024 Aura Vision. All rights reserved.
 */

import { VisualizerMode, Region, Position, SmartPreset } from '../types';

export const APP_VERSION = '0.7.5';
export const GEMINI_MODEL = 'gemini-3-flash-preview';

export const VISUALIZER_PRESETS = {
  [VisualizerMode.PLASMA]: { name: 'Plasma Flow', description: 'Fluid liquid color gradients' },
  [VisualizerMode.BARS]: { name: 'Frequency Bars', description: 'Classic spectrum analyzer' },
  [VisualizerMode.PARTICLES]: { name: 'Starfield', description: 'Drifting particles with Lissajous physics' },
  [VisualizerMode.TUNNEL]: { name: 'Geometric Tunnel', description: '3D deep space tunnel' },
  [VisualizerMode.RINGS]: { name: 'Neon Rings', description: 'Concentric circles reactive to mids' },
  [VisualizerMode.NEBULA]: { name: 'Deep Nebula', description: 'Dense, swirling clouds of color' },
  [VisualizerMode.LASERS]: { name: 'Concert Lasers', description: 'Converging sweeping light beams' },
  [VisualizerMode.FLUID_CURVES]: { name: 'Aura Waves', description: 'Ethereal flowing gradients' },
  [VisualizerMode.MACRO_BUBBLES]: { name: 'Macro Bubbles', description: 'Liquid bubbles with Depth of Field (DoF)' },
  [VisualizerMode.SILK]: { name: 'Silk Waves', description: 'Iridescent flowing fabric (WebGL)' },
  [VisualizerMode.LIQUID]: { name: 'Liquid Sphere', description: 'Ferrofluid-like reactive matter (WebGL)' },
  [VisualizerMode.TERRAIN]: { name: 'Low-Poly Terrain', description: 'Flying over reactive mountains (WebGL)' }
};

export const AVAILABLE_FONTS = [
  { value: 'Inter, sans-serif', label: 'Inter (Default)' },
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: 'Courier New, monospace', label: 'Courier New' },
  { value: 'Times New Roman, serif', label: 'Times New Roman' },
  { value: 'Impact, sans-serif', label: 'Impact' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: 'Verdana, sans-serif', label: 'Verdana' }
];

export const COLOR_THEMES = [
  ['#3b82f6', '#8b5cf6', '#ec4899'],
  ['#ff00ff', '#00ffff', '#ffff00'],
  ['#6366f1', '#a855f7', '#ec4899'],
  ['#f7ff00', '#db36a4', '#000000'],
  ['#ff4d00', '#ff00ff', '#00ff4d'],
  ['#f472b6', '#d946ef', '#8b5cf6'],
  ['#2e1065', '#6b21a8', '#d8b4fe'],
  ['#ef4444', '#f59e0b', '#fbbf24'],
  ['#fcd34d', '#f97316', '#ea580c'],
  ['#f87171', '#dc2626', '#991b1b'],
  ['#fa709a', '#fee140', '#ffffff'],
  ['#450a0a', '#991b1b', '#f87171'],
  ['#7f1d1d', '#b91c1c', '#f87171'],
  ['#eab308', '#facc15', '#fef08a'],
  ['#10b981', '#34d399', '#6ee7b7'],
  ['#0ea5e9', '#22d3ee', '#67e8f9'],
  ['#064e3b', '#059669', '#34d399'],
  ['#001219', '#005f73', '#0a9396'],
  ['#082f49', '#075985', '#0ea5e9'],
  ['#a3e635', '#22c55e', '#14532d'],
  ['#1a2a6c', '#b21f1f', '#fdbb2d'],
  ['#4c1d95', '#8b5cf6', '#ddd6fe'],
  ['#ee9ca7', '#ffdde1', '#ffffff'],
  ['#94a3b8', '#e2e8f0', '#f8fafc'],
  ['#000000', '#ffffff', '#cccccc'],
  ['#312e81', '#1e1b4b', '#4c1d95'],
  ['#111827', '#374151', '#9ca3af'],
  ['#00ffff', '#3b82f6', '#1d4ed8'],
  // Cyberpunk Spectrum (Multi-color)
  ['#FF00FF', '#00FF00', '#00FFFF', '#FFFF00'],
  // Prismatic Flare (Highly saturated multi-color)
  ['#FF3F00', '#FFD700', '#00FF41', '#00D8FF', '#FF00A0'],
];

export const SMART_PRESETS: Record<string, SmartPreset> = {
  calm: {
    nameKey: 'calm',
    settings: {
      mode: VisualizerMode.SILK,
      colorTheme: COLOR_THEMES[22], // White/Pastel
      speed: 0.4,
      sensitivity: 1.1,
      glow: true,
      trails: true,
      smoothing: 0.92, // High smoothing for liquid feel
      fftSize: 2048
    }
  },
  party: {
    nameKey: 'party',
    settings: {
      mode: VisualizerMode.LASERS,
      colorTheme: COLOR_THEMES[28], // Prismatic
      speed: 1.8,
      sensitivity: 2.2,
      glow: true,
      trails: false, // Sharp movements
      smoothing: 0.5, // Low smoothing for snappy hits
      fftSize: 1024
    }
  },
  cyberpunk: {
    nameKey: 'cyberpunk',
    settings: {
      mode: VisualizerMode.TUNNEL,
      colorTheme: COLOR_THEMES[27], // CMYK Cyber
      speed: 2.5,
      sensitivity: 1.8,
      glow: true,
      trails: true,
      smoothing: 0.7,
      fftSize: 512
    }
  },
  retrowave: {
    nameKey: 'retrowave',
    settings: {
      mode: VisualizerMode.TERRAIN,
      colorTheme: COLOR_THEMES[6], // Purple/Orange
      speed: 1.2,
      sensitivity: 1.5,
      glow: true,
      trails: true,
      smoothing: 0.8,
      fftSize: 1024
    }
  },
  vocal: {
    nameKey: 'vocal',
    settings: {
      mode: VisualizerMode.RINGS,
      colorTheme: COLOR_THEMES[10], // Pink/White
      speed: 0.8,
      sensitivity: 1.4,
      glow: false,
      trails: false,
      smoothing: 0.85,
      fftSize: 4096 // High res for voice details
    }
  },
  ambient: {
    nameKey: 'ambient',
    settings: {
      mode: VisualizerMode.NEBULA,
      colorTheme: COLOR_THEMES[18], // Deep Ocean
      speed: 0.2,
      sensitivity: 1.3,
      glow: true,
      trails: true,
      smoothing: 0.95, // Max smoothing
      fftSize: 2048
    }
  }
};

export const REGION_NAMES: Record<Region, string> = {
  global: 'Global',
  US: 'USA / West',
  CN: 'China',
  JP: 'Japan',
  KR: 'Korea',
  EU: 'Europe',
  LATAM: 'Latin America'
};

export const getPositionOptions = (t: any) => {
  const p = t?.positions || {};
  return [
    { value: 'tl', label: p.tl || "Top Left" }, { value: 'tc', label: p.tc || "Top Center" }, { value: 'tr', label: p.tr || "Top Right" },
    { value: 'ml', label: p.ml || "Mid Left" }, { value: 'mc', label: p.mc || "Center" }, { value: 'mr', label: p.mr || "Mid Right" },
    { value: 'bl', label: p.bl || "Bottom Left" }, { value: 'bc', label: p.bc || "Bottom Center" }, { value: 'br', label: p.br || "Bottom Right" },
  ];
};