
import { IVisualizerRenderer, VisualizerSettings } from '../../types/index';
import { getAverage } from '../audioUtils';

export class BarsRenderer implements IVisualizerRenderer {
  init() {}
  draw(ctx: CanvasRenderingContext2D, data: Uint8Array, w: number, h: number, colors: string[], settings: VisualizerSettings) {
    const barCount = 64; 
    const step = Math.floor(data.length / barCount); 
    const barWidth = (w / barCount) / 2; 
    const centerX = w / 2;
    const c0 = colors[0] || '#ffffff';
    const c1 = colors[1] || c0;

    for (let i = 0; i < barCount; i++) {
      const value = data[i * step] * settings.sensitivity;
      const barHeight = Math.min((value / 255) * h * 0.8, h * 0.9);
      const gradient = ctx.createLinearGradient(0, h/2 + barHeight/2, 0, h/2 - barHeight/2);
      gradient.addColorStop(0, c1);
      gradient.addColorStop(0.5, c0);
      gradient.addColorStop(1, c1);
      ctx.fillStyle = gradient;
      const safeBarWidth = Math.max(1, barWidth - 2);
      ctx.fillRect(centerX + (i * barWidth), (h - barHeight) / 2, safeBarWidth, barHeight);
      ctx.fillRect(centerX - ((i + 1) * barWidth), (h - barHeight) / 2, safeBarWidth, barHeight);
    }
  }
}

export class RingsRenderer implements IVisualizerRenderer {
  init() {}
  draw(ctx: CanvasRenderingContext2D, data: Uint8Array, w: number, h: number, colors: string[], settings: VisualizerSettings, rotation: number) {
    const centerX = w / 2;
    const centerY = h / 2;
    const maxRings = 15;
    const minDimension = Math.min(w, h);
    const scale = Math.max(0.6, minDimension / 800); 

    if (colors.length === 0) return;
    for(let i = 0; i < maxRings; i++) {
        const freqIndex = i * 8; 
        const val = data[freqIndex] * settings.sensitivity;
        const baseR = (40 + (i * 25)) * scale;
        const audioR = Math.min(val, 150) * Math.min(scale, 1.5); 
        const radius = baseR + audioR;
        ctx.beginPath();
        ctx.strokeStyle = colors[i % colors.length];
        ctx.lineWidth = ((2 + (val / 40)) * settings.sensitivity) * scale;
        const startAngle = rotation * (i % 2 === 0 ? 1 : -1) + i; 
        const endAngle = startAngle + (Math.PI * 1.5) + (val / 255); 
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.stroke();
    }
  }
}

/**
 * Inspired by Image 1: Fluid, flowing gradients with smooth curves.
 */
export class FluidCurvesRenderer implements IVisualizerRenderer {
  init() {}
  draw(ctx: CanvasRenderingContext2D, data: Uint8Array, w: number, h: number, colors: string[], settings: VisualizerSettings, rotation: number) {
    if (colors.length === 0) return;
    const bass = getAverage(data, 0, 10) * settings.sensitivity / 255;
    
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    
    const layerCount = settings.quality === 'high' ? 5 : 3;
    const time = rotation * settings.speed;

    for (let i = 0; i < layerCount; i++) {
      const color = colors[i % colors.length];
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.2 + bass * 0.3;
      
      const segments = 20; // Increased segments for smoothness
      const step = w / segments;
      const points = [];

      // 1. Calculate all points for the curve
      for (let s = 0; s <= segments; s++) {
        const x = s * step;
        const offset = Math.sin(x * 0.005 + time + i * 0.5) * (h * 0.15);
        const audioBump = Math.cos(x * 0.01 + time * 1.5 + i) * (bass * 120);
        const y = h * (0.4 + i * 0.1) + offset + audioBump;
        points.push({ x, y });
      }

      // 2. Draw the smooth, filled curve
      ctx.beginPath();
      ctx.moveTo(0, h);
      ctx.lineTo(points[0].x, points[0].y);

      for (let j = 0; j < points.length - 1; j++) {
        const xc = (points[j].x + points[j + 1].x) / 2;
        const yc = (points[j].y + points[j + 1].y) / 2;
        ctx.quadraticCurveTo(points[j].x, points[j].y, xc, yc);
      }
      
      // Curve to the last point to ensure it's included
      ctx.quadraticCurveTo(
        points[points.length - 1].x,
        points[points.length - 1].y,
        points[points.length - 1].x,
        points[points.length - 1].y
      );
      
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fill();
    }
    
    ctx.restore();
  }
}

/**
 * Inspired by Image 2: Macro photography of liquid bubbles with highlights.
 */
export class MacroBubblesRenderer implements IVisualizerRenderer {
  private bubbles: Array<{ x: number, y: number, r: number, vx: number, vy: number, colorIdx: number }> = [];
  
  init() {
    this.bubbles = [];
  }
  
  draw(ctx: CanvasRenderingContext2D, data: Uint8Array, w: number, h: number, colors: string[], settings: VisualizerSettings, rotation: number) {
    if (colors.length === 0) return;
    
    const bass = getAverage(data, 0, 10) * settings.sensitivity / 255;
    const highs = getAverage(data, 120, 200) * settings.sensitivity / 255;
    const count = settings.quality === 'high' ? 40 : 20;

    if (this.bubbles.length === 0) {
      for (let i = 0; i < count; i++) {
        this.bubbles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 20 + Math.random() * 80,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          colorIdx: Math.floor(Math.random() * colors.length)
        });
      }
    }

    ctx.save();
    
    this.bubbles.forEach((b, i) => {
      // Movement
      b.x += b.vx * settings.speed * (1 + bass * 2);
      b.y += b.vy * settings.speed * (1 + bass * 2);
      
      // Wrap around
      if (b.x < -b.r) b.x = w + b.r;
      if (b.x > w + b.r) b.x = -b.r;
      if (b.y < -b.r) b.y = h + b.r;
      if (b.y > h + b.r) b.y = -b.r;

      const dynamicR = b.r * (1 + bass * 0.5);
      const color = colors[b.colorIdx % colors.length];
      
      // Main bubble body
      const gradient = ctx.createRadialGradient(b.x, b.y, dynamicR * 0.2, b.x, b.y, dynamicR);
      gradient.addColorStop(0, color);
      gradient.addColorStop(0.8, color);
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      
      ctx.globalAlpha = 0.6 + highs * 0.4;
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(b.x, b.y, dynamicR, 0, Math.PI * 2);
      ctx.fill();

      // Highlights (Sparkle from Image 2)
      ctx.globalAlpha = 0.8;
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(b.x - dynamicR * 0.3, b.y - dynamicR * 0.3, dynamicR * 0.4, -Math.PI * 0.75, -Math.PI * 0.25);
      ctx.stroke();
      
      if (highs > 0.4) {
          ctx.fillStyle = 'white';
          ctx.beginPath();
          ctx.arc(b.x + dynamicR * 0.4, b.y - dynamicR * 0.2, 3 * highs * settings.sensitivity, 0, Math.PI * 2);
          ctx.fill();
      }
    });

    ctx.restore();
  }
}
