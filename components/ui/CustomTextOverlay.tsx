
import React, { useRef, useEffect } from 'react';
import { VisualizerSettings } from '../../types';

interface CustomTextOverlayProps {
  settings: VisualizerSettings;
  analyser: AnalyserNode | null;
}

const CustomTextOverlay: React.FC<CustomTextOverlayProps> = ({ settings, analyser }) => {
  const textRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);

  // Default size is 12vw, so settings.customTextSize (default 12) maps to that.
  // We constrain it with pixel limits.
  const sizeVw = settings.customTextSize || 12;
  const sizePx = sizeVw * 13; // rough conversion approximation

  useEffect(() => {
    if (!settings.showCustomText || !settings.customText) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      return;
    }

    const animate = () => {
      const baseOpacity = settings.customTextOpacity !== undefined ? settings.customTextOpacity : 1.0;

      if (textRef.current && analyser && settings.textPulse) {
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);
        
        // Calculate bass energy (first 10 bins)
        let bass = 0;
        for (let i = 0; i < 10; i++) {
          bass += dataArray[i];
        }
        bass = (bass / 10) / 255;

        // Scale based on bass and sensitivity
        const scale = 1 + (bass * 0.5 * settings.sensitivity);
        const rotation = settings.customTextRotation || 0;
        
        // Combine transforms: Rotation first, then Scale
        textRef.current.style.transform = `rotate(${rotation}deg) scale(${scale})`;
        
        // Calculate pulse intensity and combine with user slider
        const pulseEffect = 0.6 + bass * 0.4; 
        textRef.current.style.opacity = `${pulseEffect * baseOpacity}`;

      } else if (textRef.current) {
        // Static state if pulse disabled
        const rotation = settings.customTextRotation || 0;
        textRef.current.style.transform = `rotate(${rotation}deg) scale(1)`;
        textRef.current.style.opacity = `${0.9 * baseOpacity}`;
      }
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [settings.showCustomText, settings.customText, settings.textPulse, settings.sensitivity, settings.customTextRotation, settings.customTextOpacity, analyser]);

  if (!settings.showCustomText || !settings.customText) return null;

  return (
    <div 
      className="pointer-events-none fixed top-1/2 left-1/2 z-[100] w-full text-center flex items-center justify-center"
      style={{ transform: 'translate(-50%, -50%)' }}
    >
      <div 
        ref={textRef} 
        className="text-white font-black tracking-widest uppercase transition-transform duration-75 ease-out select-none inline-block origin-center"
        style={{ 
            fontSize: `min(${sizeVw}vw, ${sizePx}px)`, 
            // Removed WebkitTextStroke for cleaner look
            whiteSpace: 'pre-wrap',
            lineHeight: 1.1,
            fontFamily: settings.customTextFont || 'Inter, sans-serif'
        }}
      >
        {settings.customText}
      </div>
    </div>
  );
};

export default CustomTextOverlay;
