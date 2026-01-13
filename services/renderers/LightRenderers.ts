
import { IVisualizerRenderer, VisualizerSettings } from '../../types';
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
        const c = colors[i % colors.length] || '#fff';
        g.addColorStop(0.2, c);
        g.addColorStop(1, 'transparent');
        ctx.globalAlpha = 0.3 + intensity * 0.7;
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();
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
    const beamCount = 12;
    
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    
    const origins = [
      { x: 0, y: h },
      { x: w, y: h },
      { x: w / 2, y: h + 100 }
    ];

    origins.forEach((origin, oIdx) => {
      const chunkStart = oIdx * beamCount * 2;
      
      for (let i = 0; i < beamCount; i++) {
        const freqVal = (data[chunkStart + i * 2] || 0) / 255;
        const angleBase = (oIdx === 0 ? -0.2 : oIdx === 1 ? -Math.PI + 0.2 : -Math.PI/2);
        const fanSpread = 0.7 + (bass * 0.4);
        const jitter = Math.sin(rotation * 50 + i) * highs * 0.05;
        const angle = angleBase + Math.sin(rotation * settings.speed * 0.4 + i * 0.4) * fanSpread + jitter;
        
        const length = Math.max(w, h) * 2.5;
        const endX = origin.x + Math.cos(angle) * length;
        const endY = origin.y + Math.sin(angle) * length;
        const color = colors[i % colors.length];
        
        const baseIntensity = (0.1 + freqVal * 0.9) * settings.sensitivity;
        const pulse = (0.4 + bass * 2.5 + highs * 1.5);
        
        let finalAlpha = baseIntensity * pulse;
        if (i % 3 === 0) finalAlpha *= (0.5 + highs * 2); 
        if (i % 2 === 0) finalAlpha *= (0.5 + bass * 1.5);

        finalAlpha = Math.min(Math.max(finalAlpha, 0.05), 1.0);

        ctx.beginPath();
        const g = ctx.createLinearGradient(origin.x, origin.y, endX, endY);
        g.addColorStop(0, color);
        g.addColorStop(0.5 + mids * 0.2, color); 
        g.addColorStop(1, 'transparent');
        
        ctx.strokeStyle = g;
        ctx.lineWidth = (1.2 + bass * 15 + mids * 5) * settings.sensitivity;
        ctx.globalAlpha = finalAlpha;
        ctx.moveTo(origin.x, origin.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        if (finalAlpha > 0.4) {
            ctx.lineWidth = ctx.lineWidth * 2.5;
            ctx.globalAlpha = finalAlpha * 0.3;
            ctx.stroke();
        }
      }
    });

    if (bass > 0.8) {
        const centerX = w / 2;
        const centerY = h;
        const radialG = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, w * 0.5 * bass);
        radialG.addColorStop(0, colors[0]);
        radialG.addColorStop(1, 'transparent');
        ctx.fillStyle = radialG;
        ctx.globalAlpha = (bass - 0.7) * 0.5;
        ctx.beginPath();
        ctx.arc(centerX, centerY, w * 0.5, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
  }
}
