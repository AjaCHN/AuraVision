import { IVisualizerRenderer, VisualizerSettings } from '../../types/index';

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