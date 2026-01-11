import React, { useEffect, useRef } from 'react';
import { VisualizerMode, VisualizerSettings, SongInfo, LyricsStyle } from '../types';

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
  
  // State Refs for specific modes
  const particlesRef = useRef<Array<{x: number, y: number, vx: number, vy: number, life: number, size: number}>>([]);
  const rotationRef = useRef<number>(0); // For rotating elements
  
  // New Refs for added modes
  const smokeParticlesRef = useRef<Array<{
    x: number, 
    y: number, 
    vx: number, 
    vy: number, 
    size: number, 
    alpha: number, 
    color: string, 
    life: number, 
    maxLife: number,
    angle: number, 
    angleSpeed: number,
    initialX: number // Track origin for swirl
  }>>([]);

  const ripplesRef = useRef<Array<{
    x: number, 
    y: number, 
    radius: number, 
    maxRadius: number, 
    alpha: number, 
    speed: number, 
    color: string,
    lineWidth: number
  }>>([]);

  // Reset timer when analyser (session) changes
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
    
    // Setup canvas
    const width = canvas.width;
    const height = canvas.height;

    // Handle Trails (Motion Blur) vs Clear
    let alpha = 0.2;
    if (mode === VisualizerMode.PLASMA) alpha = 0.15; // Slightly clearer for flashing
    if (mode === VisualizerMode.PARTICLES) alpha = 0.3; 
    
    // Smoke needs very high transparency for accumulation effect
    if (mode === VisualizerMode.SMOKE) alpha = 0.05; 
    
    // Ripple looks better with a dark watery fade
    if (mode === VisualizerMode.RIPPLE) alpha = 0.2;

    if (settings.trails) {
        if (mode === VisualizerMode.RIPPLE) {
           // Deep blue fade for water effect
           ctx.fillStyle = `rgba(5, 10, 20, ${alpha})`;
        } else {
           ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`; 
        }
        ctx.fillRect(0, 0, width, height);
    } else {
        ctx.clearRect(0, 0, width, height);
        if (mode === VisualizerMode.RIPPLE) {
           // Background fill if trails off
           ctx.fillStyle = '#050a14';
           ctx.fillRect(0, 0, width, height);
        }
    }
    
    // Handle Glow
    if (settings.glow) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = colors[0];
    } else {
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';
    }

    // Get Data (All remaining modes use Frequency Data)
    analyser.getByteFrequencyData(dataArray);

    // Update global rotation for some effects
    rotationRef.current += 0.005 * settings.speed;

    // Drawing Logic
    switch (mode) {
      case VisualizerMode.BARS:
        drawMirroredBars(ctx, dataArray, width, height, colors, bufferLength, settings);
        break;
      case VisualizerMode.RINGS:
        drawRings(ctx, dataArray, width, height, colors, bufferLength, settings, rotationRef.current);
        break;
      case VisualizerMode.PARTICLES:
        drawParticles(ctx, dataArray, width, height, colors, bufferLength, particlesRef.current, settings, rotationRef.current);
        break;
      case VisualizerMode.TUNNEL:
        drawGeometricTunnel(ctx, dataArray, width, height, colors, bufferLength, settings, rotationRef.current);
        break;
      case VisualizerMode.PLASMA:
        drawPlasmaFlow(ctx, dataArray, width, height, colors, bufferLength, settings, rotationRef.current);
        break;
      case VisualizerMode.SHAPES:
        drawAbstractShapes(ctx, dataArray, width, height, colors, bufferLength, settings, rotationRef.current);
        break;
      case VisualizerMode.SMOKE:
        drawSmoke(ctx, dataArray, width, height, colors, bufferLength, smokeParticlesRef.current, settings, rotationRef.current);
        break;
      case VisualizerMode.RIPPLE:
        drawRipples(ctx, dataArray, width, height, colors, bufferLength, ripplesRef.current, settings);
        break;
    }

    // Draw Lyrics (Centered and reactive)
    if (showLyrics && song && (song.lyricsSnippet || song.identified)) {
       drawLyrics(ctx, dataArray, width, height, colors, song, lyricsStyle, settings);
    }

    // Draw Session Timer (Subtle)
    const now = Date.now();
    const elapsed = now - startTimeRef.current;
    const m = Math.floor(elapsed / 60000);
    const s = Math.floor((elapsed % 60000) / 1000);
    const timeStr = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    
    ctx.save();
    // Reset shadow for text to ensure crispness
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

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />;
};

// --- Lyrics Drawer ---

function drawLyrics(
  ctx: CanvasRenderingContext2D,
  data: Uint8Array,
  w: number,
  h: number,
  colors: string[],
  song: SongInfo,
  style: LyricsStyle,
  settings: VisualizerSettings
) {
  const text = song.lyricsSnippet || (song.identified ? "..." : "");
  if (!text) return;

  // Calculate Bass Energy for Jump Effect
  let bass = 0;
  for (let i = 0; i < 10; i++) bass += data[i];
  bass /= 10;
  const bassNormalized = bass / 255;
  
  ctx.save();
  ctx.translate(w / 2, h / 2);

  // Apply Beat Jump (Scale)
  // sensitivity affects how much it jumps
  let scale = 1.0;
  let rotation = 0;

  if (style === LyricsStyle.KARAOKE) {
    // Big jump
    scale = 1.0 + (bassNormalized * 0.4 * settings.sensitivity);
    // Slight tilt on beat
    rotation = (bassNormalized * 0.05) * (Math.random() > 0.5 ? 1 : -1);
  } else if (style === LyricsStyle.MINIMAL) {
    // Subtle breathing
    scale = 1.0 + (bassNormalized * 0.1 * settings.sensitivity);
  } else {
    // Standard pulse
    scale = 1.0 + (bassNormalized * 0.2 * settings.sensitivity);
  }

  ctx.scale(scale, scale);
  ctx.rotate(rotation);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Configure Fonts & Colors based on style
  if (style === LyricsStyle.KARAOKE) {
    ctx.font = `900 ${Math.min(w * 0.08, 60)}px "Inter", sans-serif`;
    
    // Gradient Text
    const gradient = ctx.createLinearGradient(-200, 0, 200, 0);
    gradient.addColorStop(0, colors[1]);
    gradient.addColorStop(0.5, '#ffffff');
    gradient.addColorStop(1, colors[0]);
    ctx.fillStyle = gradient;
    
    // Glow/Shadow
    ctx.shadowBlur = 20 * bassNormalized;
    ctx.shadowColor = colors[0];
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(0,0,0,0.8)';
    ctx.strokeText(" " + text + " ", 0, 0); // Hack for stroke width
  } else if (style === LyricsStyle.MINIMAL) {
    ctx.font = `300 ${Math.min(w * 0.04, 24)}px monospace`;
    ctx.fillStyle = `rgba(255, 255, 255, ${0.7 + bassNormalized * 0.3})`;
    ctx.shadowBlur = 0;
    ctx.letterSpacing = "4px";
  } else {
    // Standard
    ctx.font = `italic ${Math.min(w * 0.06, 40)}px serif`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 4;
  }

  // Word Wrapping
  const maxWidth = w * 0.8;
  const lineHeight = style === LyricsStyle.KARAOKE ? 70 : 50;
  const words = text.split(' ');
  let line = '';
  const lines = [];

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      lines.push(line);
      line = words[n] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line);

  // Draw Lines
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

// --- Drawing Helpers ---

function drawMirroredBars(
  ctx: CanvasRenderingContext2D, 
  data: Uint8Array, 
  w: number, 
  h: number, 
  colors: string[], 
  bufferLength: number, 
  settings: VisualizerSettings
) {
  const barCount = 64; 
  const step = Math.floor(bufferLength / barCount); 
  const barWidth = (w / barCount) / 2; 
  
  const centerX = w / 2;

  for (let i = 0; i < barCount; i++) {
    const value = data[i * step] * settings.sensitivity;
    const barHeight = Math.min((value / 255) * h * 0.8, h * 0.9);
    
    const gradient = ctx.createLinearGradient(0, h/2 + barHeight/2, 0, h/2 - barHeight/2);
    gradient.addColorStop(0, colors[1]);
    gradient.addColorStop(0.5, colors[0]);
    gradient.addColorStop(1, colors[1]);
    
    ctx.fillStyle = gradient;

    // Draw Right Side
    ctx.fillRect(centerX + (i * barWidth), (h - barHeight) / 2, barWidth - 2, barHeight);
    
    // Draw Left Side
    ctx.fillRect(centerX - ((i + 1) * barWidth), (h - barHeight) / 2, barWidth - 2, barHeight);
  }
}

function drawRings(
  ctx: CanvasRenderingContext2D, 
  data: Uint8Array, 
  w: number, 
  h: number, 
  colors: string[], 
  bufferLength: number,
  settings: VisualizerSettings,
  rotation: number
) {
  const centerX = w / 2;
  const centerY = h / 2;
  
  const maxRings = 15;
  
  for(let i = 0; i < maxRings; i++) {
      const freqIndex = i * 8; 
      const val = data[freqIndex] * settings.sensitivity;
      
      const baseR = 30 + (i * 20);
      const offset = Math.min(val, 100);
      const radius = baseR + offset;
      
      ctx.beginPath();
      ctx.strokeStyle = colors[i % colors.length];
      
      ctx.lineWidth = (2 + (val / 40)) * settings.sensitivity;
      
      const startAngle = rotation * (i % 2 === 0 ? 1 : -1) + i; 
      const endAngle = startAngle + (Math.PI * 1.5) + (val / 255); 

      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.stroke();
  }
}

function drawParticles(
  ctx: CanvasRenderingContext2D, 
  data: Uint8Array, 
  w: number, 
  h: number, 
  colors: string[], 
  bufferLength: number,
  particles: Array<{x: number, y: number, vx: number, vy: number, life: number, size: number}>,
  settings: VisualizerSettings,
  rotation: number
) {
    // Dynamic Center Point Calculation
    // Use rotation as a time factor. 
    const time = rotation * 0.8;
    // Drift range is approx 20% of width and 15% of height
    const driftX = Math.sin(time) * (w * 0.2); 
    const driftY = Math.cos(time * 1.3) * (h * 0.15); 

    const centerX = w / 2 + driftX;
    const centerY = h / 2 + driftY;

    let bass = 0;
    for(let i=0; i<10; i++) bass += data[i];
    bass = (bass / 10) / 255; 
    
    let mids = 0;
    for(let i=10; i<50; i++) mids += data[i];
    mids = (mids / 40) / 255;

    if (settings.glow) {
        ctx.save();
        const maxRadius = Math.max(w, h);
        const nebulaRadius = maxRadius * 0.4 + (bass * maxRadius * 0.3 * settings.sensitivity);
        const nebulaColor = colors[1];
        
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, nebulaRadius);
        
        ctx.globalAlpha = 0.2 + (bass * 0.3);
        gradient.addColorStop(0, nebulaColor);
        gradient.addColorStop(0.5, colors[2] || colors[0]);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
    }

    const maxParticles = 200;
    
    if (particles.length < maxParticles) {
        const count = 5;
        for(let i=0; i<count; i++) {
            particles.push({
                x: (Math.random() - 0.5) * w * 2, 
                y: (Math.random() - 0.5) * h * 2,
                life: w * (Math.random() * 0.5 + 0.5), 
                vx: w, 
                vy: 0, 
                size: Math.random() * 2 + 0.5
            });
        }
    }

    const warpSpeed = (0.5 + (mids * 40)) * settings.speed * settings.sensitivity;

    ctx.fillStyle = '#fff';
    
    const fieldRotation = rotation * 0.3;

    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        if (Math.abs(p.x) > w * 2 || Math.abs(p.y) > h * 2) {
             p.life = -1; 
        }

        const prevZ = p.life;
        p.vx = prevZ; 
        
        p.life -= warpSpeed;

        if (p.life <= 10 || p.x === 0 || p.y === 0) {
            p.x = (Math.random() - 0.5) * w * 2;
            p.y = (Math.random() - 0.5) * h * 2;
            p.life = w;
            p.vx = w;
            p.size = Math.random() * 2 + 0.5;
            continue;
        }

        const fov = 250;
        const scale = fov / p.life;
        const prevScale = fov / p.vx;
        
        const cosR = Math.cos(fieldRotation);
        const sinR = Math.sin(fieldRotation);
        const rotX = p.x * cosR - p.y * sinR;
        const rotY = p.x * sinR + p.y * cosR;

        const sx = centerX + rotX * scale;
        const sy = centerY + rotY * scale;
        
        const prevSx = centerX + rotX * prevScale;
        const prevSy = centerY + rotY * prevScale;

        const size = p.size * scale;

        let alpha = 1;
        if (p.life > w * 0.8) alpha = (w - p.life) / (w * 0.2); 
        if (p.life < 50) alpha = p.life / 50; 

        const colorIndex = Math.floor(Math.random() * colors.length); 
        ctx.fillStyle = (warpSpeed > 10) ? colors[colorIndex] : '#ffffff';
        ctx.globalAlpha = alpha;

        ctx.beginPath();
        
        const dist = Math.sqrt(Math.pow(sx - prevSx, 2) + Math.pow(sy - prevSy, 2));
        
        if (dist > size * 2 && settings.trails) {
            ctx.strokeStyle = ctx.fillStyle;
            ctx.lineWidth = size;
            ctx.lineCap = 'round';
            ctx.moveTo(prevSx, prevSy);
            ctx.lineTo(sx, sy);
            ctx.stroke();
        } else {
            ctx.arc(sx, sy, size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    ctx.globalAlpha = 1.0;
}

function drawGeometricTunnel(
    ctx: CanvasRenderingContext2D,
    data: Uint8Array,
    w: number,
    h: number,
    colors: string[],
    bufferLength: number,
    settings: VisualizerSettings,
    rotation: number
) {
    const centerX = w / 2;
    const centerY = h / 2;
    
    const shapes = 12;
    const maxRadius = Math.max(w, h) * 0.7;

    let energy = 0;
    for(let i=0; i<100; i++) energy += data[i];
    energy = (energy / 100) * settings.sensitivity;

    ctx.save();
    ctx.translate(centerX, centerY);
    
    for (let i = 0; i < shapes; i++) {
        const dataIndex = Math.floor((i / shapes) * 40); 
        const value = data[dataIndex] * settings.sensitivity;
        
        const depth = (i + (rotation * 5)) % shapes; 
        const scale = Math.pow(depth / shapes, 2); 

        const radius = maxRadius * scale * (1 + (value / 500)); 
        const rotationOffset = rotation * (i % 2 === 0 ? 1 : -1) + (depth * 0.2);

        ctx.strokeStyle = colors[i % colors.length];
        ctx.lineWidth = (2 + (scale * 30)) * settings.sensitivity;
        ctx.globalAlpha = scale; 

        ctx.beginPath();
        const sides = 6; 
        for (let j = 0; j <= sides; j++) {
            const angle = (j / sides) * Math.PI * 2 + rotationOffset;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            if (j === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
    }
    
    ctx.restore();
}

function drawPlasmaFlow(
    ctx: CanvasRenderingContext2D,
    data: Uint8Array,
    w: number,
    h: number,
    colors: string[],
    bufferLength: number,
    settings: VisualizerSettings,
    rotation: number
) {
    const blobs = 6; 
    
    // "screen" blend mode for glowing/additive light effect
    ctx.globalCompositeOperation = 'screen';

    for (let i = 0; i < blobs; i++) {
        let rangeAvg = 0;
        // Map blobs to frequency bands (Bass heavily emphasized for first 2 blobs)
        if (i < 2) rangeAvg = getAverage(data, 0, 8); // Deep Bass
        else if (i < 4) rangeAvg = getAverage(data, 8, 40); // Mids
        else rangeAvg = getAverage(data, 40, 150); // Highs

        // Normalize 0-1
        const normalized = rangeAvg / 255;
        
        // Use power function to make beats "pop" (flash) more distinctively
        // This suppresses low noise and exaggerates peaks
        const intensity = Math.pow(normalized, 1.8) * settings.sensitivity;

        const speed = (0.2 + (i * 0.1)) * settings.speed;
        
        // Lissajous curve motion
        const t = rotation * speed + (i * Math.PI / 3);
        const xOffset = Math.sin(t) * (w * 0.35) * Math.cos(t * 0.5);
        const yOffset = Math.cos(t * 0.8) * (h * 0.35) * Math.sin(t * 0.3);
        
        const x = w/2 + xOffset;
        const y = h/2 + yOffset;
        
        const minDim = Math.min(w, h);
        
        // Dynamic Size
        const breathing = Math.sin(rotation * 2 + i) * 0.05;
        const audioPulse = intensity * 0.4; 
        const baseSizeRatio = 0.2 + (i % 3) * 0.05; 
        
        const rawRadius = minDim * (baseSizeRatio + breathing + audioPulse);
        const radius = Math.max(minDim * 0.05, rawRadius); 
        
        const color = colors[i % colors.length];
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        
        // FLASH EFFECT LOGIC:
        // 1. Dynamic Alpha: Darker when quiet, full opacity when loud
        const alpha = Math.min(1.0, 0.2 + intensity * 0.8);
        
        // 2. Dynamic Core: The white center expands with volume (Flash)
        const whiteCoreRadius = Math.min(0.8, 0.05 + intensity * 0.5);
        
        gradient.addColorStop(0, '#ffffff'); 
        gradient.addColorStop(whiteCoreRadius, '#ffffff'); // Flash core
        gradient.addColorStop(Math.min(0.95, whiteCoreRadius + 0.4), color); // Color falloff
        gradient.addColorStop(1, 'transparent');
        
        ctx.globalAlpha = alpha;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }
    
    ctx.globalAlpha = 1.0;
    ctx.globalCompositeOperation = 'source-over';
}

function drawAbstractShapes(
    ctx: CanvasRenderingContext2D,
    data: Uint8Array,
    w: number,
    h: number,
    colors: string[],
    bufferLength: number,
    settings: VisualizerSettings,
    rotation: number
) {
    const centerX = w / 2;
    const centerY = h / 2;

    const bass = getAverage(data, 0, 10) * settings.sensitivity;
    const mids = getAverage(data, 10, 50) * settings.sensitivity;
    const treble = getAverage(data, 50, 100) * settings.sensitivity;

    ctx.lineWidth = 4;

    // 1. Central Bass Triangle
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation); 
    const triSize = 50 + bass * 1.5;
    ctx.strokeStyle = colors[0];
    ctx.beginPath();
    ctx.moveTo(0, -triSize);
    ctx.lineTo(triSize * 0.866, triSize * 0.5);
    ctx.lineTo(-triSize * 0.866, triSize * 0.5);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();

    // 2. Orbiting Mids Squares
    const orbitCount = 4;
    for(let i=0; i<orbitCount; i++) {
        ctx.save();
        ctx.translate(centerX, centerY);
        const orbitAngle = rotation * -0.5 + (i * (Math.PI * 2 / orbitCount));
        const orbitRadius = 150 + mids * 0.5;
        
        const x = Math.cos(orbitAngle) * orbitRadius;
        const y = Math.sin(orbitAngle) * orbitRadius;
        
        ctx.translate(x, y);
        ctx.rotate(rotation * 2 + i); 
        
        const sqSize = 20 + mids * 0.4;
        ctx.strokeStyle = colors[1];
        ctx.strokeRect(-sqSize/2, -sqSize/2, sqSize, sqSize);
        ctx.restore();
    }

    // 3. Treble Circles 
    const circCount = 8;
    for(let i=0; i<circCount; i++) {
        ctx.save();
        ctx.translate(centerX, centerY);
        const angle = rotation * 0.2 + (i * (Math.PI * 2 / circCount));
        const dist = 250 + treble * 0.2 + (i%2 * 50); 
        
        const x = Math.cos(angle) * dist;
        const y = Math.sin(angle) * dist;
        
        const r = 5 + treble * 0.2;
        
        ctx.fillStyle = colors[2];
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function drawSmoke(
    ctx: CanvasRenderingContext2D,
    data: Uint8Array,
    w: number,
    h: number,
    colors: string[],
    bufferLength: number,
    smokeParticles: Array<{
      x: number, y: number, vx: number, vy: number, 
      size: number, alpha: number, color: string, 
      life: number, maxLife: number,
      angle: number, angleSpeed: number, initialX: number
    }>,
    settings: VisualizerSettings,
    rotation: number
) {
    // Volume determines spawn rate
    let volume = 0;
    for(let i=0; i<bufferLength; i++) volume += data[i];
    volume = (volume / bufferLength) * settings.sensitivity;

    // Turbulence from mids/highs for wind effect
    let turbulence = 0;
    for(let i=50; i<150; i++) turbulence += data[i];
    turbulence /= 100;

    // Continuous spawn logic based on volume
    const spawnCount = 1 + Math.floor(volume / 20);
    const maxSmoke = 150; 

    if (smokeParticles.length < maxSmoke) {
        for(let i=0; i<spawnCount; i++) {
            // Spawn decision: Top or Bottom (50/50 chance)
            const spawnFromTop = Math.random() > 0.5;

            // Spawn spread horizontally
            const x = Math.random() * w;
            
            // Set start Y and Direction based on top/bottom choice
            const y = spawnFromTop ? -50 : h + 50;
            
            // Slower flow speed (significantly reduced magnitude)
            // Range approx 0.2 to 0.7 depending on user settings
            const baseSpeed = (0.2 + Math.random() * 0.5) * settings.speed; 
            const vy = spawnFromTop ? baseSpeed : -baseSpeed;
            
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = 50 + Math.random() * 60; 
            // INCREASED max life to ensure they can reach the center at slow speeds
            const maxLife = 800 + Math.random() * 400; 
            
            smokeParticles.push({
                x,
                y,
                vx: (Math.random() - 0.5) * 0.5, // Subtle horizontal drift
                vy: vy,
                size,
                alpha: 0,
                color,
                life: 0,
                maxLife,
                angle: Math.random() * Math.PI * 2,
                angleSpeed: (Math.random() - 0.5) * 0.01,
                initialX: x
            });
        }
    }

    // Use Screen blending for ethereal light effect
    ctx.globalCompositeOperation = 'screen';

    const time = rotation * 10; // Use rotation as simple time counter
    
    // Global swirling effect center
    const centerX = w / 2;

    for (let i = smokeParticles.length - 1; i >= 0; i--) {
        const p = smokeParticles[i];
        
        p.life++;
        p.angle += p.angleSpeed;
        
        // Fade In / Out Logic
        const fadeInDur = 80;
        const fadeOutDur = 120;
        
        let targetAlpha = 0.3; // Max opacity per puff

        if (p.life < fadeInDur) {
             p.alpha = (p.life / fadeInDur) * targetAlpha;
        } else if (p.life > p.maxLife - fadeOutDur) {
             p.alpha = ((p.maxLife - p.life) / fadeOutDur) * targetAlpha;
        }

        // Physics: 
        // 1. Vertical motion (p.vy) - towards center Y
        // 2. Horizontal attraction - towards center X
        
        // Horizontal Attraction
        // This force creates the "converge to central part" effect
        const dx = centerX - p.x;
        
        // Stronger pull towards center X (creates a funnel/hourglass shape)
        // Damped by settings.speed
        p.vx += (dx * 0.0015) * settings.speed; 
        
        // Damping/Friction to prevent perpetual oscillation
        // Without this, they would just orbit the center indefinitely
        p.vx *= 0.96;
        
        // Turbulence noise
        // Ensure noise doesn't completely overpower slow flow
        const noise = Math.sin(p.y * 0.005 + time * 0.2) * (0.5 + turbulence * 0.5);
        
        p.x += p.vx + noise;
        p.y += p.vy;
        p.size += 0.1 * settings.speed; // Expand slowly

        // Cleanup conditions (off screen top OR bottom, or dead)
        if (p.life >= p.maxLife || p.y < -p.size * 2 || p.y > h + p.size * 2 || p.alpha <= 0.001) {
            smokeParticles.splice(i, 1);
            continue;
        }

        ctx.globalAlpha = Math.max(0, p.alpha);
        
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        
        // Draw soft gradient "puff" - squashed slightly for volume
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
        gradient.addColorStop(0, p.color);
        gradient.addColorStop(0.4, p.color); // Core
        gradient.addColorStop(1, 'transparent'); // Soft edge
        
        ctx.fillStyle = gradient;
        
        // Draw slightly distorted circle
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.8, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    // Reset context
    ctx.globalAlpha = 1.0;
    ctx.globalCompositeOperation = 'source-over';
}

function drawRipples(
    ctx: CanvasRenderingContext2D,
    data: Uint8Array,
    w: number,
    h: number,
    colors: string[],
    bufferLength: number,
    ripples: Array<{
      x: number, y: number, radius: number, maxRadius: number, 
      alpha: number, speed: number, color: string, lineWidth: number
    }>,
    settings: VisualizerSettings
) {
    // Detect Bass Kick
    let bass = 0;
    for(let i=0; i<10; i++) bass += data[i];
    bass /= 10;
    
    const bassNormalized = bass / 255;
    
    // Threshold for spawning ripple
    if (bass > 160 / settings.sensitivity) {
        if (ripples.length < 15 && Math.random() > 0.4) {
             const x = Math.random() * w;
             const y = Math.random() * h;
             const color = colors[Math.floor(Math.random() * colors.length)];
             
             ripples.push({
                 x,
                 y,
                 radius: 0,
                 maxRadius: Math.max(w, h) * (0.3 + bassNormalized * 0.5),
                 alpha: 1.0,
                 speed: (2 + bassNormalized * 5) * settings.speed,
                 color,
                 lineWidth: (2 + bassNormalized * 10)
             });
        }
    }
    
    // Center ripple for loud continuous sound
    if (bass > 100) {
       if (ripples.length < 20 && Math.random() > 0.85) {
          ripples.push({
               x: w/2,
               y: h/2,
               radius: 0,
               maxRadius: Math.max(w, h) * 0.6,
               alpha: 0.8,
               speed: 5 * settings.speed,
               color: colors[0],
               lineWidth: 5
           });
       }
    }

    ctx.lineCap = 'round';

    for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        
        r.radius += r.speed;
        
        // Decay speed slightly for drag effect
        r.speed *= 0.98;
        
        // Fade out
        r.alpha -= 0.008;

        if (r.alpha <= 0 || r.radius > r.maxRadius) {
            ripples.splice(i, 1);
            continue;
        }

        // Draw Multiple Concentric Rings for "Water" effect
        const ringCount = 3;
        const ringGap = 30; // Gap between wave peaks
        
        for (let j = 0; j < ringCount; j++) {
             const currentRadius = r.radius - (j * ringGap);
             
             if (currentRadius > 0) {
                 // Inner rings fade out faster
                 const ringAlpha = r.alpha * (1 - (j * 0.3));
                 if (ringAlpha <= 0) continue;
                 
                 // Inner rings are thinner
                 const lw = Math.max(0.5, r.lineWidth * (1 - (j * 0.2)));
                 ctx.lineWidth = lw;
                 
                 // 1. Draw "Specular Highlight" (Offset white/bright line)
                 // This simulates light hitting the crest of the wave
                 ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                 ctx.globalAlpha = ringAlpha * 0.6;
                 ctx.beginPath();
                 // Slight offset to top-left
                 ctx.arc(r.x - 2, r.y - 2, currentRadius, 0, Math.PI * 2);
                 ctx.stroke();

                 // 2. Draw Main Color
                 ctx.strokeStyle = r.color;
                 ctx.globalAlpha = ringAlpha;
                 ctx.beginPath();
                 ctx.arc(r.x, r.y, currentRadius, 0, Math.PI * 2);
                 ctx.stroke();
             }
        }
    }
    ctx.globalAlpha = 1.0;
}

function getAverage(data: Uint8Array, start: number, end: number) {
    let sum = 0;
    for(let i=start; i<end; i++) sum += data[i];
    return sum / (end - start);
}

export default VisualizerCanvas;