import { IVisualizerRenderer, VisualizerSettings } from '../types';

// --- Helper Functions ---
function getAverage(data: Uint8Array, start: number, end: number) {
  let sum = 0;
  for(let i=start; i<end; i++) sum += data[i];
  return sum / (end - start);
}

// Convert hex to rgba helper
function hexToRgba(hex: string, alpha: number) {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }
  return `rgba(${r},${g},${b},${alpha})`;
}

// --- Renderers ---

export class BarsRenderer implements IVisualizerRenderer {
  init() {}
  draw(ctx: CanvasRenderingContext2D, data: Uint8Array, w: number, h: number, colors: string[], settings: VisualizerSettings) {
    const barCount = 64; 
    const step = Math.floor(data.length / barCount); 
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
      // Right Side
      ctx.fillRect(centerX + (i * barWidth), (h - barHeight) / 2, barWidth - 2, barHeight);
      // Left Side
      ctx.fillRect(centerX - ((i + 1) * barWidth), (h - barHeight) / 2, barWidth - 2, barHeight);
    }
  }
}

export class RingsRenderer implements IVisualizerRenderer {
  init() {}
  draw(ctx: CanvasRenderingContext2D, data: Uint8Array, w: number, h: number, colors: string[], settings: VisualizerSettings, rotation: number) {
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
}

export class ParticlesRenderer implements IVisualizerRenderer {
  private particles: Array<{x: number, y: number, vx: number, vy: number, life: number, size: number}> = [];

  init() {
    this.particles = [];
  }

  draw(ctx: CanvasRenderingContext2D, data: Uint8Array, w: number, h: number, colors: string[], settings: VisualizerSettings, rotation: number) {
    const time = rotation * 0.8;
    const driftX = Math.sin(time) * (w * 0.2); 
    const driftY = Math.cos(time * 1.3) * (h * 0.15); 
    const centerX = w / 2 + driftX;
    const centerY = h / 2 + driftY;

    // Analysis
    let mids = 0;
    for(let i=10; i<50; i++) mids += data[i];
    mids = (mids / 40) / 255;

    let bass = 0;
    for(let i=0; i<10; i++) bass += data[i];
    bass = (bass / 10) / 255;

    // Nebulous Glow Background
    if (settings.glow) {
        ctx.save();
        const maxRadius = Math.max(w, h);
        const nebulaRadius = maxRadius * 0.4 + (bass * maxRadius * 0.3 * settings.sensitivity);
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, nebulaRadius);
        ctx.globalAlpha = 0.2 + (bass * 0.3);
        gradient.addColorStop(0, colors[1]);
        gradient.addColorStop(0.5, colors[2] || colors[0]);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
    }

