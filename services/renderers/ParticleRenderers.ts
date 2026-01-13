
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
        const nebulaRadius = Math.max(w, h) * (0.4 + bass * 0.3 * settings.sensitivity);
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, nebulaRadius);
        ctx.globalAlpha = 0.1 + (bass * 0.2);
        gradient.addColorStop(0, colors[1] || colors[0]);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
    }
    const maxParticles = 200;
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
        
        // Safety: Prevent scale explosion if life gets too close to 0
        const safeLife = Math.max(0.1, p.life);
        const scale = 250 / safeLife;
        
        // Use direct coordinates for linear movement
        const rx = p.x;
        const ry = p.y;
        const sx = centerX + rx * scale;
        const sy = centerY + ry * scale;
        
        ctx.globalAlpha = Math.min(1, p.life > w * 0.8 ? (w - p.life) / (w * 0.2) : p.life / 50);
        ctx.fillStyle = warpSpeed > 10 ? (colors[i % colors.length] || '#fff') : '#fff';
        ctx.beginPath();
        // Reduced size multiplier from 5 to 1.5 (~1/3 size)
        ctx.arc(sx, sy, p.size * scale * 1.5, 0, Math.PI * 2);
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

    for (let i = 0; i < 24; i++) {
        const offsetX = (Math.random() - 0.5) * size * 0.25;
        const offsetY = (Math.random() - 0.5) * size * 0.25;
        const radius = size * (0.15 + Math.random() * 0.25);
        const opacity = 0.04 + Math.random() * 0.08;

        const g = ctx.createRadialGradient(centerX + offsetX, centerY + offsetY, 0, centerX + offsetX, centerY + offsetY, radius);
        g.addColorStop(0, `rgba(255,255,255,${opacity})`);
        g.addColorStop(1, 'rgba(255,255,255,0)');
        
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(centerX + offsetX, centerY + offsetY, radius, 0, Math.PI * 2);
        ctx.fill();
    }

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

    const maxParticles = 60; 
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
        const fadeInOut = Math.sin((p.life / p.maxLife) * Math.PI);
        const dynamicAlpha = (0.08 + bass * 0.35) * fadeInOut * sensitivity;
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
    if (highs > 0.35) {
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

export class SmokeRenderer implements IVisualizerRenderer {
  private particles: Array<{
    x: number; y: number;
    vx: number; vy: number;
    size: number;
    life: number; maxLife: number;
    color: string;
    source: 'top' | 'bottom';
  }> = [];

  init() { this.particles = []; }

  draw(ctx: CanvasRenderingContext2D, data: Uint8Array, w: number, h: number, colors: string[], settings: VisualizerSettings, rotation: number) {
    // Audio analysis
    const bass = getAverage(data, 0, 10) / 255;
    const mids = getAverage(data, 10, 50) / 255;

    // Emission
    // Base emission + reactive emission
    const spawnRate = 1 + Math.floor(bass * 5 * settings.sensitivity);
    for (let i = 0; i < spawnRate; i++) {
        // Spawn from top
        if (Math.random() > 0.5) {
            this.particles.push(this.createParticle(w, h, 'top', colors, settings));
        }
        // Spawn from bottom
        else {
            this.particles.push(this.createParticle(w, h, 'bottom', colors, settings));
        }
    }

    // Use screen blend mode for additive smoke effect
    ctx.globalCompositeOperation = 'screen'; 

    for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        
        // Movement toward center
        const centerY = h / 2;
        const distToCenter = centerY - p.y;
        
        // Base vertical speed + audio reaction
        const speed = (0.5 + mids * 2.0) * settings.speed;
        
        // Move towards center with easing
        p.y += (distToCenter * 0.01 * speed) + p.vy * speed;
        
        // Horizontal turbulence based on noise approximation
        const turbulence = Math.sin(p.y * 0.01 + rotation + p.life * 0.02) * (1 + bass * 2);
        p.x += (p.vx + turbulence) * speed;

        p.life--;
        p.size *= 1.005; // Grow slightly as it dissipates

        // Remove if near center or dead
        if (Math.abs(p.y - centerY) < 20 || p.life <= 0) {
            this.particles.splice(i, 1);
            continue;
        }

        // Draw
        const alpha = Math.min(1, p.life / 100) * 0.15; // Low opacity for subtle smoke
        
        ctx.beginPath();
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        g.addColorStop(0, p.color);
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.globalAlpha = alpha;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Reset context
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    
    // Safety limit
    if (this.particles.length > 400) this.particles.shift();
  }

  private createParticle(w: number, h: number, source: 'top' | 'bottom', colors: string[], settings: VisualizerSettings) {
      const x = Math.random() * w;
      const y = source === 'top' ? -50 : h + 50;
      const vy = source === 'top' ? 1 : -1;
      const size = (30 + Math.random() * 50) * (settings.sensitivity || 1);
      const color = colors[Math.floor(Math.random() * colors.length)];
      return {
          x, y,
          vx: (Math.random() - 0.5) * 0.5,
          vy: vy * (1 + Math.random()),
          size,
          life: 300 + Math.random() * 200,
          maxLife: 500,
          color,
          source
      };
  }
}
