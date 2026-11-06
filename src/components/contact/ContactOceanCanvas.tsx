import React, { useEffect, useRef } from 'react';
import { getOptimalCanvasDpr, usePrefersReducedMotion } from '../../hooks/useViewportActivity';

interface ContactOceanCanvasProps {
  isActive?: boolean;
}

interface SplashDroplet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  decay: number;
  gravity: number;
}

interface WaterRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  speed: number;
}

interface BubbleParticle {
  x: number;
  y: number;
  radius: number;
  speed: number;
  wobbleSpeed: number;
  seed: number;
}

export const ContactOceanCanvas: React.FC<ContactOceanCanvasProps> = ({ isActive = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dropletsRef = useRef<SplashDroplet[]>([]);
  const ripplesRef = useRef<WaterRipple[]>([]);
  const prefersReducedMotion = usePrefersReducedMotion();
  const drawStaticRef = useRef<(() => void) | null>(null);
  const loopControlRef = useRef<{ start: () => void; stop: () => void } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animId: number | null = null;
    let time = 0;
    let lastTimestamp = 0;
    let logicalWidth = 0;
    let logicalHeight = 0;
    let seabedY = 0;
    let waterGrad: CanvasGradient | null = null;
    let seabedGrad: CanvasGradient | null = null;

    const bubbles: BubbleParticle[] = [];
    const initBubbles = (width: number, height: number) => {
      bubbles.length = 0;
      const count = Math.min(26, Math.max(8, Math.floor(width / 55)));
      for (let i = 0; i < count; i++) {
        bubbles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: 1.5 + Math.random() * 4,
          speed: 0.7 + Math.random() * 1.3,
          wobbleSpeed: 1.2 + Math.random() * 2,
          seed: Math.random() * 100
        });
      }
    };

    const drawWaveCrest = (
      yPos: number,
      freq: number,
      amp: number,
      speed: number,
      alpha: number,
      color: string
    ) => {
      ctx.save();
      ctx.beginPath();
      const step = logicalWidth < 768 ? 16 : 12;
      for (let x = 0; x <= logicalWidth; x += step) {
        const wy =
          yPos +
          Math.sin(x * freq + time * speed) * amp +
          Math.cos(x * (freq * 0.7) - time * (speed * 0.5)) * (amp * 0.5);
        if (x === 0) ctx.moveTo(x, wy);
        else ctx.lineTo(x, wy);
      }
      ctx.strokeStyle = color;
      ctx.globalAlpha = alpha;
      ctx.lineWidth = 2;
      ctx.setLineDash([12, 14]);
      ctx.stroke();
      ctx.restore();
    };

    const drawFish = (fx: number, fy: number, size: number, color: string, flip: boolean) => {
      ctx.save();
      ctx.translate(fx, fy);
      if (flip) ctx.scale(-1, 1);

      const tailWag = Math.sin(time * 8) * (size * 0.3);

      ctx.fillStyle = color;
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.8;

      // tail
      ctx.beginPath();
      ctx.moveTo(-size * 1.2, 0);
      ctx.lineTo(-size * 1.8, -size * 0.6 + tailWag);
      ctx.lineTo(-size * 1.5, tailWag * 0.5);
      ctx.lineTo(-size * 1.8, size * 0.6 + tailWag);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // body
      ctx.beginPath();
      ctx.ellipse(0, 0, size * 1.2, size * 0.75, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // eye
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(size * 0.6, -size * 0.2, size * 0.22, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(size * 0.68, -size * 0.2, size * 0.11, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const drawFrame = (dtScale: number) => {
      if (logicalWidth <= 0 || logicalHeight <= 0) return;

      // water body gradient (opaque fill replaces clearRect)
      ctx.fillStyle = waterGrad || '#02587a';
      ctx.fillRect(0, 0, logicalWidth, logicalHeight);

      // wave crest lines
      drawWaveCrest(logicalHeight * 0.2, 0.005, 8, 1.0, 0.35, '#38bdf8');
      drawWaveCrest(logicalHeight * 0.5, 0.004, 10, 0.8, 0.3, '#0ea5e9');
      drawWaveCrest(logicalHeight * 0.75, 0.004, 9, 0.7, 0.25, '#7dd3fc');

      // fish
      const fishX = ((time * 40) % (logicalWidth + 160)) - 80;
      const fishY = logicalHeight * 0.35 + Math.sin(time * 1.5) * 12;
      drawFish(fishX, fishY, 13, '#38bdf8', false);

      // rising bubbles batched into a single path
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 1;
      ctx.beginPath();

      for (let i = 0; i < bubbles.length; i++) {
        const b = bubbles[i];
        if (dtScale > 0) {
          b.y -= b.speed * dtScale;
          if (b.y < -10) {
            b.y = logicalHeight + 10;
            b.x = Math.random() * logicalWidth;
          }
        }

        const wobbleX = b.x + Math.sin(time * b.wobbleSpeed + b.seed) * 5;
        ctx.moveTo(wobbleX + b.radius, b.y);
        ctx.arc(wobbleX, b.y, b.radius, 0, Math.PI * 2);
      }

      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // draw water ripples (swap-and-pop removal)
      const ripples = ripplesRef.current;
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += r.speed * (dtScale || 1);
        r.alpha -= 0.018 * (dtScale || 1);

        if (r.alpha <= 0 || r.radius >= r.maxRadius) {
          ripples[i] = ripples[ripples.length - 1];
          ripples.pop();
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = '#38bdf8';
        ctx.globalAlpha = r.alpha;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(r.x, r.y, Math.max(1, r.radius * 0.6), 0, Math.PI * 2);
        ctx.strokeStyle = '#ffffff';
        ctx.globalAlpha = r.alpha * 0.8;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      }

      // draw splash droplets (swap-and-pop removal)
      const droplets = dropletsRef.current;
      for (let i = droplets.length - 1; i >= 0; i--) {
        const d = droplets[i];
        const step = dtScale || 1;
        d.x += d.vx * step;
        d.y += d.vy * step;
        d.vy += d.gravity * step;
        d.alpha -= d.decay * step;

        if (d.alpha <= 0 || d.y > logicalHeight) {
          droplets[i] = droplets[droplets.length - 1];
          droplets.pop();
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#bae6fd';
        ctx.globalAlpha = d.alpha;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      }

      // seabed sand floor
      ctx.save();
      ctx.fillStyle = seabedGrad || '#ebdcae';

      ctx.beginPath();
      ctx.moveTo(-50, logicalHeight + 20);
      ctx.lineTo(-50, seabedY);

      const sandStep = logicalWidth < 768 ? 16 : 12;
      for (let x = -50; x <= logicalWidth + 50; x += sandStep) {
        const sy =
          seabedY +
          Math.sin(x * 0.006 + time * 0.8) * 8 +
          Math.cos(x * 0.009 - time * 0.4) * 4;
        ctx.lineTo(x, sy);
      }

      ctx.lineTo(logicalWidth + 50, logicalHeight + 20);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = getOptimalCanvasDpr();
      logicalWidth = parent.clientWidth;
      logicalHeight = parent.clientHeight;
      if (logicalWidth <= 0 || logicalHeight <= 0) return;

      canvas.width = Math.round(logicalWidth * dpr);
      canvas.height = Math.round(logicalHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      seabedY = logicalHeight * 0.88;

      const wg = ctx.createLinearGradient(0, 0, 0, logicalHeight);
      wg.addColorStop(0, '#02587a');
      wg.addColorStop(0.35, '#024968');
      wg.addColorStop(0.85, '#013852');
      wg.addColorStop(1.0, '#01283c');
      waterGrad = wg;

      const sg = ctx.createLinearGradient(0, seabedY, 0, logicalHeight);
      sg.addColorStop(0, '#f0dc9f');
      sg.addColorStop(0.5, '#ebdcae');
      sg.addColorStop(1.0, '#dfcca8');
      seabedGrad = sg;

      initBubbles(logicalWidth, logicalHeight);
      drawFrame(0);
    };

    // click handler to trigger water splash
    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (ripplesRef.current.length < 12) {
        ripplesRef.current.push(
          {
            x,
            y,
            radius: 4,
            maxRadius: 140,
            alpha: 0.9,
            speed: 3.2
          },
          {
            x,
            y,
            radius: 2,
            maxRadius: 90,
            alpha: 0.65,
            speed: 2.0
          }
        );
      }

      const count = logicalWidth < 768 ? 10 : 14;
      for (let i = 0; i < count; i++) {
        if (dropletsRef.current.length >= 64) break;
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
        const speed = 2.5 + Math.random() * 4.5;
        dropletsRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2.5,
          radius: 1.5 + Math.random() * 2.5,
          alpha: 1,
          decay: 0.02 + Math.random() * 0.015,
          gravity: 0.18
        });
      }
    };

    const parent = canvas.parentElement;
    if (parent) {
      parent.addEventListener('click', handleClick);
    }

    const AMBIENT_INTERVAL = 1000 / 45;

    const loop = (timestamp: number) => {
      if (lastTimestamp === 0) {
        lastTimestamp = timestamp;
      }
      const elapsed = timestamp - lastTimestamp;
      const hasInteractiveSplash =
        ripplesRef.current.length > 0 || dropletsRef.current.length > 0;
      const targetInterval = hasInteractiveSplash ? 14 : AMBIENT_INTERVAL;

      if (elapsed >= targetInterval) {
        const clampedMs = Math.min(elapsed, 50);
        const dtScale = clampedMs / 16.667;
        time += clampedMs * 0.001;
        lastTimestamp = timestamp;
        drawFrame(dtScale);
      }
      animId = requestAnimationFrame(loop);
    };

    const start = () => {
      if (animId === null) {
        lastTimestamp = 0;
        animId = requestAnimationFrame(loop);
      }
    };

    const stop = () => {
      if (animId !== null) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    };

    drawStaticRef.current = () => drawFrame(0);
    loopControlRef.current = { start, stop };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      stop();
      window.removeEventListener('resize', handleResize);
      if (parent) {
        parent.removeEventListener('click', handleClick);
      }
      loopControlRef.current = null;
      drawStaticRef.current = null;
    };
  }, []);

  useEffect(() => {
    const controls = loopControlRef.current;
    if (!controls) return;

    if (isActive && !prefersReducedMotion) {
      controls.start();
    } else {
      controls.stop();
      drawStaticRef.current?.();
    }
  }, [isActive, prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};
