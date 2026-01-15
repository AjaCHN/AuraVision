import { IVisualizerRenderer, VisualizerSettings } from '../../types/index';
import { getAverage } from '../audioUtils';

export class ParticlesRenderer implements IVisualizerRenderer {
  private particles: Array<{ x: number; y: number; z: number; px: number; py: number; size: number; vx: number; vy: number; }> = [];
  init() { this.particles = []; }

  draw(ctx: CanvasRenderingContext2D, data: Uint8Array, w: number, h: number, colors: string[], settings: VisualizerSettings, rotation: number) {
    if (colors.length === 0) return;
    const time = rotation * 0.5;
    
    // Elegant Drift: The vanishing point now drifts slowly in a Lissajous curve pattern.
    const centerX = w / 2 + Math.sin(time * 0.3) * (w * 0.2);
    const centerY = h / 2 + Math.cos(time * 0.2) * (h * 0.2);
    
    const bass = getAverage(data, 0, 10) / 255;
    const highs = getAverage(data, 100, 200) / 255;
    const maxParticles = settings.quality === 'high' ? 150 : settings.quality === 'med' ? 80 : 40;

    if (this.particles.length === 0) {
        for (let i = 0; i < maxParticles; i++) this.particles.push(this.createParticle(w, h, Math.random() * w, centerX, centerY));
    } else if (this.particles.length < maxParticles) {
        this.particles.push(this.createParticle(w, h, w, centerX, centerY));
    } else if (this.particles.length > maxParticles) {
        this.particles = this.particles.slice(0, maxParticles);
    }

    // Speed is now more reactive to high frequencies
    const moveSpeed = (1 + (bass * 10) + (highs * 40)) * settings.speed * settings.sensitivity;
    
    ctx.lineCap = 'round';
    for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        p.z -= moveSpeed;
        
        // Curving Trajectories: Add a slight perpendicular velocity
        p.x += p.vx * settings.speed;
        p.y += p.vy * settings.speed;

        if (p.z <= 1 || p.x > w || p.y > h) {
            this.particles[i] = this.createParticle(w, h, w, centerX, centerY);
            continue; 
        }

        const k = 128.0 / p.z;
        const new_px = (p.x * k) + centerX;
        const new_py = (p.y * k) + centerY;

        if (new_px > 0 && new_px < w && new_py > 0 && new_py < h) {
            const size = (1 + p.size) * k * (1 + bass * 1.5);
            // Star-like Appearance: Brighter head, fainter tail
            const g = ctx.createLinearGradient(p.px, p.py, new_px, new_py);
            const color = colors[i % colors.length];
            g.addColorStop(0, `${color}00`);
            g.addColorStop(0.7, `${color}ff`);
            
            ctx.strokeStyle = g;
            ctx.lineWidth = size;
            ctx.beginPath(); 
            ctx.moveTo(p.px, p.py); 
            ctx.lineTo(new_px, new_py); 
            ctx.stroke();
        }
        p.px = new_px; 
        p.py = new_py;
    }
  }

  private createParticle(w: number, h: number, z: number, px: number, py: number) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * w * 0.1;
      return { 
          x: Math.cos(angle) * radius, 
          y: Math.sin(angle) * radius, 
          z: z, 
          px: px,
          py: py,
          size: Math.random() * 1.5 + 0.5,
          // Add sideways velocity for curved paths
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
      };
  }
}

export class NebulaRenderer implements IVisualizerRenderer {
  private particles: Array<{ 
    x: number; y: number; vx: number; vy: number; 
    life: number; maxLife: number; size: number; 
    colorIndex: number; rotation: number; rotationSpeed: number; 
    depth: number; // For parallax
  }> = [];
  private spriteCache: Record<string, HTMLCanvasElement> = {};

  init() { 
    this.particles = []; 
    this.spriteCache = {}; 
  }

  private getSprite(color: string): HTMLCanvasElement {
    if (this.spriteCache[color]) return this.spriteCache[color];
    const size = 400; 
    const canvas = document.createElement('canvas'); 
    canvas.width = size; canvas.height = size; 
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;
    
    // More complex sprite for a wispier, gaseous look
    const g = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size * 0.45);
    g.addColorStop(0, `rgba(255,255,255,0.2)`);
    g.addColorStop(0.2, `rgba(255,255,255,0.1)`);
    g.addColorStop(0.7, `rgba(255,255,255,0.02)`);
    g.addColorStop(1, 'rgba(255,255,255,0)');
    
