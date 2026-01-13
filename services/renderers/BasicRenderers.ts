
import { IVisualizerRenderer, VisualizerSettings } from '../../types';
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
      // Prevent negative width if screen is very narrow
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
    if (colors.length === 0) return;
    for(let i = 0; i < maxRings; i++) {
        const freqIndex = i * 8; 
        const val = data[freqIndex] * settings.sensitivity;
        const radius = 30 + (i * 20) + Math.min(val, 100);
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

export class StrobeRenderer implements IVisualizerRenderer {
  init() {}
  draw(ctx: CanvasRenderingContext2D, data: Uint8Array, w: number, h: number, colors: string[], settings: VisualizerSettings) {
    const cols = 12;
    const rows = 8;
    const cellW = w / cols;
    const cellH = h / rows;
    const bass = getAverage(data, 0, 10) / 255;

    ctx.save();
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = (r * cols + c) % (data.length / 4);
        const val = data[Math.floor(idx)] / 255;
        const color = colors[(r + c) % colors.length];
        
        const padding = 2; 
        const x = c * cellW + padding;
        const y = r * cellH + padding;
        const curW = cellW - padding * 2;
        const curH = cellH - padding * 2;

        const threshold = 0.15; 
        const intensity = val > threshold ? (val - threshold) / (1 - threshold) : 0;
        const gridFactor = (r + c) % 3 === 0 ? bass * 1.2 : bass * 0.6;
        const finalAlpha = (intensity * settings.sensitivity) + gridFactor;

        if (finalAlpha > 0.05) {
            ctx.fillStyle = color;
            ctx.globalAlpha = Math.min(finalAlpha, 1.0);
            ctx.fillRect(x, y, curW, curH);
            
            if (settings.glow && finalAlpha > 0.3) {
                ctx.shadowBlur = 30 * finalAlpha * settings.sensitivity;
                ctx.shadowColor = color;
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1;
                ctx.strokeRect(x, y, curW, curH);
            }
        }
      }
    }
    ctx.restore();
  }
}
