import React, { memo } from 'react';
import { VisualizerMode } from '../../../core/types';

interface VisualizerPreviewProps {
  mode: VisualizerMode;
  name: string;
  isActive: boolean;
  onClick: () => void;
}

const styles: Record<VisualizerMode, React.CSSProperties> = {
    [VisualizerMode.PLASMA]: { background: 'radial-gradient(circle, #ec4899, #8b5cf6, #3b82f6)' },
    [VisualizerMode.BARS]: { background: 'linear-gradient(to top, #3b82f6, #8b5cf6 50%, #3b82f6)' },
    [VisualizerMode.PARTICLES]: { background: 'radial-gradient(circle, white 2%, transparent 4%), black' },
    [VisualizerMode.TUNNEL]: { background: 'radial-gradient(circle, transparent 20%, #8b5cf6 50%, black 80%)' },
    [VisualizerMode.RINGS]: { background: 'radial-gradient(circle, transparent 30%, #ec4899 35%, transparent 40%), radial-gradient(circle, transparent 60%, #8b5cf6 65%, transparent 70%), black' },
    [VisualizerMode.NEBULA]: { background: 'radial-gradient(ellipse at bottom, #2e1065, #000)' },
    [VisualizerMode.LASERS]: { background: 'linear-gradient(10deg, transparent 48%, #ff00ff 50%, transparent 52%), linear-gradient(170deg, transparent 48%, #00ffff 50%, transparent 52%), black' },
    [VisualizerMode.FLUID_CURVES]: { background: 'linear-gradient(to right, #3b82f6, #8b5cf6, #ec4899)'},
    [VisualizerMode.MACRO_BUBBLES]: { background: 'radial-gradient(circle at 20% 30%, #8b5cf6 20%, transparent 21%), radial-gradient(circle at 75% 80%, #ec4899 15%, transparent 16%), black' },
    [VisualizerMode.SILK]: { background: 'linear-gradient(45deg, #a3e635, #22c55e, #14532d)' },
    [VisualizerMode.LIQUID]: { background: 'radial-gradient(circle, #4c1d95, #1e1b4b)' },
    [VisualizerMode.TERRAIN]: { background: 'linear-gradient(to top, #1e1b4b, #4c1d95 60%, #fde047)' },
};


export const VisualizerPreview: React.FC<VisualizerPreviewProps> = memo(({ mode, name, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      aria-pressed={isActive}
      className={`relative rounded-xl border-2 transition-all duration-300 group overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-blue-500 ${isActive ? 'border-blue-500 shadow-lg' : 'border-white/10 hover:border-white/30'}`}
    >
      <div 
        className="h-16 w-full bg-black transition-transform duration-500 ease-in-out group-hover:scale-110"
        style={styles[mode] || { background: 'black' }}
      ></div>
      <div className={`absolute inset-0 flex items-center justify-center p-2 text-center transition-colors duration-300 ${isActive ? 'bg-black/40' : 'bg-black/60 group-hover:bg-black/50'}`}>
        <span className={`text-[10px] font-bold uppercase tracking-widest leading-tight ${isActive ? 'text-white' : 'text-white/70 group-hover:text-white'}`}>{name}</span>
      </div>
    </button>
  );
});