import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { VisualizerSettings } from '../types';
import { getAverage } from '../services/audioUtils';

interface UseAudioReactiveProps {
  analyser: AnalyserNode;
  colors: string[];
  settings: VisualizerSettings;
}

export const useAudioReactive = ({ analyser, colors, settings }: UseAudioReactiveProps) => {
  const dataArray = useRef(new Uint8Array(analyser.frequencyBinCount)).current;
  
  const smoothedColorsRef = useRef(colors.map(c => new THREE.Color(c)));
  const targetColorRef = useRef(new THREE.Color());

  const audioData = useRef({ bass: 0, mids: 0, treble: 0, volume: 0 }).current;

  useFrame(() => {
    const smoothedColors = smoothedColorsRef.current;
    
    // 1. Smooth Color Transition Logic
    const lerpSpeed = 0.05;
    
    // BUG FIX: Correctly handle theme color array size change to prevent visual jumps.
    if (smoothedColors.length !== colors.length) {
      const currentLength = smoothedColors.length;
      const targetLength = colors.length;

      if (currentLength < targetLength) {
        // Array is growing: pad with clones of the last known color for a smooth transition.
        const lastColor = smoothedColors[currentLength - 1] || new THREE.Color(colors[0] || '#ffffff');
        for (let i = currentLength; i < targetLength; i++) {
          smoothedColors.push(lastColor.clone());
        }
      } else {
        // Array is shrinking: truncate it.
        smoothedColors.length = targetLength;
      }
    }

    smoothedColors.forEach((color, i) => {
      color.lerp(targetColorRef.current.set(colors[i] || colors[0] || '#ffffff'), lerpSpeed);
    });

    // 2. Audio Data Processing
    analyser.getByteFrequencyData(dataArray);
    audioData.bass = getAverage(dataArray, 0, 15) / 255 * settings.sensitivity;
    audioData.mids = getAverage(dataArray, 20, 80) / 255 * settings.sensitivity;
    audioData.treble = getAverage(dataArray, 100, 160) / 255 * settings.sensitivity;
    audioData.volume = getAverage(dataArray, 0, dataArray.length) / 255;
  });

  return { ...audioData, smoothedColors: smoothedColorsRef.current };
};