import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { getOptimalCanvasDpr, usePrefersReducedMotion } from '../../hooks/useViewportActivity';

export interface OceanHeroHandle {
  triggerSplash: (x: number, y: number, intensity?: number) => void;
  triggerRipple: (x: number, y: number, size?: number) => void;
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

interface OceanHeroCanvasProps {
  className?: string;
  isActive?: boolean;
}

const MAX_RIPPLES = 12;
const MAX_DROPLETS = 56;

export const OceanHeroCanvas = forwardRef<OceanHeroHandle, OceanHeroCanvasProps>(
  ({ className = '', isActive = true }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const dropletsRef = useRef<SplashDroplet[]>([]);
    const ripplesRef = useRef<WaterRipple[]>([]);
    const timeRef = useRef<number>(0);
    const boundsRef = useRef<{ width: number; height: number; docTop: number; docLeft: number }>({
      width: 0,
      height: 0,
      docTop: 0,
      docLeft: 0
    });
    const oceanGradRef = useRef<CanvasGradient | null>(null);
    const lastMouseRippleRef = useRef<number>(0);
    const prefersReducedMotion = usePrefersReducedMotion();

    const toLocalCoords = (clientX: number, clientY: number) => {
      const { docLeft, docTop, width, height } = boundsRef.current;
      return {
        x: clientX + window.scrollX - docLeft,
        y: clientY + window.scrollY - docTop,
        width,
        height
      };
    };

    const triggerSplash = (clientX: number, clientY: number, intensity: number = 1) => {
      const { x, y, width, height } = toLocalCoords(clientX, clientY);
      if (width === 0 || y > height * 0.7) return;

      if (ripplesRef.current.length < MAX_RIPPLES) {
        ripplesRef.current.push(
          {
            x,
            y,
            radius: 6,
            maxRadius: Math.min(240, width * 0.42) * Math.max(0.7, intensity),
            alpha: 0.92,
            speed: 3.6 * Math.max(0.6, intensity)
          },
          {
            x,
            y,
            radius: 2,
            maxRadius: Math.min(165, width * 0.28) * Math.max(0.7, intensity),
            alpha: 0.68,
            speed: 2.2 * Math.max(0.6, intensity)
          }
        );
      }

      const availableSlots = Math.max(0, MAX_DROPLETS - dropletsRef.current.length);
      const count = Math.min(availableSlots, Math.floor(20 * Math.min(2, intensity)));
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.6;
        const speed = (3.2 + Math.random() * 6.0) * Math.min(1.8, intensity);
        dropletsRef.current.push({
          x: x + (Math.random() - 0.5) * 10,
          y: y + (Math.random() - 0.5) * 10,
          vx: Math.cos(angle) * speed * 0.85,
          vy: -Math.abs(Math.sin(angle) * speed * 1.45) - 3.2 * intensity,
          radius: 1.8 + Math.random() * 2.6,
          alpha: 1,
          decay: 0.022 + Math.random() * 0.02,
          gravity: 0.28
        });
      }
    };

    const triggerRipple = (clientX: number, clientY: number, size: number = 70) => {
      if (ripplesRef.current.length >= MAX_RIPPLES) return;
      const { x, y, width, height } = toLocalCoords(clientX, clientY);
      if (width === 0 || y > height * 0.7) return;

      ripplesRef.current.push({
        x,
        y,
        radius: 4,
        maxRadius: size,
        alpha: 0.52,
        speed: 1.9
      });
    };

    useImperativeHandle(ref, () => ({
      triggerSplash,
      triggerRipple
    }));

    const drawFrameRef = useRef<((dtScale: number) => void) | null>(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) return;

      const handleResize = () => {
        const dpr = getOptimalCanvasDpr();
        const rect = canvas.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        if (width === 0 || height === 0) return;

        boundsRef.current = {
          width,
          height,
          docTop: rect.top + window.scrollY,
          docLeft: rect.left + window.scrollX
        };

        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const shoreBaseY = height * 0.68;
        const grad = ctx.createLinearGradient(0, 0, 0, shoreBaseY);
        grad.addColorStop(0, '#02587a');
        grad.addColorStop(0.35, '#0284c7');
        grad.addColorStop(0.7, '#0ea5e9');
        grad.addColorStop(1, '#38bdf8');
        oceanGradRef.current = grad;

        drawFrameRef.current?.(0);
      };

      const drawFrame = (dtScale: number) => {
        const { width, height } = boundsRef.current;
        if (width === 0 || height === 0) return;

        timeRef.current += 0.014 * dtScale;
        const t = timeRef.current;

        const shoreBaseY = height * 0.68;
        const tidalCycle = (Math.sin(t * 0.22) + 1) * 0.5;
        const tideBase = shoreBaseY + tidalCycle * 18;

        const getTideY = (x: number) =>
          tideBase + Math.sin(x * 0.0045 + t * 0.5) * 8 + Math.cos(x * 0.009 - t * 0.3) * 4;

        ctx.fillStyle = oceanGradRef.current || '#0284c7';
        ctx.fillRect(0, 0, width, height);

        // Subtle sunlit patches
        ctx.globalAlpha = 0.07;
        ctx.fillStyle = '#fff9d4';
        for (let i = 0; i < 4; i++) {
          const patchX = (width * 0.25 * i + Math.sin(t * 0.15 + i) * 20) % width;
          const patchY = height * 0.32 + (i % 2) * (height * 0.12);
          ctx.beginPath();
          ctx.ellipse(patchX, patchY, 120, 45, Math.PI / 8, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;

        const step = width < 640 ? 12 : 8;

        // Upper wave crest
        const wave1Y = height * 0.26;
        ctx.beginPath();
        for (let x = 0; x <= width; x += step) {
          const cy = wave1Y + Math.sin(x * 0.005 + t * 0.45) * 12 + Math.cos(x * 0.009 - t * 0.3) * 5;
          if (x === 0) ctx.moveTo(x, cy);
          else ctx.lineTo(x, cy);
        }
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = 1.8;
        ctx.stroke();

        // Mid wave crest
        const wave2Y = height * 0.45;
        ctx.beginPath();
        for (let x = 0; x <= width; x += step) {
          const cy = wave2Y + Math.sin(x * 0.006 + t * 0.55 + 1.5) * 14 + Math.sin(x * 0.012 - t * 0.25) * 6;
          if (x === 0) ctx.moveTo(x, cy);
          else ctx.lineTo(x, cy);
        }
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
        ctx.lineWidth = 2.2;
        ctx.stroke();

        // Shoreline sand polygon
        ctx.beginPath();
        ctx.moveTo(0, height);
        for (let x = 0; x <= width; x += step) {
          ctx.lineTo(x, getTideY(x));
        }
        ctx.lineTo(width, getTideY(width));
        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fillStyle = '#fff9d4';
        ctx.fill();

        // Wet sand & white foam line
        ctx.beginPath();
        for (let x = 0; x <= width; x += step) {
          const cy = getTideY(x) + 2;
          if (x === 0) ctx.moveTo(x, cy);
          else ctx.lineTo(x, cy);
        }
        ctx.strokeStyle = '#e5dbae';
        ctx.lineWidth = 4.0;
        ctx.stroke();

        ctx.beginPath();
        for (let x = 0; x <= width; x += step) {
          const cy = getTideY(x);
          if (x === 0) ctx.moveTo(x, cy);
          else ctx.lineTo(x, cy);
        }
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.98)';
        ctx.lineWidth = 3.8;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        // Shoreline foam bubbles (batched into single path!)
        ctx.beginPath();
        const bubbleStep = width < 640 ? 28 : 20;
        for (let x = 8; x < width; x += bubbleStep) {
          const cy = getTideY(x);
          const bubbleSpread = (Math.sin(x * 0.06 + t * 0.8) + 1) * 3 + 1;
          const bx = x + Math.sin(t * 0.8 + x) * 2;
          const by = cy + bubbleSpread;
          const br = 1.6 + Math.sin(x * 0.3) * 0.8;
          ctx.moveTo(bx + br, by);
          ctx.arc(bx, by, br, 0, Math.PI * 2);
        }
        ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
        ctx.fill();

        // Interactive water ripples
        const ripples = ripplesRef.current;
        for (let i = ripples.length - 1; i >= 0; i--) {
          const r = ripples[i];
          r.radius += r.speed * dtScale;
          r.alpha -= 0.012 * dtScale;

          if (r.alpha <= 0 || r.radius >= r.maxRadius) {
            ripples[i] = ripples[ripples.length - 1];
            ripples.pop();
            continue;
          }

          ctx.beginPath();
          ctx.ellipse(r.x, r.y, r.radius, r.radius * 0.42, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 255, 255, ${r.alpha * 0.95})`;
          ctx.lineWidth = 2.2;
          ctx.stroke();

          ctx.beginPath();
          ctx.ellipse(r.x, r.y, r.radius * 0.68, r.radius * 0.28, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(103, 232, 249, ${r.alpha * 0.75})`;
          ctx.lineWidth = 1.6;
          ctx.stroke();
        }

        // Splash droplets (without expensive ctx.shadowBlur)
        const droplets = dropletsRef.current;
        for (let i = droplets.length - 1; i >= 0; i--) {
          const d = droplets[i];
          d.x += d.vx * dtScale;
          d.y += d.vy * dtScale;
          d.vy += d.gravity * dtScale;
          d.alpha -= d.decay * dtScale;

          if (d.alpha <= 0) {
            droplets[i] = droplets[droplets.length - 1];
            droplets.pop();
            continue;
          }

          ctx.beginPath();
          ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${d.alpha})`;
          ctx.fill();
        }
      };

      drawFrameRef.current = drawFrame;
      handleResize();
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);

    useEffect(() => {
      if (!isActive || prefersReducedMotion) {
        drawFrameRef.current?.(0);
        return;
      }

      let animId: number;
      let lastTime = performance.now();
      const minFrameMs = 1000 / 62;

      const loop = (now: number) => {
        const elapsed = now - lastTime;
        if (elapsed >= minFrameMs) {
          const dtScale = Math.min(2.5, elapsed / 16.667);
          lastTime = now;
          drawFrameRef.current?.(dtScale);
        }
        animId = requestAnimationFrame(loop);
      };

      animId = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(animId);
    }, [isActive, prefersReducedMotion]);

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
      const now = performance.now();
      if (now - lastMouseRippleRef.current > 140) {
        lastMouseRippleRef.current = now;
        triggerRipple(e.clientX, e.clientY, 65);
      }
    };

    const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
      triggerSplash(e.clientX, e.clientY, 1.4);
    };

    return (
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        className={`w-full h-full block cursor-pointer select-none ${className}`}
      />
    );
  }
);

OceanHeroCanvas.displayName = 'OceanHeroCanvas';
