import React, { useRef, useEffect } from 'react';
import { 
  VisualizerMode, 
  VisualizerSettings, 
  IVisualizerRenderer 
} from '../../core/types';
import { 
  BarsRenderer, RingsRenderer, ParticlesRenderer, TunnelRenderer, 
  PlasmaRenderer, ShapesRenderer, NebulaRenderer, 
  KaleidoscopeRenderer, LasersRenderer, FluidCurvesRenderer, MacroBubblesRenderer
} from '../../core/services/visualizerStrategies';
import { lerpHex } from '../../core/services/colorUtils';

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
  // Initial current colors should match the initial target colors length
  const currentColorsRef = useRef<string[]>([]);
  
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
    [VisualizerMode.FLUID_CURVES]: new FluidCurvesRenderer(),
    [VisualizerMode.MACRO_BUBBLES]: new MacroBubblesRenderer(),
  });

  useEffect(() => {
    (Object.values(renderersRef.current) as (IVisualizerRenderer | undefined)[]).forEach(r => {
      if (r && canvasRef.current) r.init(canvasRef.current);
    });
    // Sync initial colors
    currentColorsRef.current = [...colors];
  }, []);

  const draw = () => {
    if (!analyser || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Smooth Color Transition Logic
    const lerpFactor = 0.05; // Balanced for 60fps
    const targetColors = colors.length > 0 ? colors : ['#ffffff'];
    
    // Ensure current colors array matches target length to prevent undefined index errors
    if (currentColorsRef.current.length !== targetColors.length) {
        const lastValid = currentColorsRef.current[0] || targetColors[0];
        const newArr = new Array(targetColors.length).fill(lastValid);
        currentColorsRef.current.forEach((c, i) => { if(i < newArr.length) newArr[i] = c; });
        currentColorsRef.current = newArr;
    }

    const smoothedColors = currentColorsRef.current.map((curr, i) => {
        const target = targetColors[i] || targetColors[0];
        return lerpHex(curr, target, lerpFactor);
    });
    currentColorsRef.current = smoothedColors;

    // 2. Clear / Trails Logic
    const width = canvas.width;
    const height = canvas.height;
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
    
    // 3. Glow Logic
    if (settings.glow) {
        ctx.shadowBlur = (mode === VisualizerMode.PLASMA || mode === VisualizerMode.FLUID_CURVES) ? 30 : 15;
        ctx.shadowColor = smoothedColors[0] || '#ffffff';
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