import React, { useEffect, useRef } from 'react';
import { VisualizerMode, VisualizerSettings, SongInfo, LyricsStyle, IVisualizerRenderer } from '../types';
import { 
  BarsRenderer, RingsRenderer, ParticlesRenderer, TunnelRenderer, 
  PlasmaRenderer, ShapesRenderer, SmokeRenderer, RippleRenderer 
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
  analyser, 
  mode, 
  colors, 
  settings, 
  song,
  showLyrics,
  lyricsStyle
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const startTimeRef = useRef<number>(Date.now());
  const rotationRef = useRef<number>(0);
  const lyricsScaleRef = useRef<number>(1.0);
  
  // Strategy Pattern: Store initialized renderers
  const renderersRef = useRef<Record<VisualizerMode, IVisualizerRenderer>>({
    [VisualizerMode.BARS]: new BarsRenderer(),
    [VisualizerMode.RINGS]: new RingsRenderer(),
    [VisualizerMode.PARTICLES]: new ParticlesRenderer(),
    [VisualizerMode.TUNNEL]: new TunnelRenderer(),
    [VisualizerMode.PLASMA]: new PlasmaRenderer(),
    [VisualizerMode.SHAPES]: new ShapesRenderer(),
    [VisualizerMode.SMOKE]: new SmokeRenderer(),
    [VisualizerMode.RIPPLE]: new RippleRenderer(),
  });

  // Initialize all renderers once
  useEffect(() => {
    // Some renderers might need initial canvas sizing if they cache it, 
    // but our current strategies use 'w' and 'h' passed in draw()
    Object.values(renderersRef.current).forEach(r => {
      if (canvasRef.current) r.init(canvasRef.current);
    });
  }, []);

  // Reset timer when analyser changes
  useEffect(() => {
    if (analyser) {
      startTimeRef.current = Date.now();
    }
  }, [analyser]);

  const draw = () => {
    if (!analyser || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const width = canvas.width;
    const height = canvas.height;

    // --- Background Handling ---
    let alpha = 0.2;
    if (mode === VisualizerMode.PLASMA) alpha = 0.15;
    if (mode === VisualizerMode.PARTICLES) alpha = 0.3; 
    if (mode === VisualizerMode.SMOKE) alpha = 0.05; 
    if (mode === VisualizerMode.RIPPLE) alpha = 0.2;
    
    if (settings.trails) {
        if (mode === VisualizerMode.RIPPLE) {
           ctx.fillStyle = `rgba(5, 10, 20, ${alpha})`;
        } else {
           ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`; 
        }
        ctx.fillRect(0, 0, width, height);
    } else {
        ctx.clearRect(0, 0, width, height);
        if (mode === VisualizerMode.RIPPLE) {
           ctx.fillStyle = '#050a14';
           ctx.fillRect(0, 0, width, height);
        }
    }
    
    // --- Global Glow Settings ---
    if (settings.glow && mode !== VisualizerMode.PLASMA) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = colors[0];
    } else {
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';
    }

    analyser.getByteFrequencyData(dataArray);
    rotationRef.current += 0.005 * settings.speed;

    // --- Strategy Execution ---
    const renderer = renderersRef.current[mode];
    if (renderer) {
      renderer.draw(ctx, dataArray, width, height, colors, settings, rotationRef.current);
    }

    // --- Lyrics Overlay ---
    if (showLyrics && song && (song.lyricsSnippet || song.identified)) {
       drawLyrics(ctx, dataArray, width, height, colors, song, lyricsStyle, settings, lyricsScaleRef);
    }

    // --- Timer ---
    const now = Date.now();
    const elapsed = now - startTimeRef.current;
    const m = Math.floor(elapsed / 60000);
    const s = Math.floor((elapsed % 60000) / 1000);
    const timeStr = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    
    ctx.save();
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '12px "Inter", sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillText(timeStr, width - 24, 24);
    ctx.restore();

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

  // Double Click for Fullscreen
  const toggleFullscreen = () => {
     if (!document.fullscreenElement) {
         document.documentElement.requestFullscreen().catch(e => console.log(e));
     } else {
         document.exitFullscreen();
     }
  };

  return <canvas ref={canvasRef} onDoubleClick={toggleFullscreen} className="absolute top-0 left-0 w-full h-full cursor-none" />;
};

// --- Lyrics Drawer (Kept localized as it's shared overlay logic) ---
function drawLyrics(
  ctx: CanvasRenderingContext2D,
  data: Uint8Array,
  w: number,
  h: number,
  colors: string[],
  song: SongInfo,
  style: LyricsStyle,
  settings: VisualizerSettings,
  scaleRef: React.MutableRefObject<number>
) {
  const text = song.lyricsSnippet || (song.identified ? "..." : "");
  if (!text) return;

  let bass = 0;
  for (let i = 0; i < 10; i++) bass += data[i];
  bass /= 10;
  const bassNormalized = bass / 255;
  
  ctx.save();
  ctx.translate(w / 2, h / 2);

  let scale = 1.0;
  let rotation = 0;

  if (style === LyricsStyle.KARAOKE) {
    const targetScale = 1.0 + (bassNormalized * 0.25 * settings.sensitivity);
    scaleRef.current += (targetScale - scaleRef.current) * 0.1;
    scale = scaleRef.current;
    rotation = (bassNormalized * 0.05) * (Math.random() > 0.5 ? 1 : -1);
  } else if (style === LyricsStyle.MINIMAL) {
    scale = 1.0 + (bassNormalized * 0.1 * settings.sensitivity);
    scaleRef.current = scale; 
  } else {
    scale = 1.0 + (bassNormalized * 0.2 * settings.sensitivity);
    scaleRef.current = scale;
  }

  ctx.scale(scale, scale);
  ctx.rotate(rotation);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (style === LyricsStyle.KARAOKE) {
    ctx.font = `900 ${Math.min(w * 0.08, 60)}px "Inter", sans-serif`;
    const gradient = ctx.createLinearGradient(-200, 0, 200, 0);
    gradient.addColorStop(0, colors[1]);
    gradient.addColorStop(0.5, '#ffffff');
    gradient.addColorStop(1, colors[0]);
    ctx.fillStyle = gradient;
    ctx.shadowBlur = 20 * bassNormalized;
    ctx.shadowColor = colors[0];
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(0,0,0,0.8)';
    ctx.strokeText(" " + text + " ", 0, 0); 
  } else if (style === LyricsStyle.MINIMAL) {
    ctx.font = `300 ${Math.min(w * 0.04, 24)}px monospace`;
    ctx.fillStyle = `rgba(255, 255, 255, ${0.7 + bassNormalized * 0.3})`;
    ctx.shadowBlur = 0;
    ctx.letterSpacing = "4px";
  } else {
    ctx.font = `italic ${Math.min(w * 0.06, 40)}px serif`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 4;
  }

  const maxWidth = text.length > 20 ? Math.min(w * 0.8, 600) : w * 0.9;
  const lineHeight = style === LyricsStyle.KARAOKE ? 70 : 50;
  const processedText = text.replace(/([,.;:!?])/g, '$1 ');

  let words: string[];
  if (processedText.includes(' ')) {
      words = processedText.split(/\s+/);
  } else {
      words = processedText.split('');
  }

  let line = '';
  const lines = [];

  for (let n = 0; n < words.length; n++) {
    const spacer = processedText.includes(' ') ? ' ' : '';
    const testLine = line + words[n] + spacer;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      lines.push(line);
      line = words[n] + spacer;
    } else {
      line = testLine;
    }
  }
  lines.push(line);

  const totalHeight = lines.length * lineHeight;
  let startY = -(totalHeight / 2) + (lineHeight / 2);

  lines.forEach((l) => {
    if (style === LyricsStyle.KARAOKE) {
        ctx.strokeText(l, 0, startY);
    }
    ctx.fillText(l, 0, startY);
    startY += lineHeight;
  });

  ctx.restore();
}

export default VisualizerCanvas;