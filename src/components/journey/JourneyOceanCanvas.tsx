import React, { useEffect, useRef } from 'react';
import { getOptimalCanvasDpr, usePrefersReducedMotion } from '../../hooks/useViewportActivity';

interface JourneyOceanCanvasProps {
  isActive?: boolean;
}

interface BubbleParticle {
  x: number;
  y: number;
  radius: number;
  speed: number;
  wobbleSpeed: number;
  seed: number;
}

export const JourneyOceanCanvas: React.FC<JourneyOceanCanvasProps> = ({ isActive = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
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
    let shorelineHeight = 0;
    let waterGrad: CanvasGradient | null = null;
    let sandGrad: CanvasGradient | null = null;

    const bubbles: BubbleParticle[] = [];

    const initBubbles = (width: number, height: number) => {
      bubbles.length = 0;
      const count = Math.min(24, Math.max(8, Math.floor(width / 70)));
      for (let i = 0; i < count; i++) {
        bubbles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: 1.5 + Math.random() * 3.5,
          speed: 0.6 + Math.random() * 1.2,
          wobbleSpeed: 1 + Math.random() * 2,
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
      ctx.lineWidth = 2.5;
      ctx.setLineDash([14, 14]);
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
      ctx.lineWidth = 2;

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

      // water body (opaque fill replaces clearRect)
      ctx.fillStyle = waterGrad || '#0284c7';
      ctx.fillRect(0, 0, logicalWidth, logicalHeight);

      // shoreline transition sand wave matching tech stack ending color
      const shoreStep = logicalWidth < 768 ? 14 : 10;
      ctx.save();
      ctx.fillStyle = sandGrad || '#faeed1';

      ctx.beginPath();
      ctx.moveTo(-50, -20);
      ctx.lineTo(logicalWidth + 50, -20);
      ctx.lineTo(logicalWidth + 50, shorelineHeight);

      for (let x = logicalWidth + 50; x >= -50; x -= shoreStep) {
        const sy =
          shorelineHeight +
          Math.sin(x * 0.005 + time * 1.2) * 12 +
          Math.cos(x * 0.008 - time * 0.7) * 6;
        ctx.lineTo(x, sy);
      }

      ctx.lineTo(-50, -20);
      ctx.closePath();
      ctx.fill();

      // white foam edge
      ctx.beginPath();
      for (let x = -50; x <= logicalWidth + 50; x += shoreStep) {
        const sy =
          shorelineHeight +
          Math.sin(x * 0.005 + time * 1.2) * 12 +
          Math.cos(x * 0.008 - time * 0.7) * 6;
        if (x === -50) ctx.moveTo(x, sy);
        else ctx.lineTo(x, sy);
      }
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 6;
      ctx.stroke();
      ctx.restore();

      // wave crests
      drawWaveCrest(logicalHeight * 0.32, 0.006, 8, 1.0, 0.45, '#ffffff');
      drawWaveCrest(logicalHeight * 0.55, 0.005, 10, 0.8, 0.4, '#e0f2fe');
      drawWaveCrest(logicalHeight * 0.78, 0.004, 12, 0.6, 0.35, '#bae6fd');

      // fish 1 swimming smoothly across mid depth
      const fish1X = ((time * 45) % (logicalWidth + 160)) - 80;
      const fish1Y = logicalHeight * 0.42 + Math.sin(time * 2) * 15;
      drawFish(fish1X, fish1Y, 14, '#f97316', false);

      // fish 2 swimming in opposite direction
      const fish2X = logicalWidth - (((time * 38) % (logicalWidth + 160)) - 80);
      const fish2Y = logicalHeight * 0.68 + Math.cos(time * 1.8) * 18;
      drawFish(fish2X, fish2Y, 16, '#38bdf8', true);

      // rising bubbles batched into a single path
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.lineWidth = 1;
      ctx.beginPath();

      for (let i = 0; i < bubbles.length; i++) {
        const b = bubbles[i];
        if (dtScale > 0) {
          b.y -= b.speed * dtScale;
          if (b.y < shorelineHeight) {
            b.y = logicalHeight + 10;
            b.x = Math.random() * logicalWidth;
          }
        }

        const wobbleX = b.x + Math.sin(time * b.wobbleSpeed + b.seed) * 6;
        ctx.moveTo(wobbleX + b.radius, b.y);
        ctx.arc(wobbleX, b.y, b.radius, 0, Math.PI * 2);
      }

      ctx.fill();
      ctx.stroke();
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

      shorelineHeight = Math.min(220, logicalHeight * 0.18);

      const wg = ctx.createLinearGradient(0, 0, 0, logicalHeight);
      wg.addColorStop(0, '#38bdf8');
      wg.addColorStop(0.35, '#0284c7');
      wg.addColorStop(0.8, '#0369a1');
      wg.addColorStop(1.0, '#02587a');
      waterGrad = wg;

      const sg = ctx.createLinearGradient(0, 0, 0, shorelineHeight);
      sg.addColorStop(0, '#f2e0aa');
      sg.addColorStop(0.3, '#f6e8ba');
      sg.addColorStop(0.7, '#faeed1');
      sg.addColorStop(1.0, '#fff9d4');
      sandGrad = sg;

      initBubbles(logicalWidth, logicalHeight);
      drawFrame(0);
    };

    const TARGET_INTERVAL = 1000 / 45;

    const loop = (timestamp: number) => {
      if (lastTimestamp === 0) {
        lastTimestamp = timestamp;
      }
      const elapsed = timestamp - lastTimestamp;
      if (elapsed >= TARGET_INTERVAL) {
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
