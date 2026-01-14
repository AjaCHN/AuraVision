
import { IVisualizerRenderer, VisualizerSettings } from '../../types/index';
import { getAverage } from '../audioUtils';

export class PlasmaRenderer implements IVisualizerRenderer {
  init() {}
  draw(ctx: CanvasRenderingContext2D, data: Uint8Array, w: number, h: number, colors: string[], settings: VisualizerSettings, rotation: number) {
    if (colors.length === 0) return;
    ctx.globalCompositeOperation = 'screen';
    for (let i = 0; i < 6; i++) {
        const avg = i < 2 ? getAverage(data, 0, 10) : i < 4 ? getAverage(data, 10, 50) : getAverage(data, 50, 150);
        const intensity = Math.pow(avg / 255, 1.5) * settings.sensitivity;
        const t = rotation * (0.2 + i * 0.1) * settings.speed + (i * Math.PI / 3);
        const x = w/2 + Math.sin(t) * (w * 0.3) * Math.cos(t * 0.5);
        const y = h/2 + Math.cos(t * 0.8) * (h * 0.3) * Math.sin(t * 0.3);
        const radius = Math.max(w, h) * (0.15 + intensity * 0.4);
        const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
        g.addColorStop(0, '#fff');
        g.addColorStop(0.2, colors[i % colors.length] || '#fff');
        g.addColorStop(1, 'transparent');
        ctx.globalAlpha = 0.3 + intensity * 0.7;
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
  }
}

export class LasersRenderer implements IVisualizerRenderer {
  init() {}
  draw(ctx: CanvasRenderingContext2D, data: Uint8Array, w: number, h: number, colors: string[], settings: VisualizerSettings, rotation: number) {
    if (colors.length === 0) return;
    const highs = getAverage(data, 100, 255) / 255;
    const bass = getAverage(data, 0, 20) / 255;
    const mids = getAverage(data, 20, 80) / 255;
    
    ctx.save(); 
    ctx.globalCompositeOperation = 'screen';
    
    // Origins now drift slowly for a more dynamic stage feel
    const origins = [
      { x: w * 0.1 + Math.sin(rotation * 0.1) * 50, y: h }, 
      { x: w * 0.9 + Math.cos(rotation * 0.1) * 50, y: h }, 
      { x: w / 2 + Math.sin(rotation * 0.2) * 80, y: h + 50 }
    ];

    origins.forEach((origin, oIdx) => {
      const beams = (oIdx === 2) ? 6 : 8; // Center origin has fewer beams
      for (let i = 0; i < beams; i++) {
        const freqVal = (data[oIdx * 16 + i * 2] || 0) / 255;
        
        // More complex and smoother scanning motion
        const angleBase = (oIdx === 0 ? -0.1 : oIdx === 1 ? -Math.PI + 0.1 : -Math.PI/2);
        const sweepRange = 1.2 + bass * 0.5;
        const angle = angleBase + Math.sin(rotation * settings.speed * (0.3 + i * 0.02) + i * 0.5) * sweepRange;
        
        const length = Math.max(w, h) * 2;
        const endX = origin.x + Math.cos(angle) * length;
        const endY = origin.y + Math.sin(angle) * length;

        const baseAlpha = (0.1 + freqVal * 0.9) * settings.sensitivity;
        const finalAlpha = Math.min(Math.max(baseAlpha * (0.5 + bass * 2), 0.01), 1.0);
        if (finalAlpha < 0.02) continue;

        const coreWidth = (1 + bass * 15 + mids * 3) * settings.sensitivity;
        
        // Atmospheric Glow Effect: Draw a wide, faint line first
        if (settings.quality !== 'low') {
            const glowWidth = coreWidth * (4 + highs * 6);
            const glowGradient = ctx.createLinearGradient(origin.x, origin.y, endX, endY);
            glowGradient.addColorStop(0, `${colors[i % colors.length]}33`);
            glowGradient.addColorStop(1, 'transparent');
            ctx.strokeStyle = glowGradient;
            ctx.lineWidth = glowWidth;
            ctx.globalAlpha = finalAlpha * 0.2;
            ctx.beginPath(); ctx.moveTo(origin.x, origin.y); ctx.lineTo(endX, endY); ctx.stroke();
        }

        // Core Beam: Brighter and sharper
        const coreGradient = ctx.createLinearGradient(origin.x, origin.y, endX, endY);
        coreGradient.addColorStop(0, '#ffffff'); // Hot core
        coreGradient.addColorStop(0.05, colors[i % colors.length]);
        coreGradient.addColorStop(1, 'transparent');
        
        ctx.strokeStyle = coreGradient;
        ctx.lineWidth = coreWidth;
        ctx.globalAlpha = finalAlpha;
        ctx.beginPath(); 
        ctx.moveTo(origin.x, origin.y); 
        ctx.lineTo(endX, endY); 
        ctx.stroke();
      }
    });
    ctx.restore();
  }
}
