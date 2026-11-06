import React, { useEffect, useRef } from 'react';
import {
  createSlideGradients,
  renderWaterBody,
  renderSandLayers,
  renderWaterWaves,
  renderBubbles,
  type CachedSlideGradients
} from './oceanEnvironmentRenderers';
import { renderCreaturesByDepth } from './oceanCreatureRenderers';
import { getOptimalCanvasDpr, usePrefersReducedMotion } from '../../hooks/useViewportActivity';

interface AnimatedOceanSlideBackgroundProps {
  depthLevel: 1 | 2 | 3 | 4;
  isActive?: boolean;
}

export const AnimatedOceanSlideBackground: React.FC<AnimatedOceanSlideBackgroundProps> = ({
  depthLevel,
  isActive = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const timeRef = useRef<number>(0);
  const sizeRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });
  const gradientsRef = useRef<CachedSlideGradients | null>(null);
  const drawFrameRef = useRef<((dtScale: number) => void) | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const drawFrame = (dtScale: number) => {
      const { width, height } = sizeRef.current;
      const grads = gradientsRef.current;
      if (width === 0 || height === 0 || !grads) return;

      timeRef.current += 0.016 * dtScale;
      const time = timeRef.current;

      renderWaterBody(ctx, width, height, grads.waterGrad);
      const { waterMinY, waterMaxY } = renderSandLayers(
        ctx,
        width,
        height,
        depthLevel,
        time,
        grads.sandGrad
      );
      renderWaterWaves(ctx, width, waterMinY, waterMaxY, time);
      renderCreaturesByDepth(ctx, depthLevel, width, height, time, waterMinY, waterMaxY);
      renderBubbles(ctx, width, waterMinY, waterMaxY, time);
    };

    drawFrameRef.current = drawFrame;

    const handleResize = () => {
      const dpr = getOptimalCanvasDpr();
      const width = window.innerWidth;
      const height = window.innerHeight;
      sizeRef.current = { width, height };

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      gradientsRef.current = createSlideGradients(ctx, height, depthLevel);
      drawFrame(0);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [depthLevel]);

  useEffect(() => {
    if (!isActive || prefersReducedMotion) {
      drawFrameRef.current?.(0);
      return;
    }

    let animId: number;
    let lastTime = performance.now();
    // 45fps cap on background ambient ocean slides saves ~25-65% GPU fill-rate on 60-144Hz screens
    const minFrameMs = 1000 / 48;

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

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};