    // Particle Logic
    const maxParticles = 200;
    if (this.particles.length < maxParticles) {
        for(let i=0; i<5; i++) {
            this.particles.push({
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
    const fieldRotation = rotation * 0.3;
    const cosR = Math.cos(fieldRotation);
    const sinR = Math.sin(fieldRotation);

    for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        
        if (Math.abs(p.x) > w * 2 || Math.abs(p.y) > h * 2) { p.life = -1; }

        // Move particle "towards" camera (life represents Z depth)
        p.life -= warpSpeed;

        if (p.life <= 10 || p.x === 0 || p.y === 0) {
            p.x = (Math.random() - 0.5) * w * 2;
            p.y = (Math.random() - 0.5) * h * 2;
            p.life = w;
            p.size = Math.random() * 2 + 0.5;
            continue;
        }

        const fov = 250;
        const scale = fov / p.life;
        
        // --- Dynamic Trail Logic ---
        // Instead of using just the previous frame, we calculate a "tail" position
        // that is effectively further back in Z-space based on speed.
        // Factor 5.0 dramatically lengthens trails at high speed.
        const trailFactor = 5.0; 
        const tailZ = p.life + (warpSpeed * trailFactor);
        const tailScale = fov / tailZ;
        
        const rotX = p.x * cosR - p.y * sinR;
        const rotY = p.x * sinR + p.y * cosR;

        // Head of the streak
        const sx = centerX + rotX * scale;
        const sy = centerY + rotY * scale;

        // Tail of the streak
        const tailSx = centerX + rotX * tailScale;
        const tailSy = centerY + rotY * tailScale;
        
        const size = p.size * scale * 5;

        let alpha = 1;
        if (p.life > w * 0.8) alpha = (w - p.life) / (w * 0.2); 
        if (p.life < 50) alpha = p.life / 50; 

        const colorIndex = Math.floor(Math.random() * colors.length); 
        ctx.fillStyle = (warpSpeed > 10) ? colors[colorIndex] : '#ffffff';
        ctx.globalAlpha = alpha;

        ctx.beginPath();
        
        // Star streaks (warp effect)
        const dist = Math.sqrt(Math.pow(sx - tailSx, 2) + Math.pow(sy - tailSy, 2));
        
        // Threshold adjusted slightly to trigger trails more easily
        if (dist > size * 1.5 && settings.trails) {
            ctx.strokeStyle = ctx.fillStyle;
            ctx.lineWidth = size;
            ctx.lineCap = 'round';
            ctx.moveTo(tailSx, tailSy);
            ctx.lineTo(sx, sy);
            ctx.stroke();
        } else {
            ctx.arc(sx, sy, size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    ctx.globalAlpha = 1.0;
  }
}

export class TunnelRenderer implements IVisualizerRenderer {
  init() {}
  draw(ctx: CanvasRenderingContext2D, data: Uint8Array, w: number, h: number, colors: string[], settings: VisualizerSettings, rotation: number) {
    const centerX = w / 2;
    const centerY = h / 2;
    const shapes = 12;
    const maxRadius = Math.max(w, h) * 0.7;

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
}

export class PlasmaRenderer implements IVisualizerRenderer {
  init() {}
  draw(ctx: CanvasRenderingContext2D, data: Uint8Array, w: number, h: number, colors: string[], settings: VisualizerSettings, rotation: number) {
    const blobs = 6; 
    ctx.globalCompositeOperation = 'screen';

    for (let i = 0; i < blobs; i++) {
        let rangeAvg = 0;
        if (i < 2) rangeAvg = getAverage(data, 0, 8); // Bass
        else if (i < 4) rangeAvg = getAverage(data, 8, 40); // Mids
        else rangeAvg = getAverage(data, 40, 150); // Highs

        const normalized = rangeAvg / 255;
        // Enhanced glow sensitivity
        const glowFactor = settings.glow ? 1.5 : 1.0;
        const intensity = Math.pow(normalized, 1.8) * settings.sensitivity * glowFactor;
        const speed = (0.2 + (i * 0.1)) * settings.speed;
        
        const t = rotation * speed + (i * Math.PI / 3);
        const xOffset = Math.sin(t) * (w * 0.35) * Math.cos(t * 0.5);
        const yOffset = Math.cos(t * 0.8) * (h * 0.35) * Math.sin(t * 0.3);
        const x = w/2 + xOffset;
        const y = h/2 + yOffset;
        
        const minDim = Math.min(w, h);
        const breathing = Math.sin(rotation * 2 + i) * 0.05;
        const rawRadius = minDim * (0.2 + (i % 3) * 0.05 + breathing + intensity * 0.4);
        const radius = Math.max(minDim * 0.05, rawRadius); 
        
        // PERFORMANCE: Creating RadialGradient every frame is expensive. 
        // We still use it here but only for 6 blobs, which is acceptable.
        // Optimization: Ensure radius is positive
        if (radius <= 0) continue;

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        const alpha = Math.min(1.0, 0.2 + intensity * 0.8);
        
        const coreBase = 0.05 + intensity * 0.5;
        const whiteCoreRadius = Math.min(0.8, settings.glow ? coreBase * 1.3 : coreBase);
        
        gradient.addColorStop(0, '#ffffff'); 
        gradient.addColorStop(whiteCoreRadius, '#ffffff');
        gradient.addColorStop(Math.min(0.95, whiteCoreRadius + 0.4), colors[i % colors.length]);
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
}

export class ShapesRenderer implements IVisualizerRenderer {
  init() {}
  draw(ctx: CanvasRenderingContext2D, data: Uint8Array, w: number, h: number, colors: string[], settings: VisualizerSettings, rotation: number) {
    const centerX = w / 2;
    const centerY = h / 2;

    let bass = 0; for(let i=0; i<10; i++) bass += data[i];
    bass = (bass / 10) * settings.sensitivity;
    
    let mids = 0; for(let i=10; i<40; i++) mids += data[i];
    mids = (mids / 30) * settings.sensitivity;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.save();
    ctx.translate(centerX, centerY);
    
    for (let i = 0; i < 8; i++) {
        const baseSides = 3 + i;
        const morph = Math.floor(rotation * 0.5) % 3;
        const sides = baseSides + morph;

        const baseRadius = (Math.min(w, h) * 0.05 * (i + 1));
        const expansion = (bass / 255) * (Math.min(w,h) * 0.1);
        const wobble = Math.sin(rotation * 5 + i) * (mids * 0.1);
        const radius = baseRadius + expansion + wobble;

        const dir = i % 2 === 0 ? 1 : -1;
        const angleOffset = rotation * (0.5 + i * 0.1) * dir;

        ctx.strokeStyle = colors[i % colors.length];
        ctx.lineWidth = 2 + ((bass/255) * 3);
        
        ctx.beginPath();
        for (let j = 0; j <= sides; j++) {
            const angle = (j / sides) * Math.PI * 2 + angleOffset;
            const px = Math.cos(angle) * radius;
            const py = Math.sin(angle) * radius;
            if (j === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();

        if (bass > 150 && i > 0 && i % 2 === 0) {
             ctx.beginPath();
             ctx.moveTo(Math.cos(angleOffset)*radius, Math.sin(angleOffset)*radius);
             ctx.globalAlpha = 0.2;
             ctx.lineTo(0, 0);
             ctx.stroke();
             ctx.globalAlpha = 1.0;
        }
    }
    // Background Particles
    for(let k=0; k<6; k++) {
         const r = (Math.min(w,h) * 0.4) + (mids * 0.5);
         const a = rotation * 0.5 + (k / 6) * Math.PI * 2;
         const px = Math.cos(a) * r;
         const py = Math.sin(a) * r;
         ctx.fillStyle = colors[k % colors.length];
         ctx.fillRect(px - 5, py - 5, 10 + (bass/20), 10 + (bass/20));
    }
    ctx.restore();
  }
}

export class NebulaRenderer implements IVisualizerRenderer {
  private particles: Array<{
    x: number; y: number; 
    vx: number; vy: number; 
    life: number; maxLife: number; 
    size: number; 
    colorIndex: number; 
    type: 'smoke' | 'spark';
    rotation: number;
    rotationSpeed: number;
  }> = [];

  // Cache generated sprites to avoid expensive canvas operations per frame
  private spriteCache: Record<string, HTMLCanvasElement> = {};

  init() {
    this.particles = [];
    this.spriteCache = {};
  }

  // Generates a soft, irregular cloud-like sprite tinted with the given color
  private getSprite(color: string): HTMLCanvasElement {
    if (this.spriteCache[color]) return this.spriteCache[color];

    const size = 128; // Sprite resolution
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    // 1. Draw Cloud Shape (Alpha Mask)
    // We draw multiple overlapping radial gradients to create an irregular blob
    const drawPuff = (x: number, y: number, rad: number, op: number) => {
        const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
        g.addColorStop(0, `rgba(255,255,255,${op})`);
        g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, rad, 0, Math.PI*2);
        ctx.fill();
    };
    
    // Main body
    drawPuff(size/2, size/2, size/2, 1);
    // Lumps
    drawPuff(size/2 - 20, size/2 - 10, size/3, 0.6);
    drawPuff(size/2 + 20, size/2 + 10, size/3, 0.6);
    drawPuff(size/2 + 10, size/2 - 20, size/3.5, 0.5);
    drawPuff(size/2 - 15, size/2 + 20, size/3.5, 0.5);

    // 2. Tint using Composite Operation
    // This keeps the alpha channel but changes the color to the target
    ctx.globalCompositeOperation = 'source-in';
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, size, size);

    this.spriteCache[color] = canvas;
    return canvas;
  }

  draw(ctx: CanvasRenderingContext2D, data: Uint8Array, w: number, h: number, colors: string[], settings: VisualizerSettings, rotation: number) {
    // Separate frequencies
    const bass = getAverage(data, 0, 14) / 255; // Deep bass for rhythm
    const mid = getAverage(data, 20, 100) / 255; // Mids for flow
    const high = getAverage(data, 100, 200) / 255; // Highs for sparks
    
    const smokeCount = 120;
    const sparkCount = 30;

    // Spawn Nebula (Smoke)
    if (this.particles.filter(p => p.type === 'smoke').length < smokeCount) {
       for (let k = 0; k < 2; k++) {
         if (this.particles.length >= smokeCount + sparkCount) break;

         const isInitialFill = this.particles.length < 50;
         const startY = isInitialFill ? Math.random() * h : h + 100;
         const startX = Math.random() * w;

         this.particles.push({
           x: startX,
           y: startY,
           vx: 0, vy: 0,
           life: isInitialFill ? Math.random() * 800 : 0, 
           maxLife: 800 + Math.random() * 400,
           size: (80 + Math.random() * 150) * 2, // Larger size for sprites
           colorIndex: Math.floor(Math.random() * colors.length), 
           type: 'smoke',
           rotation: Math.random() * Math.PI * 2,
           rotationSpeed: (Math.random() - 0.5) * 0.02
         });
       }
    }

    // Spawn Sparks on Highs
    if (high > 0.3 && this.particles.filter(p => p.type === 'spark').length < sparkCount) {
        this.particles.push({
            x: Math.random() * w,
            y: h + 20,
            vx: 0, vy: 0,
            life: 0, maxLife: 100,
            size: 2 + Math.random() * 3,
            colorIndex: 0, 
            type: 'spark',
            rotation: 0,
            rotationSpeed: 0
        });
    }

    const time = rotation;
    
    // Screen blending makes the overlapping smoke glow
    ctx.globalCompositeOperation = 'screen'; 

    for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.life++;
        
        // Physics
        const nx = p.x * 0.003;
        const ny = p.y * 0.003;
        const turbulence = bass * 1.5 * settings.sensitivity;
        const angle = Math.sin(nx + time * 0.5 + turbulence) * Math.cos(ny + time * 0.5) * Math.PI * 2;
        
        const speed = p.type === 'smoke' 
            ? settings.speed * (0.8 + (bass * 4.0)) 
            : 3.0 * settings.speed * (1 + high * 3);

        p.vx += Math.cos(angle) * 0.05;
        p.vy += Math.sin(angle) * 0.05 - 0.05; 
        p.vx *= 0.95;
        p.vy *= 0.95;

        p.x += p.vx * speed;
        p.y += p.vy * speed;
        
        // Update rotation
        p.rotation += p.rotationSpeed * settings.speed;

        // Wrap around screen
        if (p.y < -300) p.y = h + 300;
        if (p.x < -300) p.x = w + 300;
        if (p.x > w + 300) p.x = -300;

        // Alpha / Fade logic
        let alpha = 0;
        const fadeIn = 150;
        const fadeOut = 200;

        if (p.life < fadeIn) {
            alpha = p.life / fadeIn;
        } else if (p.life > p.maxLife - fadeOut) {
            alpha = (p.maxLife - p.life) / fadeOut;
        } else {
            alpha = 1;
        }

        // Reset if dead
        if (p.life > p.maxLife) {
             p.life = 0;
             p.x = Math.random() * w;
             p.y = h + 100;
             p.rotation = Math.random() * Math.PI * 2;
        }

        if (p.type === 'smoke') {
            const colorKey = colors[p.colorIndex % colors.length];
            const sprite = this.getSprite(colorKey);
            
            // Pulse opacity with beat
            const beatPulse = bass * 0.3; 
            const finalAlpha = Math.min(1, (0.15 + beatPulse * 0.5) * alpha); // Higher base alpha for sprites

            ctx.globalAlpha = finalAlpha;
            
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            // Draw sprite centered
            ctx.drawImage(sprite, -p.size/2, -p.size/2, p.size, p.size);
            ctx.restore();

        } else {
            // Sparks
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
            ctx.globalAlpha = 1.0;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    ctx.globalAlpha = 1.0;
    ctx.globalCompositeOperation = 'source-over';
  }
}

export class KaleidoscopeRenderer implements IVisualizerRenderer {
    init() {}
  
    draw(ctx: CanvasRenderingContext2D, data: Uint8Array, w: number, h: number, colors: string[], settings: VisualizerSettings, rotation: number) {
        const centerX = w / 2;
        const centerY = h / 2;
        
        let vol = getAverage(data, 0, 100);
        let mids = getAverage(data, 20, 60);

        const segments = 8 + Math.floor((mids / 255) * 8); // 8 to 16 segments
        const angleStep = (Math.PI * 2) / segments;
        const radius = Math.max(w, h) * 0.6;

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(rotation * 0.2 * settings.speed); // Slow base rotation

        // We draw one "slice" and repeat it
        for (let i = 0; i < segments; i++) {
            ctx.save();
            ctx.rotate(i * angleStep);

            // Draw waveform/freq representation in this slice
            ctx.beginPath();
            ctx.moveTo(0, 0);
            
            const step = Math.floor(data.length / 50);
            for(let j=0; j<50; j++) {
                const val = data[j * step];
                const r = (j / 50) * radius;
                const width = (val / 255) * (radius / 5) * settings.sensitivity;
                
                // Mirror effect within the slice for true kaleidoscope feel
                const localY = width * Math.sin(j * 0.5 + rotation * 2);
                
                if (j===0) ctx.moveTo(r, localY);
                else ctx.lineTo(r, localY);
            }
            ctx.strokeStyle = colors[i % colors.length];
            ctx.lineWidth = 2 + (vol / 50);
            ctx.stroke();

            // Add some geometric shapes
            if (mids > 100) {
                 const dist = (mids/255) * radius * 0.8;
                 ctx.fillStyle = colors[(i+1) % colors.length];
                 ctx.beginPath();
                 ctx.arc(dist, 0, 5 + (vol/20), 0, Math.PI*2);
                 ctx.fill();
            }

            ctx.restore();
        }
        ctx.restore();
    }
}