
import React, { useRef, useEffect } from 'react';
import { 
  VisualizerMode, 
  VisualizerSettings, 
  SongInfo, 
  LyricsStyle, 
  IVisualizerRenderer 
} from '../types';
import { 
  BarsRenderer, RingsRenderer, ParticlesRenderer, TunnelRenderer, 
  PlasmaRenderer, ShapesRenderer, NebulaRenderer, 
  KaleidoscopeRenderer, LasersRenderer, StrobeRenderer, SmokeRenderer
} from '../services/visualizerStrategies';

interface VisualizerCanvasProps {
  analyser: AnalyserNode | null;
  mode: VisualizerMode;
  colors: string[];
  settings: VisualizerSettings;
  song: SongInfo | null;
  showLyrics: boolean;
  lyricsStyle: LyricsStyle;
}

const VisualizerCanvas: React.FC<VisualizerCanvasProps> = ({ 
  analyser, mode, colors, settings, song, showLyrics, lyricsStyle
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const rotationRef = useRef<number>(0);
  const lyricsScaleRef = useRef<number>(1.0);
  
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
    [VisualizerMode.STROBE]: new StrobeRenderer(),
    [VisualizerMode.SMOKE]: new SmokeRenderer(),
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

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const width = canvas.width;
    const height = canvas.height;

    let alpha = 0.2;
    if (mode === VisualizerMode.PLASMA) alpha = 0.15;
    if (mode === VisualizerMode.PARTICLES) alpha = 0.06; // 锁定长拖尾
    if (mode === VisualizerMode.NEBULA) alpha = 0.08;
    if (mode === VisualizerMode.SMOKE) alpha = 0.1; // Smooth trails for smoke
    
    if (settings.trails) {
        ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`; 
        ctx.fillRect(0, 0, width, height);
    } else {
        ctx.clearRect(0, 0, width, height);
    }
    
    if (settings.glow) {
        ctx.shadowBlur = mode === VisualizerMode.PLASMA ? 30 : 15;
        ctx.shadowColor = colors[0];
    } else {
        ctx.shadowBlur = 0;
    }

    analyser.getByteFrequencyData(dataArray);
    rotationRef.current += 0.005 * settings.speed;

    const renderer = renderersRef.current[mode];
    if (renderer) {
      renderer.draw(ctx, dataArray, width, height, colors, settings, rotationRef.current);
    }

    if (showLyrics && song && (song.lyricsSnippet || song.identified)) {
       drawLyrics(ctx, dataArray, width, height, colors, song, lyricsStyle, settings, lyricsScaleRef);
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
  }, [analyser, mode, colors, settings, song, showLyrics, lyricsStyle]); 

  return <canvas ref={canvasRef} className={`absolute top-0 left-0 w-full h-full ${settings.hideCursor ? 'cursor-none' : ''}`} />;
};

function drawLyrics(ctx: CanvasRenderingContext2D, data: Uint8Array, w: number, h: number, colors: string[], song: SongInfo, style: LyricsStyle, settings: VisualizerSettings, scaleRef: React.MutableRefObject<number>) {
  const text = (song.lyricsSnippet || "").replace(/\[\d{2}:\d{2}(\.\d{1,3})?\]/g, '').trim();
  if (!text) return;

  let bass = 0;
  for (let i = 0; i < 12; i++) bass += data[i];
  const bassNormalized = (bass / 12) / 255;
  
  ctx.save();
  ctx.translate(w / 2, h / 2);

  const targetScale = 1.0 + (bassNormalized * (style === LyricsStyle.KARAOKE ? 0.45 : 0.2) * settings.sensitivity);
  scaleRef.current += (targetScale - scaleRef.current) * 0.2; 
  ctx.scale(scaleRef.current, scaleRef.current);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (style === LyricsStyle.KARAOKE) {
    ctx.font = `900 ${Math.min(w * 0.08, 64)}px "Inter", sans-serif`;
    const gradient = ctx.createLinearGradient(-w * 0.3, 0, w * 0.3, 0);
    gradient.addColorStop(0, colors[1] || '#fff');
    gradient.addColorStop(0.5, '#fff');
    gradient.addColorStop(1, colors[0] || '#fff');
    ctx.fillStyle = gradient;
  } else if (style === LyricsStyle.MINIMAL) {
    ctx.font = `300 ${Math.min(w * 0.04, 24)}px monospace`;
    ctx.fillStyle = `rgba(255, 255, 255, ${0.7 + bassNormalized * 0.3})`;
    ctx.letterSpacing = "4px";
  } else {
    ctx.font = `italic ${Math.min(w * 0.06, 40)}px serif`;
    ctx.fillStyle = 'white';
  }

  const lines = text.split('\n').slice(0, 6);
  const lineHeight = style === LyricsStyle.KARAOKE ? 75 : 55;
  let startY = -((lines.length * lineHeight) / 2) + (lineHeight / 2);
  lines.forEach(l => {
    ctx.fillText(l, 0, startY);
    startY += lineHeight;
  });
  ctx.restore();
}

export default VisualizerCanvas;