
import { IVisualizerRenderer, VisualizerSettings } from '../../types';
import { getAverage } from '../audioUtils';

export class ParticlesRenderer implements IVisualizerRenderer {
  private particles: Array<{x: number, y: number, vx: number, vy: number, life: number, size: number}> = [];
  init() { this.particles = []; }
  draw(ctx: CanvasRenderingContext2D, data: Uint8Array, w: number, h: number, colors: string[], settings: VisualizerSettings, rotation: number) {
    if (colors.length === 0) return;
    // Strictly linear movement: No wobble in center
    const centerX = w / 2; 
    const centerY = h / 2;
    
    let mids = getAverage(data, 10, 50) / 255;
    let bass = getAverage(data, 0, 10) / 255;
    
    if (settings.glow) {
        ctx.save();
        ctx.fillStyle = colors[1] || colors[0];
        const glowOpacity = 0.05 + (bass * 0.15 * settings.sensitivity);
        ctx.globalAlpha = Math.min(0.2, glowOpacity);
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
    }
    
    // Quality-based limiting
    const maxParticles = settings.quality === 'high' ? 200 : settings.quality === 'med' ? 120 : 60;
    
    while (this.particles.length < maxParticles) {
        this.particles.push({
            x: (Math.random() - 0.5) * w * 2, 
            y: (Math.random() - 0.5) * h * 2,
            life: w * (Math.random() * 0.5 + 0.5), 
            vx: w, vy: 0, size: Math.random() * 2 + 0.5
        });
    }
    const warpSpeed = (0.5 + (mids * 40)) * settings.speed * settings.sensitivity;
    
    for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.life -= warpSpeed;
        if (p.life <= 10) {
            p.x = (Math.random() - 0.5) * w * 2;
            p.y = (Math.random() - 0.5) * h * 2;
            p.life = w;
            continue;
        }
        
        const safeLife = Math.max(0.1, p.life);
        const scale = 250 / safeLife;
        
        const rx = p.x;
        const ry = p.y;
        const sx = centerX + rx * scale;
        const sy = centerY + ry * scale;
        
        // Skip drawing if outside canvas (Optimization)
        if (sx < 0 || sx > w || sy < 0 || sy > h) continue;
        
        ctx.globalAlpha = Math.min(1, p.life > w * 0.8 ? (w - p.life) / (w * 0.2) : p.life / 50);
        ctx.fillStyle = warpSpeed > 10 ? (colors[i % colors.length] || '#fff') : '#fff';
        ctx.beginPath();
        // Dynamic size: Low quality = slightly larger particles to compensate for fewer count
        const sizeMult = settings.quality === 'low' ? 2.5 : 1.5;
        ctx.arc(sx, sy, p.size * scale * sizeMult, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1.0;
  }
}

export class NebulaRenderer implements IVisualizerRenderer {
  private particles: Array<{
    x: number; y: number; 
    vx: number; vy: number; 
    life: number; maxLife: number; 
    size: number; 
    colorIndex: number; 
    rotation: number;
    rotationSpeed: number;
    noiseOffset: number;
  }> = [];

  private spriteCache: Record<string, HTMLCanvasElement> = {};

  init() {
    this.particles = [];
    this.spriteCache = {};
  }

  private getSprite(color: string): HTMLCanvasElement {
    if (this.spriteCache[color]) return this.spriteCache[color];

    const size = 300; 
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    const centerX = size / 2;
    const centerY = size / 2;

    // Quality optimization: Fewer radial gradient steps on sprite generation
    const g = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, size * 0.4);
    g.addColorStop(0, `rgba(255,255,255,0.1)`);
    g.addColorStop(1, 'rgba(255,255,255,0)');
    
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(centerX, centerY, size * 0.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalCompositeOperation = 'source-in';
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, size, size);

    this.spriteCache[color] = canvas;
    return canvas;
  }

  draw(ctx: CanvasRenderingContext2D, data: Uint8Array, w: number, h: number, colors: string[], settings: VisualizerSettings, rotation: number) {
    if (colors.length === 0) return;
    const bass = getAverage(data, 0, 15) / 255; 
    const mids = getAverage(data, 15, 60) / 255; 
    const highs = getAverage(data, 100, 200) / 255; 

    // Quality-based limits. Screen blend mode is heavy on mobile fill-rate.
    const maxParticles = settings.quality === 'high' ? 60 : settings.quality === 'med' ? 40 : 25;

    if (this.particles.length < maxParticles) {
        for (let i = 0; i < 1; i++) {
            const baseSize = (w * 0.28) + (Math.random() * w * 0.28); 
            this.particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: 0, vy: 0,
                life: Math.random() * 800,
                maxLife: 800 + Math.random() * 400,
                size: baseSize,
                colorIndex: Math.floor(Math.random() * colors.length),
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.005,
                noiseOffset: Math.random() * 1000
            });
        }
    }

    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const sensitivity = settings.sensitivity;
    const speedScale = settings.speed;

    for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.life += speedScale * 1.5;
        const timeFactor = rotation * 0.4;
        const driftX = Math.sin(p.x * 0.002 + timeFactor) * 0.2;
        const driftY = Math.cos(p.y * 0.002 + timeFactor) * 0.2;
        const energy = (bass * 3.0 + mids * 1.5) * sensitivity;
        p.vx += (driftX + (Math.random() - 0.5) * 0.05) * speedScale;
        p.vy += (driftY - 0.02) * speedScale; 
        p.vx *= 0.99; p.vy *= 0.99;
        p.x += p.vx * (1 + energy);
        p.y += p.vy * (1 + energy);
        p.rotation += p.rotationSpeed * (1 + mids * 6) * speedScale;
        const margin = p.size * 0.6;
        if (p.x < -margin) p.x = w + margin;
        if (p.x > w + margin) p.x = -margin;
        if (p.y < -margin) p.y = h + margin;
        if (p.y > h + margin) p.y = -margin;
        if (p.life > p.maxLife) {
            p.life = 0;
            p.colorIndex = (p.colorIndex + 1) % colors.length;
        }
        
        // Skip drawing if opacity too low
        const fadeInOut = Math.sin((p.life / p.maxLife) * Math.PI);
        const dynamicAlpha = (0.08 + bass * 0.35) * fadeInOut * sensitivity;
        if (dynamicAlpha < 0.01) continue;

        const c = colors[p.colorIndex % colors.length] || '#fff';
        const sprite = this.getSprite(c);
        const finalSize = p.size * (1 + bass * 0.25 * sensitivity);
        ctx.globalAlpha = Math.min(0.5, dynamicAlpha);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.drawImage(sprite, -finalSize/2, -finalSize/2, finalSize, finalSize);
        ctx.restore();
    }
    
    // Disable star twinkling on low quality to save draw calls
    if (highs > 0.35 && settings.quality !== 'low') {
        ctx.globalAlpha = (highs - 0.35) * 2;
        ctx.fillStyle = '#ffffff';
        for (let j = 0; j < 6; j++) {
            const sx = Math.random() * w;
            const sy = Math.random() * h;
            const sz = Math.random() * 2 * sensitivity;
            ctx.beginPath(); ctx.arc(sx, sy, sz, 0, Math.PI * 2); ctx.fill();
        }
    }
    ctx.restore();
  }
}
