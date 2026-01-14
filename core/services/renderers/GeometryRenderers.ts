
import { IVisualizerRenderer, VisualizerSettings } from '../../types/index';
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
            if (j === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
    }
    ctx.restore();
  }
}

export class KaleidoscopeRenderer implements IVisualizerRenderer {
    init() {}
    draw(ctx: CanvasRenderingContext2D, data: Uint8Array, w: number, h: number, colors: string[], settings: VisualizerSettings, rotation: number) {
        if (colors.length === 0) return;
        
        const bass = getAverage(data, 0, 10) / 255;
        const mids = getAverage(data, 20, 80) / 255;

        ctx.save();
        ctx.translate(w/2, h/2);
        ctx.rotate(rotation * 0.1 * settings.speed); 
        
        const segments = 12;
        const angleStep = (Math.PI * 2) / segments;
        const maxRadius = Math.max(w, h) * 0.5;

        for (let i = 0; i < segments; i++) {
            ctx.save();
            ctx.rotate(i * angleStep);

            // Draw elegant curves instead of straight lines
            const c1 = colors[i % colors.length];
            const c2 = colors[(i + 1) % colors.length];
            const gradient = ctx.createLinearGradient(0, 0, maxRadius, 0);
            gradient.addColorStop(0, `${c1}00`);
            gradient.addColorStop(0.5, c1);
            gradient.addColorStop(1, c2);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1 + mids * 4;
            
            ctx.beginPath();
            let lastX = 0, lastY = 0;
            ctx.moveTo(0,0);

            const points = 30;
            for(let j=1; j <= points; j++) {
                const freqIndex = Math.floor((j / points) * 100);
                const val = data[freqIndex] * settings.sensitivity;
                const r = (j / points) * maxRadius * (1 + bass * 0.2);
                
                // Use sine waves to create organic, flowing shapes
                const yOffset = (val / 255) * 80 * Math.sin(j * 0.3 + rotation * 4);
                const controlPointY = lastY + (yOffset - lastY) / 2;
                
                // Create a quadratic curve for smooth transitions
                ctx.quadraticCurveTo(lastX, controlPointY, r, yOffset);
                lastX = r;
                lastY = yOffset;
            }
            ctx.stroke();
            ctx.restore();
        }

        // Add a pulsing core
        const coreRadius = 20 + bass * 150 * settings.sensitivity;
        const coreGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, coreRadius);
        coreGradient.addColorStop(0, `${colors[0]}ff`);
        coreGradient.addColorStop(0.5, `${colors[1]}88`);
        coreGradient.addColorStop(1, `${colors[0]}00`);
        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(0, 0, coreRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}
