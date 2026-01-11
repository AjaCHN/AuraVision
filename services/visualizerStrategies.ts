import { IVisualizerRenderer, VisualizerSettings } from '../types';

// --- Helper Functions ---
function getAverage(data: Uint8Array, start: number, end: number) {
  let sum = 0;
  for(let i=start; i<end; i++) sum += data[i];
  return sum / (end - start);
}

// --- Renderers ---

export class BarsRenderer implements IVisualizerRenderer {
  init() {}
  draw(ctx: CanvasRenderingContext2D, data: Uint8Array, w: number, h: number, colors: string[], settings: VisualizerSettings) {
    const barCount = 64; 
    const step = Math.floor(data.length / barCount); 
    const barWidth = (w / barCount) / 2; 
    const centerX = w / 2;

    for (let i = 0; i < barCount; i++) {
      const value = data[i * step] * settings.sensitivity;
      const barHeight = Math.min((value / 255) * h * 0.8, h * 0.9);
      
      const gradient = ctx.createLinearGradient(0, h/2 + barHeight/2, 0, h/2 - barHeight/2);
      gradient.addColorStop(0, colors[1]);
      gradient.addColorStop(0.5, colors[0]);
      gradient.addColorStop(1, colors[1]);
      
      ctx.fillStyle = gradient;
      // Right Side
      ctx.fillRect(centerX + (i * barWidth), (h - barHeight) / 2, barWidth - 2, barHeight);
      // Left Side
      ctx.fillRect(centerX - ((i + 1) * barWidth), (h - barHeight) / 2, barWidth - 2, barHeight);
    }
  }
}