    ctx.fillStyle = g; 
    ctx.beginPath(); 
    ctx.arc(size/2, size/2, size * 0.45, 0, Math.PI * 2); 
    ctx.fill();
    
    ctx.globalCompositeOperation = 'source-in'; 
    ctx.fillStyle = color; 
    ctx.fillRect(0, 0, size, size);
    
    this.spriteCache[color] = canvas; 
    return canvas;
  }

  private resetParticle(p: any, w: number, h: number, colorsCount: number) {
    p.x = Math.random() * w;
    p.y = Math.random() * h;
    p.vx = 0;
    p.vy = 0;
    p.life = 0;
    p.maxLife = 2000 + Math.random() * 1500;
    p.colorIndex = Math.floor(Math.random() * colorsCount);
    p.rotation = Math.random() * Math.PI * 2;
    p.rotationSpeed = (Math.random() - 0.5) * 0.001;
    // Parallax effect: depth determines size, speed, and alpha
    p.depth = Math.random() * 0.6 + 0.4; // 0.4 (far) to 1.0 (near)
    p.size = (w * 0.2) * p.depth + (Math.random() * w * 0.2);
  }

  draw(ctx: CanvasRenderingContext2D, data: Uint8Array, w: number, h: number, colors: string[], settings: VisualizerSettings, rotation: number) {
    if (colors.length === 0) return;
    
    const bass = getAverage(data, 0, 15) / 255;
    const maxParticles = settings.quality === 'high' ? 50 : settings.quality === 'med' ? 30 : 15;

    while (this.particles.length < maxParticles) {
        const p = { x: 0, y: 0, vx: 0, vy: 0, life: 0, maxLife: 1, size: 0, colorIndex: 0, rotation: 0, rotationSpeed: 0, depth: 1 };
        this.resetParticle(p, w, h, colors.length);
        p.life = Math.random() * p.maxLife; 
        this.particles.push(p);
    }
    
    ctx.save(); 
    ctx.globalCompositeOperation = 'screen';

    const vortexCenterX = w / 2 + Math.sin(rotation * 0.1) * 100;
    const vortexCenterY = h / 2 + Math.cos(rotation * 0.1) * 100;

    for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i]; 
        p.life += settings.speed * p.depth; // Deeper particles live longer/move slower
        
        // Cosmic Wind & Vortex: Particles are drawn towards a moving center point.
        const angleToCenter = Math.atan2(vortexCenterY - p.y, vortexCenterX - p.x);
        const vortexStrength = 0.02 * p.depth;
        const windX = Math.cos(angleToCenter) * vortexStrength;
        const windY = Math.sin(angleToCenter) * vortexStrength;

        p.vx = p.vx * 0.96 + windX * settings.speed;
        p.vy = p.vy * 0.96 + windY * settings.speed; 
        
        p.x += p.vx * (1 + bass * 2); 
        p.y += p.vy * (1 + bass * 2);
        p.rotation += p.rotationSpeed * settings.speed;

        if (p.life > p.maxLife || p.x < -p.size || p.x > w + p.size || p.y < -p.size || p.y > h + p.size) { 
          this.resetParticle(p, w, h, colors.length);
        }

        const fadeInOut = Math.sin((p.life / p.maxLife) * Math.PI); 
        // Deeper particles are fainter
        const dynamicAlpha = (0.1 + bass * 0.5) * fadeInOut * settings.sensitivity * p.depth;
        
        if (dynamicAlpha < 0.005) continue;

        const sprite = this.getSprite(colors[p.colorIndex % colors.length] || '#fff'); 
        const finalSize = p.size * (1 + bass * 0.5 * settings.sensitivity);
        
        ctx.globalAlpha = Math.min(0.5, dynamicAlpha); 
        ctx.save(); 
        ctx.translate(p.x, p.y); 
        ctx.rotate(p.rotation); 
        ctx.drawImage(sprite, -finalSize/2, -finalSize/2, finalSize, finalSize); 
        ctx.restore();
    }
    ctx.restore();
  }
}