"use client";

import { useEffect, useRef } from "react";

interface Props {
  opacity?: number;
}

export default function HalftoneCanvas({ opacity = 0.22 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const GRID = 26;
    let W = 0, H = 0;
    let cols = 0, rows = 0;
    let t = 0;

    const resize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;
      cols = Math.ceil(W / GRID) + 1;
      rows = Math.ceil(H / GRID) + 1;
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) / W,
        y: (e.clientY - rect.top) / H,
      };
    };

    const draw = () => {
      t += 0.006;
      ctx.clearRect(0, 0, W, H);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * GRID;
          const y = row * GRID;

          const nx = x / W; // 0→1 left to right
          const ny = y / H; // 0→1 top to bottom

          // Distance from mouse
          const dx = nx - mx;
          const dy = ny - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const mousePull = Math.max(0, 1 - dist * 2.2);

          // Wave
          const wave =
            Math.sin(col * 0.35 + t) * 0.5 +
            Math.sin(row * 0.35 + t * 0.8) * 0.5;

          // Dot size
          const base = GRID * 0.08;
          const r = base + wave * GRID * 0.13 + mousePull * GRID * 0.32;
          if (r <= 0.3) continue;

          // Hue: position gradient (like the reference image)
          // X axis: green(120) → yellow(60) on right
          // Y axis: top stays bright, bottom shifts to blue(240) → pink(320)
          const hueX = 120 - nx * 80;            // 120 (green) → 40 (yellow-orange) L→R
          const hueY = ny * 220;                 // 0 → 220 (blue→pink) T→B
          const hue = (hueX + hueY + t * 18) % 360;

          // Saturation and lightness — vivid neon
          const sat = 85 + mousePull * 15;
          const lig = 52 + wave * 8;

          ctx.fillStyle = `hsl(${hue}, ${sat}%, ${lig}%)`;
          ctx.beginPath();
          ctx.arc(x, y, Math.max(0.4, r), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        opacity,
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
