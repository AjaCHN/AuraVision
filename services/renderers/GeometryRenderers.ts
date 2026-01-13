
import { IVisualizerRenderer, VisualizerSettings } from '../../types';
import { getAverage } from '../audioUtils';

export class TunnelRenderer implements IVisualizerRenderer {
  init() {}
  draw(ctx: CanvasRenderingContext2D, data: Uint8Array, w: number, h: number, colors: string[], settings: VisualizerSettings, rotation: number) {
    if (colors.length === 0) return;
    const centerX = w / 2;
    const centerY = h / 2;
    const shapes = 12;
    const maxRadius = Math.max(w, h) * 0.7;
    ctx.save();
    ctx.translate(centerX, centerY);
    for (let i = 0; i < shapes; i++) {
        const value = data[Math.floor((i / shapes) * 40)] * settings.sensitivity;
        const depth = (i + (rotation * 5)) % shapes; 
        const scale = Math.pow(depth / shapes, 2); 
        const radius = maxRadius * scale * (1 + (value / 500)); 
        ctx.strokeStyle = colors[i % colors.length];
        ctx.lineWidth = (1 + (scale * 20)) * settings.sensitivity;
        ctx.globalAlpha = scale; 
        ctx.beginPath();
        for (let j = 0; j <= 6; j++) {
            const angle = (j / 6) * Math.PI * 2 + rotation * (i % 2 === 0 ? 1 : -1);
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            if (j === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
    }
    ctx.restore();
  }
}

export class ShapesRenderer implements IVisualizerRenderer {
  init() {}
  draw(ctx: CanvasRenderingContext2D, data: Uint8Array, w: number, h: number, colors: string[], settings: VisualizerSettings, rotation: number) {
    if (colors.length === 0) return;
    const bassVal = getAverage(data, 0, 12);
    const bass = bassVal * settings.sensitivity;
    const bassNorm = bassVal / 255;
    const mids = getAverage(data, 10, 60) * settings.sensitivity;
    
    ctx.save();
    ctx.translate(w/2, h/2);
    for (let i = 0; i < 8; i++) {
        const sides = 3 + i;
        const radius = (Math.min(w, h) * 0.05 * (i + 1)) + (bassNorm * 80);
        const angleOffset = rotation * (0.5 + i * 0.1) * (i % 2 === 0 ? 1 : -1);
        
        const isFlashingLine = i % 2 === 0;
        const pulseEffect = isFlashingLine ? (bassNorm * 2.5) : (bassNorm * 0.4);
        const baseAlpha = isFlashingLine ? (0.05 + pulseEffect) : (0.4 + pulseEffect);
        
        ctx.globalAlpha = Math.min(Math.max(baseAlpha, 0.05), 1.0);
        ctx.strokeStyle = colors[i % colors.length] || '#ffffff';
        ctx.lineWidth = (2 + (mids / 80)) * settings.sensitivity;
        
        ctx.beginPath();
        for (let j = 0; j < sides; j++) {
            const a = (j / sides) * Math.PI * 2 + angleOffset;
            const px = Math.cos(a) * radius;
            const py = Math.sin(a) * radius;
            if (j === 0) ctx.moveTo(px, py); 
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();

        if (isFlashingLine && bassNorm > 0.6) {
            ctx.globalAlpha = (bassNorm - 0.6) * 1.5;
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    }
    ctx.restore();
  }
}

export class KaleidoscopeRenderer implements IVisualizerRenderer {
    init() {}
    draw(ctx: CanvasRenderingContext2D, data: Uint8Array, w: number, h: number, colors: string[], settings: VisualizerSettings, rotation: number) {
        if (colors.length === 0) return;
        ctx.save();
        ctx.translate(w/2, h/2);
        ctx.rotate(rotation * 0.15 * settings.speed); 
        const segments = 12;
        const angleStep = (Math.PI * 2) / segments;
        const radius = Math.max(w, h) * 0.65;
        for (let i = 0; i < segments; i++) {
            ctx.save();
            ctx.rotate(i * angleStep);
            ctx.beginPath();
            const step = Math.floor(data.length / 50);
            for(let j=0; j<50; j++) {
                const val = data[j * step] * settings.sensitivity;
                const r = (j / 50) * radius;
                const y = (val / 255) * 120 * Math.sin(j * 0.25 + rotation * 4);
                if (j===0) ctx.moveTo(r, y); else ctx.lineTo(r, y);
            }
            ctx.strokeStyle = colors[i % colors.length] || '#fff';
            ctx.lineWidth = 2.5; ctx.stroke();
            ctx.restore();
        }
        ctx.restore();
    }
}
