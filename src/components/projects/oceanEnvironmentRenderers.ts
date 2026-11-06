export interface WaterBounds {
  waterMinY: number;
  waterMaxY: number;
}

export interface CachedSlideGradients {
  waterGrad: CanvasGradient;
  sandGrad: CanvasGradient | null;
}

export function createSlideGradients(
  ctx: CanvasRenderingContext2D,
  height: number,
  depthLevel: 1 | 2 | 3 | 4
): CachedSlideGradients {
  let waterTop: string;
  let waterMid: string;
  let waterBottom: string;

  if (depthLevel === 1) {
    waterTop = '#38bdf8';
    waterMid = '#0284c7';
    waterBottom = '#0369a1';
  } else if (depthLevel === 2) {
    waterTop = '#38bdf8';
    waterMid = '#0284c7';
    waterBottom = '#02587a';
  } else if (depthLevel === 3) {
    waterTop = '#0284c7';
    waterMid = '#02587a';
    waterBottom = '#01283a';
  } else {
    waterTop = '#02587a';
    waterMid = '#024968';
    waterBottom = '#023850';
  }

  const waterGrad = ctx.createLinearGradient(0, 0, 0, height);
  waterGrad.addColorStop(0, waterTop);
  waterGrad.addColorStop(0.55, waterMid);
  waterGrad.addColorStop(1, waterBottom);

  let sandGrad: CanvasGradient | null = null;
  if (depthLevel === 1) {
    const topSandHeight = height * 0.2;
    sandGrad = ctx.createLinearGradient(0, 0, 0, topSandHeight);
    sandGrad.addColorStop(0, '#dfcca8');
    sandGrad.addColorStop(0.25, '#ebdcae');
    sandGrad.addColorStop(0.55, '#f6e8ba');
    sandGrad.addColorStop(0.8, '#faeed1');
    sandGrad.addColorStop(1.0, '#fff9d4');
  } else if (depthLevel === 4) {
    const bottomSandY = height * 0.82;
    sandGrad = ctx.createLinearGradient(0, bottomSandY, 0, height);
    sandGrad.addColorStop(0, '#f0dc9f');
    sandGrad.addColorStop(0.3, '#f6e8ba');
    sandGrad.addColorStop(0.7, '#fcf3d1');
    sandGrad.addColorStop(1.0, '#fff9d4');
  }

  return { waterGrad, sandGrad };
}

export function renderWaterBody(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  waterGrad: CanvasGradient
): void {
  ctx.fillStyle = waterGrad;
  ctx.fillRect(0, 0, width, height);
}

export function renderSandLayers(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  depthLevel: 1 | 2 | 3 | 4,
  time: number,
  sandGrad: CanvasGradient | null
): WaterBounds {
  let waterMinY = 0;
  let waterMaxY = height;
  const step = width < 640 ? 14 : 10;

  if (depthLevel === 1) {
    const topSandHeight = height * 0.2;
    waterMinY = topSandHeight;

    ctx.fillStyle = sandGrad || '#faeed1';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(width, 0);
    ctx.lineTo(width, topSandHeight);

    for (let x = width; x >= 0; x -= step) {
      const sy =
        topSandHeight +
        Math.sin(x * 0.005 + time * 0.8) * 8 +
        Math.cos(x * 0.009 - time * 0.4) * 4;
      ctx.lineTo(x, sy);
    }

    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    for (let x = 0; x <= width; x += step) {
      const sy =
        topSandHeight +
        Math.sin(x * 0.005 + time * 0.8) * 8 +
        Math.cos(x * 0.009 - time * 0.4) * 4;
      if (x === 0) ctx.moveTo(x, sy);
      else ctx.lineTo(x, sy);
    }
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4.5;
    ctx.stroke();
  } else if (depthLevel === 4) {
    const bottomSandY = height * 0.82;
    waterMaxY = bottomSandY;

    ctx.fillStyle = sandGrad || '#f6e8ba';
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(0, bottomSandY);

    for (let x = 0; x <= width; x += step) {
      const sy =
        bottomSandY +
        Math.sin(x * 0.004 + time * 0.6) * 10 +
        Math.cos(x * 0.008 - time * 0.3) * 5;
      ctx.lineTo(x, sy);
    }

    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    for (let x = 0; x <= width; x += step) {
      const sy =
        bottomSandY +
        Math.sin(x * 0.004 + time * 0.6) * 10 +
        Math.cos(x * 0.008 - time * 0.3) * 5;
      if (x === 0) ctx.moveTo(x, sy);
      else ctx.lineTo(x, sy);
    }
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.stroke();
  }

  return { waterMinY, waterMaxY };
}

export function renderWaterWaves(
  ctx: CanvasRenderingContext2D,
  width: number,
  waterMinY: number,
  waterMaxY: number,
  time: number
): void {
  const step = width < 640 ? 14 : 10;

  const wave1Y = waterMinY + (waterMaxY - waterMinY) * 0.35;
  ctx.beginPath();
  for (let x = 0; x <= width; x += step) {
    const cy =
      wave1Y +
      Math.sin(x * 0.004 + time * 1.1) * 14 +
      Math.cos(x * 0.008 - time * 0.5) * 6;
    if (x === 0) ctx.moveTo(x, cy);
    else ctx.lineTo(x, cy);
  }
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.lineWidth = 2.8;
  ctx.stroke();

  const wave2Y = waterMinY + (waterMaxY - waterMinY) * 0.72;
  ctx.beginPath();
  for (let x = 0; x <= width; x += step) {
    const cy =
      wave2Y +
      Math.sin(x * 0.005 + time * 0.9 + 2) * 16 +
      Math.sin(x * 0.01 - time * 0.4) * 8;
    if (x === 0) ctx.moveTo(x, cy);
    else ctx.lineTo(x, cy);
  }
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.lineWidth = 2.4;
  ctx.stroke();
}

export function renderBubbles(
  ctx: CanvasRenderingContext2D,
  width: number,
  waterMinY: number,
  waterMaxY: number,
  time: number
): void {
  const waterHeight = Math.max(1, waterMaxY - waterMinY);
  const bubbleCount = width < 640 ? 8 : 12;

  // Batched bubble circles into single path to minimize Canvas2D draw calls
  ctx.beginPath();
  for (let i = 0; i < bubbleCount; i++) {
    const speed = 0.5 + (i % 4) * 0.25;
    const bx = (width * (i / bubbleCount) + Math.sin(time * 0.8 + i) * 25 + width) % width;
    const by = waterMinY + (waterHeight - ((time * 50 * speed + i * 40) % waterHeight));
    const r = 3.5 + (i % 3) * 2;

    ctx.moveTo(bx + r, by);
    ctx.arc(bx, by, r, 0, Math.PI * 2);
  }
  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.fill();
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1.2;
  ctx.stroke();
}
