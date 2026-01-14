
import React, { useRef, useEffect } from 'react';
import { VisualizerSettings } from '../../core/types';

interface CustomTextOverlayProps {
  settings: VisualizerSettings;
  analyser: AnalyserNode | null;
}

const CustomTextOverlay: React.FC<CustomTextOverlayProps> = ({ settings, analyser }) => {
  const textRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);
  const sizeVw = settings.customTextSize || 12;
  const sizePx = sizeVw * 13;

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
        let bass = 0;
        for (let i = 0; i < 10; i++) bass += dataArray[i];
        bass = (bass / 10) / 255;
        const scale = 1 + (bass * 0.5 * settings.sensitivity);
        const rotation = settings.customTextRotation || 0;
        textRef.current.style.transform = `rotate(${rotation}deg) scale(${scale})`;
        textRef.current.style.opacity = `${(0.6 + bass * 0.4) * baseOpacity}`;
      } else if (textRef.current) {
        const rotation = settings.customTextRotation || 0;
        textRef.current.style.transform = `rotate(${rotation}deg) scale(1)`;
        textRef.current.style.opacity = `${0.9 * baseOpacity}`;
      }
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [settings.showCustomText, settings.customText, settings.textPulse, settings.sensitivity, settings.customTextRotation, settings.customTextOpacity, analyser]);

  if (!settings.showCustomText || !settings.customText) return null;

  // Position mapping
  const getPositionClasses = () => {
      const pos = settings.customTextPosition || 'mc';
      const map: Record<string, string> = {
          tl: 'top-8 left-8 text-left items-start',
          tc: 'top-8 left-1/2 -translate-x-1/2 text-center items-center',
          tr: 'top-8 right-8 text-right items-end',
          ml: 'top-1/2 left-8 -translate-y-1/2 text-left items-start',
          mc: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center items-center',
          mr: 'top-1/2 right-8 -translate-y-1/2 text-right items-end',
          bl: 'bottom-8 left-8 text-left items-start',
          bc: 'bottom-8 left-1/2 -translate-x-1/2 text-center items-center',
          br: 'bottom-8 right-8 text-right items-end',
      };
      return map[pos] || map.mc;
  };

  return (
    <div className={`pointer-events-none fixed z-[100] flex flex-col ${getPositionClasses()}`}>
      <div ref={textRef} className="font-black tracking-widest uppercase transition-transform duration-75 ease-out select-none inline-block origin-center"
        style={{ 
            color: settings.customTextColor || '#ffffff',
            fontSize: `min(${sizeVw}vw, ${sizePx}px)`, 
            whiteSpace: 'pre-wrap', lineHeight: 1.1,
            fontFamily: settings.customTextFont || 'Inter, sans-serif'
        }}
      >
        {settings.customText}
      </div>
    </div>
  );
};

export default CustomTextOverlay;