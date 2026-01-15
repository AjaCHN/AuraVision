// FIX: Import React to provide the type for React.RefObject.
import React, { useRef, useEffect } from 'react';
import { VisualizerSettings } from '../types';

interface UseAudioPulseProps {
  elementRef: React.RefObject<HTMLElement>;
  analyser: AnalyserNode | null;
  settings: Pick<VisualizerSettings, 'sensitivity'>;
  isEnabled: boolean;
  pulseStrength?: number;
  opacityStrength?: number;
  baseOpacity?: number;
}

export const useAudioPulse = ({
  elementRef,
  analyser,
  settings,
  isEnabled,
  pulseStrength = 0.5,
  opacityStrength = 0.4,
  baseOpacity = 1.0,
}: UseAudioPulseProps) => {
  const requestRef = useRef<number>(0);

  useEffect(() => {
    const cleanup = () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (elementRef.current) {
        // Remove pulse-related styles while preserving other transforms
        const existingTransform = elementRef.current.style.transform;
        const newTransform = existingTransform.replace(/scale\([^)]*\)/, '').trim();
        elementRef.current.style.transform = newTransform;
        elementRef.current.style.opacity = `${baseOpacity}`;
        elementRef.current.style.willChange = 'auto';
      }
    };

    if (!isEnabled) {
      cleanup();
      return;
    }

    if (elementRef.current) {
      // Opt-in to GPU acceleration for the pulsing elements
      elementRef.current.style.willChange = 'transform, opacity';
    }

    const animate = () => {
      if (elementRef.current && analyser) {
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);
        
        let bass = 0;
        for (let i = 0; i < 10; i++) bass += dataArray[i];
        const bassNormalized = (bass / 10) / 255;

        const scale = 1 + (bassNormalized * pulseStrength * settings.sensitivity);
        const opacity = Math.min(1, (1.0 - opacityStrength + bassNormalized * opacityStrength) * baseOpacity);

        // Update transform precisely
        const existingTransform = elementRef.current.style.transform.replace(/scale\([^)]*\)/, '').trim();
        elementRef.current.style.transform = existingTransform ? `${existingTransform} scale(${scale})` : `scale(${scale})`;
        elementRef.current.style.opacity = `${opacity}`;
      }
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return cleanup;
  }, [isEnabled, analyser, settings.sensitivity, pulseStrength, opacityStrength, baseOpacity, elementRef]);
};