import { IVisualizerRenderer, VisualizerSettings } from '../../types/index';
import { getAverage } from '../audioUtils';

export class BarsRenderer implements IVisualizerRenderer {
  init() {}

  // Helper for rounded rectangles, which might not be supported on older browsers
  private drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
    if (height < 0) height = 0;
    if (width < 0) width = 0;
    // Ensure radius is not larger than half the smallest dimension
    if (height < 2 * radius) radius = height / 2;
    if (width < 2 * radius) radius = width / 2;
    
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
    ctx.fill();
  }

  draw(ctx: CanvasRenderingContext2D, data: Uint8Array, w: number, h: number, colors: string[], settings: VisualizerSettings) {
    const barCount = 56;
    const step = Math.floor(data.length / (barCount * 1.5));
    const barWidth = (w / barCount) * 0.6;
    const barSpacing = (w / barCount) * 0.4;
    const centerX = w / 2;
    const c0 = colors[0] || '#ffffff';
    const c1 = colors[1] || c0;

    for (let i = 0; i < barCount / 2; i++) {
        const value = data[i * step] * settings.sensitivity * 1.2;
        const barHeight = Math.min(Math.max((value / 255) * h * 0.7, 0), h * 0.85);
        
        const capHeight = 4;
        const cornerRadius = barWidth * 0.3;

        if (barHeight <= capHeight) continue;

        const gradient = ctx.createLinearGradient(0, h, 0, 0);
        gradient.addColorStop(0, c1);
        gradient.addColorStop(0.8, c0);
        gradient.addColorStop(1, c0);

        const totalBarWidth = barWidth + barSpacing;
        const x_right = centerX + i * totalBarWidth + barSpacing / 2;
        const y = (h - barHeight) / 2;
        const x_left = centerX - (i * totalBarWidth) - barWidth - barSpacing / 2;
        
        // Draw main bar body
        ctx.fillStyle = gradient;
        this.drawRoundedRect(ctx, x_right, y + capHeight, barWidth, barHeight - capHeight, cornerRadius);
        this.drawRoundedRect(ctx, x_left, y + capHeight, barWidth, barHeight - capHeight, cornerRadius);

        // Draw cap
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.drawRoundedRect(ctx, x_right, y, barWidth, capHeight, 2);
        this.drawRoundedRect(ctx, x_left, y, barWidth, capHeight, 2);
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
  private layerOffsets: { phase: number; freq1: number; freq2: number; vert: number; speedMult: number; }[] = [];
  
  init() {
    this.layerOffsets = [];
  }

  draw(ctx: CanvasRenderingContext2D, data: Uint8Array, w: number, h: number, colors: string[], settings: VisualizerSettings, rotation: number) {
    if (colors.length === 0) return;
    const bass = getAverage(data, 0, 10) * settings.sensitivity / 255;
    
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    
    const layerCount = settings.quality === 'high' ? 5 : 3;
    const time = rotation * settings.speed;

    // Generate unique, persistent random properties for each layer if they don't exist
    if (this.layerOffsets.length !== layerCount) {
      this.layerOffsets = [];
      for (let i = 0; i < layerCount; i++) {
        this.layerOffsets.push({
          phase: Math.random() * Math.PI * 2,       // Random phase shift
          freq1: 0.003 + Math.random() * 0.004, // Random frequency for base wave
          freq2: 0.008 + Math.random() * 0.005, // Random frequency for audio bumps
          vert: (Math.random() - 0.5) * 0.15,   // Random vertical offset
          speedMult: 0.7 + Math.random() * 0.6    // Random speed multiplier for parallax
        });
      }
    }

    for (let i = 0; i < layerCount; i++) {
      const color = colors[i % colors.length];
      const offsets = this.layerOffsets[i];
      const layerTime = time * offsets.speedMult; // Each layer has its own speed

      ctx.fillStyle = color;
      ctx.globalAlpha = 0.2 + bass * 0.3;
      
      const segments = 20;
      const step = w / segments;
      const points = [];

      for (let s = 0; s <= segments; s++) {
        const x = s * step;
        // Apply randomized properties to make each wave unique and less uniform
        const offset = Math.sin(x * offsets.freq1 + layerTime + offsets.phase) * (h * 0.15);
        const audioBump = Math.cos(x * offsets.freq2 + layerTime * 1.5 + offsets.phase) * (bass * 120);
        const y = h * (0.4 + i * 0.08 + offsets.vert) + offset + audioBump;
        points.push({ x, y });
      }

      ctx.beginPath();
      ctx.moveTo(0, h);
      ctx.lineTo(points[0].x, points[0].y);

      for (let j = 0; j < points.length - 1; j++) {
        const xc = (points[j].x + points[j + 1].x) / 2;
        const yc = (points[j].y + points[j + 1].y) / 2;
        ctx.quadraticCurveTo(points[j].x, points[j].y, xc, yc);
      }
      
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
  private bubbles: Array<{ x: number, y: number, r: number, vx: number, vy: number, colorIdx: number, noiseOffset: number }> = [];
  
  init() {
    this.bubbles = [];
  }
  
  draw(ctx: CanvasRenderingContext2D, data: Uint8Array, w: number, h: number, colors: string[], settings: VisualizerSettings, rotation: number) {
    if (colors.length === 0) return;
    
    const bass = getAverage(data, 0, 10) * settings.sensitivity / 255;
    const highs = getAverage(data, 120, 200) * settings.sensitivity / 255;
    const count = settings.quality === 'high' ? 30 : 15;

    if (this.bubbles.length === 0) {
      for (let i = 0; i < count; i++) {
        this.bubbles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 30 + Math.random() * 100,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          colorIdx: Math.floor(Math.random() * colors.length),
          noiseOffset: Math.random() * 1000
        });
      }
    } else if (this.bubbles.length > count) {
      this.bubbles = this.bubbles.slice(0, count);
    } else if (this.bubbles.length < count) {
      for (let i = this.bubbles.length; i < count; i++) {
         this.bubbles.push({
          x: Math.random() * w, y: Math.random() * h, r: 30 + Math.random() * 100,
          vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.5) * 0.2,
          colorIdx: Math.floor(Math.random() * colors.length), noiseOffset: Math.random() * 1000
        });
      }
    }

    ctx.save();
    
    this.bubbles.forEach((p) => {
      // Fluidic Movement
      const time = rotation * settings.speed * 0.2;
      const noiseX = Math.sin(p.y * 0.004 + time + p.noiseOffset) * 0.5;
      const noiseY = Math.cos(p.x * 0.004 + time + p.noiseOffset) * 0.5;

      p.vx = p.vx * 0.96 + noiseX * 0.15;
      p.vy = p.vy * 0.96 + noiseY * 0.15;
      p.x += p.vx * settings.speed * (1 + bass);
      p.y += p.vy * settings.speed * (1 + bass);
      
      // Wrap around screen
      if (p.x < -p.r) p.x = w + p.r;
      if (p.x > w + p.r) p.x = -p.r;
      if (p.y < -p.r) p.y = h + p.r;
      if (p.y > h + p.r) p.y = -p.r;

      const dynamicR = p.r * (1 + bass * 0.2);
      const color = colors[p.colorIdx % colors.length];
      
      // Volumetric body
      const bodyGradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, dynamicR);
      bodyGradient.addColorStop(0, `${color}10`);
      bodyGradient.addColorStop(0.5, `${color}40`);
      bodyGradient.addColorStop(0.9, `${color}88`);
      bodyGradient.addColorStop(1, `${color}00`);
      
      ctx.fillStyle = bodyGradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, dynamicR, 0, Math.PI * 2);
      ctx.fill();

      // Soft highlight, reactive to treble
      const highlightStrength = Math.min(0.8, highs * 2.5);
      if (highlightStrength > 0.05) {
          const highlightX = p.x - dynamicR * 0.3;
          const highlightY = p.y - dynamicR * 0.3;
          const highlightR = dynamicR * 0.5;
          const highlightGradient = ctx.createRadialGradient(highlightX, highlightY, 0, highlightX, highlightY, highlightR);
          highlightGradient.addColorStop(0, `rgba(255, 255, 255, ${highlightStrength * 0.5})`);
          highlightGradient.addColorStop(0.3, `rgba(255, 255, 255, ${highlightStrength * 0.2})`);
          highlightGradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
          
          ctx.fillStyle = highlightGradient;
          ctx.beginPath();
          // Use a clipping path to ensure the highlight stays within the bubble's bounds
          ctx.arc(p.x, p.y, dynamicR, 0, Math.PI * 2);
          ctx.fill();
      }
    });

    ctx.restore();
  }
}