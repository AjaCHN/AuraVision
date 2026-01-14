
import { IVisualizerRenderer, VisualizerSettings } from '../../types';
import { getAverage } from '../audioUtils';

export class ParticlesRenderer implements IVisualizerRenderer {
  // Store 3D coordinates (x, y, z) and previous screen coordinates (px, py) for smooth trails
  private particles: Array<{
    x: number; 
    y: number; 
    z: number; 
    px: number; // Previous projected X
    py: number; // Previous projected Y
    size: number;
    colorOffset: number;
  }> = [];

  init() { 
    this.particles = []; 
  }

  draw(ctx: CanvasRenderingContext2D, data: Uint8Array, w: number, h: number, colors: string[], settings: VisualizerSettings, rotation: number) {
    if (colors.length === 0) return;

    // 1. Dynamic Wandering Origin (Moving Center)
    // Moves the vanishing point in a figure-8 pattern based on time/rotation
    const time = rotation * 0.5;
    const centerX = w / 2 + Math.sin(time) * (w * 0.15);
    const centerY = h / 2 + Math.cos(time * 0.7) * (h * 0.15);
    
    // Audio Analysis
    const mids = getAverage(data, 10, 50) / 255;
    const bass = getAverage(data, 0, 10) / 255;
    const highs = getAverage(data, 100, 200) / 255;
    
    // Background Glow
    if (settings.glow) {
        ctx.save();
        ctx.fillStyle = colors[1] || colors[0];
        const glowOpacity = 0.05 + (bass * 0.15 * settings.sensitivity);
        ctx.globalAlpha = Math.min(0.2, glowOpacity);
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
    }
    
    // Quality-based limiting
    const maxParticles = settings.quality === 'high' ? 300 : settings.quality === 'med' ? 180 : 80;
    
    // Initialize Particles (3D Space: x/y from -w to w, z from 0 to w)
    if (this.particles.length === 0) {
        for (let i = 0; i < maxParticles; i++) {
            this.particles.push(this.createParticle(w, h, Math.random() * w));
        }
    } else if (this.particles.length < maxParticles) {
        // Add more if needed
        this.particles.push(this.createParticle(w, h, w));
    } else if (this.particles.length > maxParticles) {
        this.particles = this.particles.slice(0, maxParticles);
    }

    // Audio-reactive Speed
    // Base speed + audio reaction. 'speed' slider acts as a multiplier.
    const moveSpeed = (2 + (mids * 40) + (highs * 20)) * settings.speed * settings.sensitivity;
    
    ctx.lineCap = 'round';

    for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        
        // Move particle towards viewer (decrease Z)
        p.z -= moveSpeed;

        // Reset if it passes the viewer or goes too far behind
        if (p.z <= 1) {
            const newP = this.createParticle(w, h, w);
            this.particles[i] = newP;
            // Prevent drawing a line across the screen on reset
            continue; 
        }

        // 3D to 2D Projection
        // Simple perspective projection formula
        const k = 128.0 / p.z; // Field of view factor
        const px = (p.x * k) + centerX;
        const py = (p.y * k) + centerY;

        // Skip drawing if outside canvas (Optimization)
        // Check both current and previous to ensure we catch lines entering/leaving
        const isOutside = (px < 0 || px > w || py < 0 || py > h) && (p.px < 0 || p.px > w || p.py < 0 || p.py > h);

        if (!isOutside) {
            // Calculate scale/size based on proximity
            const scale = (1 - p.z / w);
            const size = p.size * k * (settings.quality === 'low' ? 2 : 1);
            
            // Dynamic Color
            const colorIdx = Math.floor(i % colors.length);
            ctx.strokeStyle = colors[colorIdx];
            ctx.lineWidth = size;

            // Opacity based on depth (fade in as they appear far away)
            const alpha = Math.min(1, (w - p.z) / (w * 0.3));
            ctx.globalAlpha = alpha;

            // DRAW LINE from Previous Frame Position to Current Position
            // This creates the smooth, connected trail effect
            ctx.beginPath();
            ctx.moveTo(p.px, p.py);
            ctx.lineTo(px, py);
            ctx.stroke();
        }

        // Update previous position for next frame
        p.px = px;
        p.py = py;
    }
    ctx.globalAlpha = 1.0;
  }

  // Helper to create a random particle in 3D space
  private createParticle(w: number, h: number, z: number) {
      return {
          x: (Math.random() - 0.5) * w * 2, // Spread wider than screen to cover corners
          y: (Math.random() - 0.5) * h * 2,
          z: z,
          px: w / 2, // Initial previous pos (center) to avoid jump artifacts
          py: h / 2,
          size: Math.random() * 1.5 + 0.5,
          colorOffset: Math.random()
      };
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
