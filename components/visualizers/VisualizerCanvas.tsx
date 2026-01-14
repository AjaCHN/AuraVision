
import React, { useRef, useEffect } from 'react';
import { 
  VisualizerMode, 
  VisualizerSettings, 
  IVisualizerRenderer 
} from '../../types';
import { 
  BarsRenderer, RingsRenderer, ParticlesRenderer, TunnelRenderer, 
  PlasmaRenderer, ShapesRenderer, NebulaRenderer, 
  KaleidoscopeRenderer, LasersRenderer
} from '../../services/visualizerStrategies';
import { lerpHex } from '../../services/colorUtils';

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
  const requestRef = useRef<number>(0);
  const rotationRef = useRef<number>(0);
  
  // Store current display colors for smooth transition
  const currentColorsRef = useRef<string[]>(colors);
  
  const renderersRef = useRef<Partial<Record<VisualizerMode, IVisualizerRenderer>>>({
    [VisualizerMode.BARS]: new BarsRenderer(),
    [VisualizerMode.RINGS]: new RingsRenderer(),
    [VisualizerMode.PARTICLES]: new ParticlesRenderer(),
    [VisualizerMode.TUNNEL]: new TunnelRenderer(),
    [VisualizerMode.PLASMA]: new PlasmaRenderer(),
    [VisualizerMode.SHAPES]: new ShapesRenderer(),
    [VisualizerMode.NEBULA]: new NebulaRenderer(),
    [VisualizerMode.KALEIDOSCOPE]: new KaleidoscopeRenderer(),
    [VisualizerMode.LASERS]: new LasersRenderer(),
  });

  useEffect(() => {
    (Object.values(renderersRef.current) as (IVisualizerRenderer | undefined)[]).forEach(r => {
      if (r && canvasRef.current) r.init(canvasRef.current);
    });
  }, []);

  const draw = () => {
    if (!analyser || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Smoothly interpolate colors towards target props.colors
    // Reduced to 0.002 for extremely smooth, breathing-like transition
    const lerpFactor = 0.002; 
    const smoothedColors = currentColorsRef.current.map((curr, i) => {
        const target = colors[i] || colors[0] || '#ffffff';
        return lerpHex(curr, target, lerpFactor);
    });
    currentColorsRef.current = smoothedColors;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const width = canvas.width;
    const height = canvas.height;

    let alpha = 0.2;
    if (mode === VisualizerMode.PLASMA) alpha = 0.15;
    if (mode === VisualizerMode.PARTICLES) alpha = 0.06; // 锁定长拖尾
    if (mode === VisualizerMode.NEBULA) alpha = 0.08;
    
    if (settings.trails) {
        ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`; 
        ctx.fillRect(0, 0, width, height);
    } else {
        ctx.clearRect(0, 0, width, height);
    }
    
    if (settings.glow) {
        ctx.shadowBlur = mode === VisualizerMode.PLASMA ? 30 : 15;
        ctx.shadowColor = smoothedColors[0];
    } else {
        ctx.shadowBlur = 0;
    }

    analyser.getByteFrequencyData(dataArray);
    rotationRef.current += 0.005 * settings.speed;

    const renderer = renderersRef.current[mode];
    if (renderer) {
      renderer.draw(ctx, dataArray, width, height, smoothedColors, settings, rotationRef.current);
    }

    requestRef.current = requestAnimationFrame(draw);
  };

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    requestRef.current = requestAnimationFrame(draw);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [analyser, mode, colors, settings]); 

  return <canvas ref={canvasRef} className={`absolute top-0 left-0 w-full h-full ${settings.hideCursor ? 'cursor-none' : ''}`} />;
};

export default VisualizerCanvas;
