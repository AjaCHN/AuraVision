import React, { useRef, useEffect } from 'react';
import { 
  VisualizerMode, 
  VisualizerSettings, 
  IVisualizerRenderer 
} from '../../core/types';
import { 
  BarsRenderer, RingsRenderer, ParticlesRenderer, TunnelRenderer, 
  PlasmaRenderer, NebulaRenderer, 
  LasersRenderer, FluidCurvesRenderer, MacroBubblesRenderer
} from '../../core/services/visualizerStrategies';
import { useRenderLoop } from '../../core/hooks/useRenderLoop';

interface VisualizerCanvasProps {
  analyser: AnalyserNode | null;
  mode: VisualizerMode;
  colors: string[];
  settings: VisualizerSettings;
}

const VisualizerCanvas: React.FC<VisualizerCanvasProps> = ({ 
  analyser, mode, colors, settings
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const renderersRef = useRef<Partial<Record<VisualizerMode, IVisualizerRenderer>>>({
    [VisualizerMode.BARS]: new BarsRenderer(),
    [VisualizerMode.RINGS]: new RingsRenderer(),
    [VisualizerMode.PARTICLES]: new ParticlesRenderer(),
    [VisualizerMode.TUNNEL]: new TunnelRenderer(),
    [VisualizerMode.PLASMA]: new PlasmaRenderer(),
    [VisualizerMode.NEBULA]: new NebulaRenderer(),
    [VisualizerMode.LASERS]: new LasersRenderer(),
    [VisualizerMode.FLUID_CURVES]: new FluidCurvesRenderer(),
    [VisualizerMode.MACRO_BUBBLES]: new MacroBubblesRenderer(),
  });

  useEffect(() => {
    (Object.values(renderersRef.current) as (IVisualizerRenderer | undefined)[]).forEach(r => {
      if (r && canvasRef.current) r.init(canvasRef.current);
    });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useRenderLoop({ canvasRef, analyser, renderersRef, mode, colors, settings });

  return <canvas ref={canvasRef} className={`absolute top-0 left-0 w-full h-full ${settings.hideCursor ? 'cursor-none' : ''}`} />;
};

export default VisualizerCanvas;