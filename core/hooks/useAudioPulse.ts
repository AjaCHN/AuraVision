import { useRef, useEffect } from 'react';
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
    // This function runs when the hook is unmounted or when isEnabled becomes false.
    const cleanup = () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (elementRef.current) {
        // PREVIOUS BUG: `elementRef.current.style.transform = ''` would erase all transforms,
        // including rotation set by the component itself.
        // FIX: Precisely remove only the scale transform, preserving others like rotate.
        const existingTransform = elementRef.current.style.transform;
        const newTransform = existingTransform.replace(/scale\([^)]*\)/, '').trim();
        elementRef.current.style.transform = newTransform;
        elementRef.current.style.opacity = `${baseOpacity}`;
      }
    };

    if (!isEnabled) {
      cleanup();
      return;
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

        // Additive Transform: Read existing transforms, remove our own, then add it back.
        // This ensures compatibility with other transforms like rotation.
        const existingTransform = elementRef.current.style.transform.replace(/scale\([^)]*\)/, '').trim();
        elementRef.current.style.transform = `${existingTransform} scale(${scale})`;
        elementRef.current.style.opacity = `${opacity}`;
      }
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return cleanup;
  }, [isEnabled, analyser, settings.sensitivity, pulseStrength, opacityStrength, baseOpacity, elementRef]);
};
