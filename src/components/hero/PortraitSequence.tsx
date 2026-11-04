"use client";

import { useMotionValueEvent, type MotionValue } from "motion/react";
import { useEffect, useRef } from "react";
import type { PortraitSequence as Sequence } from "@/content/hero";

/**
 * Draws the portrait for the current scroll position on a canvas.
 *
 * With a real frame sequence, `progress` 0 → 1 scrubs through the frames, so
 * a full turn recorded on video becomes a full turn under the visitor's
 * scroll. Without one, a wireframe bust turns in its place so the motion can
 * be judged before the photography exists. The placeholder is labelled by the
 * parent; it contains no likeness.
 */
export function PortraitSequence({ progress, sequence, className }: { progress: MotionValue<number>; sequence: Sequence; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const lastRef = useRef(-1);

  // Preload the frames once; drawing waits for whichever frame is needed.
  useEffect(() => {
    if (sequence.frames <= 0) return;
    const images: HTMLImageElement[] = [];
    for (let i = 0; i < sequence.frames; i += 1) {
      const img = new Image();
      img.decoding = "async";
      img.src = `${sequence.dir}/${String(i + 1).padStart(3, "0")}.webp`;
      images.push(img);
    }
    framesRef.current = images;
    const first = images[0];
    const redraw = () => draw(canvasRef.current, framesRef.current, sequence.frames, progress.get());
    if (first.complete) redraw();
    else first.addEventListener("load", redraw, { once: true });
    return () => {
      framesRef.current = [];
    };
  }, [progress, sequence.dir, sequence.frames]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      lastRef.current = -1;
      const p = progress.get();
      canvas.dataset.frame = String(frameIndex(p, sequence.frames));
      draw(canvas, framesRef.current, sequence.frames, p);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [progress, sequence.frames]);

  useMotionValueEvent(progress, "change", (p) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const key = Math.round(p * 720);
    if (key === lastRef.current) return;
    lastRef.current = key;
    canvas.dataset.frame = String(frameIndex(p, sequence.frames));
    draw(canvas, framesRef.current, sequence.frames, p);
  });

  return <canvas ref={canvasRef} data-testid="portrait-canvas" data-frame="0" aria-hidden="true" className={className} />;
}

function frameIndex(p: number, frames: number) {
  if (frames <= 0) return Math.round(p * 360);
  return Math.min(frames - 1, Math.max(0, Math.floor(p * frames)));
}

function draw(canvas: HTMLCanvasElement | null, images: HTMLImageElement[], frames: number, p: number) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const { width, height } = canvas;
  ctx.clearRect(0, 0, width, height);
  if (frames > 0 && images.length) {
    const img = images[frameIndex(p, frames)];
    if (img && img.complete && img.naturalWidth > 0) {
      drawCover(ctx, img, width, height);
      return;
    }
  }
  drawWireframe(ctx, width, height, p * Math.PI * 2);
}

function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, width: number, height: number) {
  const scale = Math.max(width / img.naturalWidth, height / img.naturalHeight);
  const w = img.naturalWidth * scale;
  const h = img.naturalHeight * scale;
  ctx.drawImage(img, (width - w) / 2, (height - h) / 2, w, h);
}

type Point = [number, number, number];

/** Rotates a point about the vertical axis and projects it with mild perspective. */
function project([x, y, z]: Point, angle: number, width: number, height: number) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const rx = x * c - z * s;
  const rz = x * s + z * c;
  const scale = Math.min(width, height) * 0.36;
  const depth = 1 / (1 + rz * 0.18);
  return { x: width / 2 + rx * scale * depth, y: height * 0.56 + y * scale * depth, z: rz };
}

/**
 * A wireframe bust: head, neck and shoulders built from rings, lit from the
 * front so lines facing the visitor read brighter than those behind.
 */
function drawWireframe(ctx: CanvasRenderingContext2D, width: number, height: number, angle: number) {
  const line = (points: Point[], close: boolean) => {
    for (let i = 0; i < points.length - (close ? 0 : 1); i += 1) {
      const a = project(points[i], angle, width, height);
      const b = project(points[(i + 1) % points.length], angle, width, height);
      const facing = 1 - (a.z + b.z) / 2; // 0 far, 2 near
      const alpha = 0.1 + Math.max(0, facing - 0.55) * 0.55;
      ctx.strokeStyle = `rgba(219, 173, 150, ${alpha.toFixed(3)})`;
      ctx.lineWidth = (0.6 + facing * 0.5) * (width / 900);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
  };

  const segments = 48;
  const ring = (cy: number, rx: number, rz: number, tilt = 0): Point[] =>
    Array.from({ length: segments }, (_, i) => {
      const t = (i / segments) * Math.PI * 2;
      return [Math.cos(t) * rx, cy + Math.sin(t) * rz * tilt, Math.sin(t) * rz];
    });

  // Head: an ellipsoid, slightly taller than wide, with the face toward +z.
  const headY = -0.62;
  const headR = 0.3;
  for (let i = -5; i <= 5; i += 1) {
    const f = i / 6;
    const r = Math.sqrt(1 - f * f);
    line(ring(headY + f * headR * 1.18, headR * r * (f > 0.3 ? 0.94 : 1), headR * r * (f < -0.2 ? 1.06 : 1)), true);
  }
  // Meridians give the head its volume while it turns.
  for (let m = 0; m < 12; m += 1) {
    const t = (m / 12) * Math.PI;
    const pts: Point[] = Array.from({ length: 25 }, (_, i) => {
      const u = -Math.PI / 2 + (i / 24) * Math.PI;
      return [Math.cos(u) * Math.cos(t) * headR, headY + Math.sin(u) * headR * 1.18, Math.cos(u) * Math.sin(t) * headR * 1.02];
    });
    line(pts, false);
  }
  // Face plane: brow line, nose ridge and jaw hint, so the turn has a front.
  line([[-0.14, headY - 0.06, 0.27], [0.14, headY - 0.06, 0.27]], false);
  line([[0, headY - 0.02, 0.29], [0, headY + 0.1, 0.34], [0.035, headY + 0.12, 0.3]], false);
  line([[-0.17, headY + 0.1, 0.22], [-0.09, headY + 0.3, 0.2], [0, headY + 0.35, 0.21], [0.09, headY + 0.3, 0.2], [0.17, headY + 0.1, 0.22]], false);

  // Neck.
  for (let i = 0; i < 4; i += 1) line(ring(-0.26 + i * 0.06, 0.11, 0.11), true);

  // Shoulders and chest: a wide ellipsoid, open at the bottom.
  for (let i = 0; i <= 7; i += 1) {
    const f = i / 8;
    const y = -0.08 + f * 0.95;
    const w = 0.36 + Math.sin(Math.min(1, f * 1.6) * Math.PI * 0.5) * 0.5;
    line(ring(y, w, 0.3 + f * 0.04), true);
  }
  for (let m = 0; m < 16; m += 1) {
    const t = (m / 16) * Math.PI * 2;
    const pts: Point[] = Array.from({ length: 9 }, (_, i) => {
      const f = i / 8;
      const y = -0.08 + f * 0.95;
      const w = 0.36 + Math.sin(Math.min(1, f * 1.6) * Math.PI * 0.5) * 0.5;
      return [Math.cos(t) * w, y, Math.sin(t) * (0.3 + f * 0.04)];
    });
    line(pts, false);
  }
}