export class RingsRenderer implements IVisualizerRenderer {
  init() {}
  draw(ctx: CanvasRenderingContext2D, data: Uint8Array, w: number, h: number, colors: string[], settings: VisualizerSettings, rotation: number) {
    const centerX = w / 2;
    const centerY = h / 2;
    const maxRings = 15;
    
    for(let i = 0; i < maxRings; i++) {
        const freqIndex = i * 8; 
        const val = data[freqIndex] * settings.sensitivity;
        
        const baseR = 30 + (i * 20);
        const offset = Math.min(val, 100);
        const radius = baseR + offset;
        
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

export class ParticlesRenderer implements IVisualizerRenderer {
  private particles: Array<{x: number, y: number, vx: number, vy: number, life: number, size: number}> = [];

  init() {
    this.particles = [];
  }

  draw(ctx: CanvasRenderingContext2D, data: Uint8Array, w: number, h: number, colors: string[], settings: VisualizerSettings, rotation: number) {
    const time = rotation * 0.8;
    const driftX = Math.sin(time) * (w * 0.2); 
    const driftY = Math.cos(time * 1.3) * (h * 0.15); 
    const centerX = w / 2 + driftX;
    const centerY = h / 2 + driftY;

    // Analysis
    let mids = 0;
    for(let i=10; i<50; i++) mids += data[i];
    mids = (mids / 40) / 255;

    let bass = 0;
    for(let i=0; i<10; i++) bass += data[i];
    bass = (bass / 10) / 255;

    // Nebulous Glow Background
    if (settings.glow) {
        ctx.save();
        const maxRadius = Math.max(w, h);
        const nebulaRadius = maxRadius * 0.4 + (bass * maxRadius * 0.3 * settings.sensitivity);
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, nebulaRadius);
        ctx.globalAlpha = 0.2 + (bass * 0.3);
        gradient.addColorStop(0, colors[1]);
        gradient.addColorStop(0.5, colors[2] || colors[0]);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
    }

    // Particle Logic
    const maxParticles = 200;
    if (this.particles.length < maxParticles) {
        for(let i=0; i<5; i++) {
            this.particles.push({
                x: (Math.random() - 0.5) * w * 2, 
                y: (Math.random() - 0.5) * h * 2,
                life: w * (Math.random() * 0.5 + 0.5), 
                vx: w, 
                vy: 0, 
                size: Math.random() * 2 + 0.5
            });
        }
    }

    const warpSpeed = (0.5 + (mids * 40)) * settings.speed * settings.sensitivity;
    const fieldRotation = rotation * 0.3;
    const cosR = Math.cos(fieldRotation);
    const sinR = Math.sin(fieldRotation);

    for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        
        if (Math.abs(p.x) > w * 2 || Math.abs(p.y) > h * 2) { p.life = -1; }

        const prevZ = p.life;
        p.vx = prevZ; 
        p.life -= warpSpeed;

        if (p.life <= 10 || p.x === 0 || p.y === 0) {
            p.x = (Math.random() - 0.5) * w * 2;
            p.y = (Math.random() - 0.5) * h * 2;
            p.life = w;
            p.vx = w;
            p.size = Math.random() * 2 + 0.5;
            continue;
        }

        const fov = 250;
        const scale = fov / p.life;
        const prevScale = fov / p.vx;
        
        const rotX = p.x * cosR - p.y * sinR;
        const rotY = p.x * sinR + p.y * cosR;

        const sx = centerX + rotX * scale;
        const sy = centerY + rotY * scale;
        const prevSx = centerX + rotX * prevScale;
        const prevSy = centerY + rotY * prevScale;
        
        const size = p.size * scale * 5;

        let alpha = 1;
        if (p.life > w * 0.8) alpha = (w - p.life) / (w * 0.2); 
        if (p.life < 50) alpha = p.life / 50; 

        const colorIndex = Math.floor(Math.random() * colors.length); 
        ctx.fillStyle = (warpSpeed > 10) ? colors[colorIndex] : '#ffffff';
        ctx.globalAlpha = alpha;

        ctx.beginPath();
        
        // Star streaks (warp effect)
        const dist = Math.sqrt(Math.pow(sx - prevSx, 2) + Math.pow(sy - prevSy, 2));
        if (dist > size * 2 && settings.trails) {
            ctx.strokeStyle = ctx.fillStyle;
            ctx.lineWidth = size;
            ctx.lineCap = 'round';
            ctx.moveTo(prevSx, prevSy);
            ctx.lineTo(sx, sy);
            ctx.stroke();
        } else {
            ctx.arc(sx, sy, size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    ctx.globalAlpha = 1.0;
  }
}

export class TunnelRenderer implements IVisualizerRenderer {
  init() {}
  draw(ctx: CanvasRenderingContext2D, data: Uint8Array, w: number, h: number, colors: string[], settings: VisualizerSettings, rotation: number) {
    const centerX = w / 2;
    const centerY = h / 2;
    const shapes = 12;
    const maxRadius = Math.max(w, h) * 0.7;

    ctx.save();
    ctx.translate(centerX, centerY);
    
    for (let i = 0; i < shapes; i++) {
        const dataIndex = Math.floor((i / shapes) * 40); 
        const value = data[dataIndex] * settings.sensitivity;
        
        const depth = (i + (rotation * 5)) % shapes; 
        const scale = Math.pow(depth / shapes, 2); 

        const radius = maxRadius * scale * (1 + (value / 500)); 
        const rotationOffset = rotation * (i % 2 === 0 ? 1 : -1) + (depth * 0.2);

        ctx.strokeStyle = colors[i % colors.length];
        ctx.lineWidth = (2 + (scale * 30)) * settings.sensitivity;
        ctx.globalAlpha = scale; 

        ctx.beginPath();
        const sides = 6; 
        for (let j = 0; j <= sides; j++) {
            const angle = (j / sides) * Math.PI * 2 + rotationOffset;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            if (j === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
    }
    ctx.restore();
  }
}

export class PlasmaRenderer implements IVisualizerRenderer {
  init() {}
  draw(ctx: CanvasRenderingContext2D, data: Uint8Array, w: number, h: number, colors: string[], settings: VisualizerSettings, rotation: number) {
    const blobs = 6; 
    ctx.globalCompositeOperation = 'screen';

    for (let i = 0; i < blobs; i++) {
        let rangeAvg = 0;
        if (i < 2) rangeAvg = getAverage(data, 0, 8); // Bass
        else if (i < 4) rangeAvg = getAverage(data, 8, 40); // Mids
        else rangeAvg = getAverage(data, 40, 150); // Highs

        const normalized = rangeAvg / 255;
        const intensity = Math.pow(normalized, 1.8) * settings.sensitivity;
        const speed = (0.2 + (i * 0.1)) * settings.speed;
        
        const t = rotation * speed + (i * Math.PI / 3);
        const xOffset = Math.sin(t) * (w * 0.35) * Math.cos(t * 0.5);
        const yOffset = Math.cos(t * 0.8) * (h * 0.35) * Math.sin(t * 0.3);
        const x = w/2 + xOffset;
        const y = h/2 + yOffset;
        
        const minDim = Math.min(w, h);
        const breathing = Math.sin(rotation * 2 + i) * 0.05;
        const rawRadius = minDim * (0.2 + (i % 3) * 0.05 + breathing + intensity * 0.4);
        const radius = Math.max(minDim * 0.05, rawRadius); 
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        const alpha = Math.min(1.0, 0.2 + intensity * 0.8);
        const whiteCoreRadius = Math.min(0.8, 0.05 + intensity * 0.5);
        
        gradient.addColorStop(0, '#ffffff'); 
        gradient.addColorStop(whiteCoreRadius, '#ffffff');
        gradient.addColorStop(Math.min(0.95, whiteCoreRadius + 0.4), colors[i % colors.length]);
        gradient.addColorStop(1, 'transparent');
        
        ctx.globalAlpha = alpha;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }
    
    ctx.globalAlpha = 1.0;
    ctx.globalCompositeOperation = 'source-over';
  }
}

export class ShapesRenderer implements IVisualizerRenderer {
  init() {}
  draw(ctx: CanvasRenderingContext2D, data: Uint8Array, w: number, h: number, colors: string[], settings: VisualizerSettings, rotation: number) {
    const centerX = w / 2;
    const centerY = h / 2;

    let bass = 0; for(let i=0; i<10; i++) bass += data[i];
    bass = (bass / 10) * settings.sensitivity;
    
    let mids = 0; for(let i=10; i<40; i++) mids += data[i];
    mids = (mids / 30) * settings.sensitivity;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.save();
    ctx.translate(centerX, centerY);
    
    for (let i = 0; i < 8; i++) {
        const baseSides = 3 + i;
        const morph = Math.floor(rotation * 0.5) % 3;
        const sides = baseSides + morph;

        const baseRadius = (Math.min(w, h) * 0.05 * (i + 1));
        const expansion = (bass / 255) * (Math.min(w,h) * 0.1);
        const wobble = Math.sin(rotation * 5 + i) * (mids * 0.1);
        const radius = baseRadius + expansion + wobble;

        const dir = i % 2 === 0 ? 1 : -1;
        const angleOffset = rotation * (0.5 + i * 0.1) * dir;

        ctx.strokeStyle = colors[i % colors.length];
        ctx.lineWidth = 2 + ((bass/255) * 3);
        
        ctx.beginPath();
        for (let j = 0; j <= sides; j++) {
            const angle = (j / sides) * Math.PI * 2 + angleOffset;
            const px = Math.cos(angle) * radius;
            const py = Math.sin(angle) * radius;
            if (j === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();

        if (bass > 150 && i > 0 && i % 2 === 0) {
             ctx.beginPath();
             ctx.moveTo(Math.cos(angleOffset)*radius, Math.sin(angleOffset)*radius);
             ctx.globalAlpha = 0.2;
             ctx.lineTo(0, 0);
             ctx.stroke();
             ctx.globalAlpha = 1.0;
        }
    }
    // Background Particles
    for(let k=0; k<6; k++) {
         const r = (Math.min(w,h) * 0.4) + (mids * 0.5);
         const a = rotation * 0.5 + (k / 6) * Math.PI * 2;
         const px = Math.cos(a) * r;
         const py = Math.sin(a) * r;
         ctx.fillStyle = colors[k % colors.length];
         ctx.fillRect(px - 5, py - 5, 10 + (bass/20), 10 + (bass/20));
    }
    ctx.restore();
  }
}

export class SmokeRenderer implements IVisualizerRenderer {
  private particles: Array<{
      x: number, y: number, vx: number, vy: number, 
      size: number, alpha: number, color: string, 
      life: number, maxLife: number,
      angle: number, angleSpeed: number
  }> = [];

  init() {
    this.particles = [];
  }

  draw(ctx: CanvasRenderingContext2D, data: Uint8Array, w: number, h: number, colors: string[], settings: VisualizerSettings, rotation: number) {
    let volume = 0;
    for(let i=0; i<data.length; i++) volume += data[i];
    volume = (volume / data.length) * settings.sensitivity;
    
    let turbulence = 0;
    for(let i=50; i<150; i++) turbulence += data[i];
    turbulence /= 100;

    const spawnCount = Math.max(2, 2 + Math.floor(volume / 15)); 
    const maxSmoke = 400;

    if (this.particles.length < maxSmoke) {
        for(let i=0; i<spawnCount; i++) {
            const spawnFromTop = i % 2 === 0;
            const x = Math.random() * w;
            const y = spawnFromTop ? -50 : h + 50;
            const baseSpeed = (0.2 + Math.random() * 0.3) * settings.speed; 
            const vy = spawnFromTop ? baseSpeed : -baseSpeed;
            const distToCenter = h / 2 + 50;
            const maxLife = (distToCenter / Math.abs(baseSpeed)) + 200;

            this.particles.push({
                x, y, vx: (Math.random() - 0.5) * 0.5, vy,
                size: 60 + Math.random() * 100,
                alpha: 0,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 0, maxLife,
                angle: Math.random() * Math.PI * 2,
                angleSpeed: (Math.random() - 0.5) * 0.005
            });
        }
    }

    ctx.globalCompositeOperation = 'screen';
    const time = rotation * 10; 
    const centerY = h / 2;
    const centerX = w / 2;
    const convergenceZone = h * 0.2;

    for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.life++;
        p.angle += p.angleSpeed;
        
        let targetAlpha = 0.2;
        if (p.life < 100) p.alpha = (p.life / 100) * targetAlpha;
        else if (p.life > p.maxLife - 200) p.alpha = ((p.maxLife - p.life) / 200) * targetAlpha;
        else p.alpha = targetAlpha;

        const distY = Math.abs(p.y - centerY);
        let currentVy = p.vy;
        if (distY < convergenceZone) currentVy *= 0.5;
        p.y += currentVy;

        const dx = centerX - p.x;
        p.vx += (dx * 0.0001) * settings.speed; 
        p.vx *= 0.99;
        
        const noiseX = Math.sin(p.y * 0.005 + time * 0.1) * (0.5 + turbulence * 0.5);
        p.x += p.vx + noiseX;
        p.size += 0.1 * settings.speed; 

        if (p.life >= p.maxLife || p.alpha <= 0.001) {
            this.particles.splice(i, 1);
            continue;
        }

        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
        gradient.addColorStop(0, p.color);
        gradient.addColorStop(0.4, p.color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    ctx.globalAlpha = 1.0;
    ctx.globalCompositeOperation = 'source-over';
  }
}

export class RippleRenderer implements IVisualizerRenderer {
  private ripples: Array<{
      x: number, y: number, radius: number, maxRadius: number, 
      alpha: number, speed: number, color: string, lineWidth: number
  }> = [];

  init() {
    this.ripples = [];
  }

  draw(ctx: CanvasRenderingContext2D, data: Uint8Array, w: number, h: number, colors: string[], settings: VisualizerSettings) {
    let bass = 0; for(let i=0; i<10; i++) bass += data[i];
    bass /= 10;
    const bassNormalized = bass / 255;
    
    if (bass > 160 / settings.sensitivity) {
        if (this.ripples.length < 15 && Math.random() > 0.4) {
             this.ripples.push({
                 x: Math.random() * w, y: Math.random() * h,
                 radius: 0,
                 maxRadius: Math.max(w, h) * (0.3 + bassNormalized * 0.5),
                 alpha: 1.0,
                 speed: (2 + bassNormalized * 5) * settings.speed,
                 color: colors[Math.floor(Math.random() * colors.length)],
                 lineWidth: (2 + bassNormalized * 10)
             });
        }
    }
    
    // Center Splash
    if (bass > 100) {
       if (this.ripples.length < 20 && Math.random() > 0.85) {
          this.ripples.push({
               x: w/2, y: h/2,
               radius: 0, maxRadius: Math.max(w, h) * 0.6,
               alpha: 0.8, speed: 5 * settings.speed,
               color: colors[0], lineWidth: 5
           });
       }
    }

    ctx.lineCap = 'round';
    for (let i = this.ripples.length - 1; i >= 0; i--) {
        const r = this.ripples[i];
        r.radius += r.speed;
        r.speed *= 0.98;
        r.alpha -= 0.008;

        if (r.alpha <= 0 || r.radius > r.maxRadius) {
            this.ripples.splice(i, 1);
            continue;
        }

        const ringCount = 3;
        for (let j = 0; j < ringCount; j++) {
             const currentRadius = r.radius - (j * 30);
             if (currentRadius > 0) {
                 const ringAlpha = r.alpha * (1 - (j * 0.3));
                 if (ringAlpha <= 0) continue;
                 
                 ctx.lineWidth = Math.max(0.5, r.lineWidth * (1 - (j * 0.2)));
                 // Highlight
                 ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                 ctx.globalAlpha = ringAlpha * 0.6;
                 ctx.beginPath();
                 ctx.arc(r.x - 2, r.y - 2, currentRadius, 0, Math.PI * 2);
                 ctx.stroke();
                 // Main
                 ctx.strokeStyle = r.color;
                 ctx.globalAlpha = ringAlpha;
                 ctx.beginPath();
                 ctx.arc(r.x, r.y, currentRadius, 0, Math.PI * 2);
                 ctx.stroke();
             }
        }
    }
    ctx.globalAlpha = 1.0;
  }
}