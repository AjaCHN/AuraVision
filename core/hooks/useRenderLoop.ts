// FIX: Import React to provide the type for React.RefObject.
import React, { useRef, useEffect } from 'react';
import { VisualizerMode, VisualizerSettings, IVisualizerRenderer } from '../types';
import { hexToRgb, rgbToHex } from '../services/colorUtils';

type RgbColor = { r: number; g: number; b: number };

interface RenderLoopProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  analyser: AnalyserNode | null;
  renderersRef: React.RefObject<Partial<Record<VisualizerMode, IVisualizerRenderer>>>;
  mode: VisualizerMode;
  colors: string[];
  settings: VisualizerSettings;
}

export const useRenderLoop = ({
  canvasRef,
  analyser,
  renderersRef,
  mode,
  colors,
  settings,
}: RenderLoopProps) => {
  const requestRef = useRef<number>(0);
  const rotationRef = useRef<number>(0);
  const currentColorsRgbRef = useRef<RgbColor[]>(colors.map(hexToRgb));

  useEffect(() => {
    const draw = () => {
      if (!analyser || !canvasRef.current || !renderersRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Smooth Color Transition Logic
      const lerpFactor = 0.05;
      const targetColors = colors.length > 0 ? colors : ['#ffffff'];
      const targetColorsRgb = targetColors.map(hexToRgb);
      
      if (currentColorsRgbRef.current.length !== targetColorsRgb.length) {
        const currentLength = currentColorsRgbRef.current.length;
        const targetLength = targetColorsRgb.length;
        if (currentLength < targetLength) {
          const lastColor = currentColorsRgbRef.current[currentLength - 1] || targetColorsRgb[0];
          const padding = new Array(targetLength - currentLength).fill(lastColor);
          currentColorsRgbRef.current.push(...padding);
        } else {
          currentColorsRgbRef.current.length = targetLength;
        }
      }

      const smoothedColorsRgb = currentColorsRgbRef.current.map((currentRgb, i) => {
        const targetRgb = targetColorsRgb[i] || targetColorsRgb[0];
        return {
          r: currentRgb.r + (targetRgb.r - currentRgb.r) * lerpFactor,
          g: currentRgb.g + (targetRgb.g - currentRgb.g) * lerpFactor,
          b: currentRgb.b + (targetRgb.b - currentRgb.b) * lerpFactor,
        };
      });
      currentColorsRgbRef.current = smoothedColorsRgb;
      const smoothedColorsHex = smoothedColorsRgb.map(c => rgbToHex(c.r, c.g, c.b));

      // 2. Clear / Trails Logic
      const { width, height } = canvas;
      let alpha = 0.2;
      if (mode === VisualizerMode.PLASMA) alpha = 0.15;
      if (mode === VisualizerMode.PARTICLES) alpha = 0.06;
      if (mode === VisualizerMode.NEBULA) alpha = 0.08;
      if (mode === VisualizerMode.FLUID_CURVES) alpha = 0.1;
      if (mode === VisualizerMode.MACRO_BUBBLES) alpha = 0.25;
      
      if (settings.trails) {
          ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`; 
          ctx.fillRect(0, 0, width, height);
      } else {
          ctx.clearRect(0, 0, width, height);
      }
      
      // 3. Glow Logic - Disabled on Low quality due to high CPU cost of shadowBlur
      if (settings.glow && settings.quality !== 'low') {
          ctx.shadowBlur = (mode === VisualizerMode.PLASMA || mode === VisualizerMode.FLUID_CURVES) ? 30 : 15;
          ctx.shadowColor = smoothedColorsHex[0] || '#ffffff';
      } else {
          ctx.shadowBlur = 0;
      }

      // 4. Data Processing
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(dataArray);
      rotationRef.current += 0.005 * settings.speed;

      // 5. Strategy Render
      const renderer = renderersRef.current[mode];
      if (renderer) {
        renderer.draw(ctx, dataArray, width, height, smoothedColorsHex, settings, rotationRef.current);
      }
      requestRef.current = requestAnimationFrame(draw);
    };

    requestRef.current = requestAnimationFrame(draw);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [analyser, mode, colors, settings, canvasRef, renderersRef]);
};