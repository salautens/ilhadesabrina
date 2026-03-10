"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import rawDots   from "../public/globe-dots.json";
import rawFigure from "../public/figure-dots.json";

/* ── Types ──────────────────────────────────────────────────────── */
interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number;
  size: number;
  color: string;
}

interface FigurePx {
  bx: number; by: number;
  dy: number;
  alpha: number;
  speed: number;
  r: number;
  baseOpacity: number;
  filled: boolean;
}

interface Globe3DDot {
  gx: number; gy: number; gz: number;
  filled: boolean;
}

/* ── Figure data ────────────────────────────────────────────────── */
const FIGURE_JSON = rawFigure as {
  srcW: number; srcH: number;
  particles: { type: string; x: number; y: number; r: number; opacity: number }[];
};
const FIGURE_SRC_W = FIGURE_JSON.srcW;
const FIGURE_SRC_H = FIGURE_JSON.srcH;

/* ── Globe 3D data ──────────────────────────────────────────────── */
const GLOBE_DOTS: Globe3DDot[] = (rawDots as { gx: number; gy: number; gz: number; filled: boolean }[])
  .map(d => ({ gx: d.gx, gy: d.gy, gz: d.gz, filled: d.filled }));

const VIEW_LON = -20 * Math.PI / 180;
const VIEW_LAT =  15 * Math.PI / 180;

const NEON = ["#F5E040", "#3ACFFF", "#C04DFF", "#FF3FA8", "#3DFF6E"];

function hexToRgb(hex: string) {
  return [parseInt(hex.slice(1,3),16), parseInt(hex.slice(3,5),16), parseInt(hex.slice(5,7),16)];
}
function lerpColor(a: string, b: string, t: number) {
  const [ar,ag,ab] = hexToRgb(a), [br,bg,bb] = hexToRgb(b);
  return `rgb(${Math.round(ar+(br-ar)*t)},${Math.round(ag+(bg-ag)*t)},${Math.round(ab+(bb-ab)*t)})`;
}

/* ── Shapes ─────────────────────────────────────────────────────── */
const shapes = [
  { id: 1, neon: "#3DFF6E", style: { backgroundColor: "#1A1815" } },
  { id: 2, neon: "#F5E040", style: { backgroundColor: "#1A1815", clipPath: "polygon(0 0, 78% 0, 100% 22%, 100% 100%, 0 100%)" } },
  { id: 3, neon: "#3ACFFF", arch: true, style: { backgroundColor: "#1A1815" } },
  { id: 4, neon: "#C04DFF", style: { backgroundColor: "#1A1815", clipPath: "polygon(28% 0, 72% 0, 72% 38%, 100% 38%, 100% 100%, 0 100%, 0 38%, 28% 38%)" } },
  { id: 5, neon: "#FF3FA8", style: { backgroundColor: "#1A1815", clipPath: "polygon(18% 0, 100% 0, 100% 82%, 82% 100%, 0 100%, 0 18%)" } },
];
const heights = [280, 240, 360, 280, 300];
const widths  = ["19%", "17%", "24%", "16%", "20%"];

/* ── Particle helper ────────────────────────────────────────────── */
function burst(particles: Particle[], cx: number, cy: number, color: string, count: number, speedMin: number, speedMax: number, lifeBase = 1) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = speedMin + Math.random() * (speedMax - speedMin);
    particles.push({
      x: cx + (Math.random()-0.5)*20, y: cy + (Math.random()-0.5)*15,
      vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed,
      life: lifeBase*(0.7+Math.random()*0.3),
      size: [2,2,3,3,3,4,5][Math.floor(Math.random()*7)], color,
    });
  }
}

/* ── Footer ─────────────────────────────────────────────────────── */
export default function Footer() {
  const [hovered, setHovered] = useState<number | null>(null);

  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const shapeRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef       = useRef<number>(0);
  const runningRef   = useRef(false);
  const hoveredRef   = useRef<number | null>(null);
  const emitFrameRef = useRef(0);
  const timersRef    = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Figure
  const figurePxRef     = useRef<FigurePx[]>([]);
  const figureActiveRef = useRef(false);

  // Globe
  const globeYawRef   = useRef(VIEW_LON);
  const globeAlphaRef = useRef(0);
  const globeFrameRef = useRef(0);
  const cursorVelRef  = useRef(0);

  // Eye (shape 4)
  const eyeAlphaRef    = useRef(0);
  const eyePupilXRef   = useRef(0);
  const eyePupilYRef   = useRef(0);
  const eyeTargetXRef  = useRef(0);
  const eyeTargetYRef  = useRef(0);
  const eyeBlinkRef    = useRef(0);      // 0=open 1=closed
  const eyeBlinkDirRef = useRef(0);      // 0=idle 1=closing -1=opening
  const eyeBlinkCDRef  = useRef(200);    // countdown to next blink
  const eyeFrameRef    = useRef(0);
  const cursorCXRef    = useRef(-9999);  // cursor x in canvas coords
  const cursorCYRef    = useRef(-9999);

  /* ── Animation tick ─────────────────────────────────────────── */
  const tickRef = useRef<() => void>(null!);
  tickRef.current = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesRef.current = particlesRef.current.filter(p => p.life > 0.01);

    /* Shape 1 — continuous scanline */
    if (hoveredRef.current === 0) {
      emitFrameRef.current++;
      if (emitFrameRef.current % 2 === 0) {
        const el = shapeRefs.current[0], cont = containerRef.current;
        if (el && cont) {
          const cr = cont.getBoundingClientRect(), sr = el.getBoundingClientRect();
          const sx = sr.left-cr.left, sy = sr.top-cr.top;
          for (let i = 0; i < 8; i++) {
            particlesRef.current.push({
              x: sx+Math.random()*sr.width, y: sy+Math.random()*sr.height,
              vx: (Math.random()-0.5)*1.4, vy: -1.2-Math.random()*2,
              life: 0.6+Math.random()*0.4, size: Math.random()<0.5?2:3, color:"#3DFF6E",
            });
          }
        }
      }
    }

    /* Render particles */
    for (const p of particlesRef.current) {
      ctx.globalAlpha = Math.pow(p.life, 1.6);
      ctx.fillStyle   = p.color;
      ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
      p.vx *= 0.95; p.vy *= 0.95; p.vy += 0.06;
      p.x += p.vx; p.y += p.vy; p.life -= 0.013;
    }

    /* ── Globe 3D ───────────────────────────────────────────── */
    const isGlobeActive = hoveredRef.current === 1 || globeAlphaRef.current > 0;
    if (isGlobeActive) {
      const el = shapeRefs.current[1], cont = containerRef.current;
      if (el && cont) {
        const cr = cont.getBoundingClientRect(), sr = el.getBoundingClientRect();
        const cx = sr.left-cr.left+sr.width/2, cy = sr.top-cr.top+sr.height/2;
        const R  = Math.min(sr.width, sr.height) * 0.46;

        if (hoveredRef.current === 1) globeAlphaRef.current = Math.min(1, globeAlphaRef.current+0.04);
        else                          globeAlphaRef.current = Math.max(0, globeAlphaRef.current-0.03);

        globeYawRef.current += 0.006 + cursorVelRef.current * 0.002;
        cursorVelRef.current *= 0.92;

        globeFrameRef.current++;
        const colorT   = (globeFrameRef.current % (NEON.length * 60)) / 60;
        const colorIdx = Math.floor(colorT) % NEON.length;
        const currentColor = lerpColor(NEON[colorIdx], NEON[(colorIdx+1)%NEON.length], colorT-Math.floor(colorT));

        const yaw=globeYawRef.current, pitch=VIEW_LAT;
        const cosY=Math.cos(yaw), sinY=Math.sin(yaw), cosP=Math.cos(pitch), sinP=Math.sin(pitch);
        ctx.lineWidth = 0.8;

        for (const dot of GLOBE_DOTS) {
          const rx1 = dot.gx*cosY+dot.gz*sinY, ry1 = dot.gy, rz1 = -dot.gx*sinY+dot.gz*cosY;
          const rx2 = rx1, ry2 = ry1*cosP-rz1*sinP, rz2 = ry1*sinP+rz1*cosP;
          if (rz2 <= 0.05) continue;
          const depth = (rz2+0.05)/1.05;
          const dotR  = dot.filled ? 1.8+depth*1.2 : 2.2+depth*0.8;
          ctx.globalAlpha = globeAlphaRef.current * (0.4+depth*0.6);
          ctx.beginPath();
          ctx.arc(cx+rx2*R, cy-ry2*R, dotR, 0, Math.PI*2);
          if (dot.filled) { ctx.fillStyle=currentColor; ctx.fill(); }
          else            { ctx.strokeStyle=currentColor; ctx.stroke(); }
        }
        ctx.globalAlpha = 1;
      }
    }

    /* ── Orb (shape 4) — clipped to I-beam, ball roams freely ── */
    const isOrbActive = hoveredRef.current === 3 || eyeAlphaRef.current > 0;
    if (isOrbActive) {
      const el4 = shapeRefs.current[3], cont = containerRef.current;
      if (el4 && cont) {
        const cr = cont.getBoundingClientRect();
        const sr = el4.getBoundingClientRect();

        const bL = sr.left  - cr.left;   // block left in canvas coords
        const bT = sr.top   - cr.top;
        const bW = sr.width;
        const bH = sr.height;

        // Fade
        if (hoveredRef.current === 3) eyeAlphaRef.current = Math.min(1, eyeAlphaRef.current + 0.055);
        else                          eyeAlphaRef.current = Math.max(0, eyeAlphaRef.current - 0.028);
        const gA = eyeAlphaRef.current;

        eyeFrameRef.current++;

        // Sizes
        const outerR = bH * 0.52;   // outermost ring reaches full block height
        const ballR  = outerR * 0.14;

        // Ball constrained to I-beam shape
        // Top part (y < bT + bH*0.38): narrow (28%–72%)
        // Bottom part: full width
        const pad      = ballR + 3;
        const joinY    = bT + bH * 0.38;
        const inTop    = cursorCYRef.current < joinY;
        const minX     = inTop ? bL + bW*0.28 + pad : bL + pad;
        const maxX     = inTop ? bL + bW*0.72 - pad : bL + bW - pad;
        const clampX   = Math.max(minX, Math.min(maxX, cursorCXRef.current));
        const clampY   = Math.max(bT + pad, Math.min(bT + bH - pad, cursorCYRef.current));
        eyePupilXRef.current += (clampX - eyePupilXRef.current) * 0.11;
        eyePupilYRef.current += (clampY - eyePupilYRef.current) * 0.11;
        const bX = eyePupilXRef.current;
        const bY = eyePupilYRef.current;

        // Ring centre = full block centre
        const cx = bL + bW / 2;
        const cy = bT + bH / 2;

        // ── Clip canvas to I-beam polygon ─────────────────────
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(bL + bW*0.28, bT);
        ctx.lineTo(bL + bW*0.72, bT);
        ctx.lineTo(bL + bW*0.72, bT + bH*0.38);
        ctx.lineTo(bL + bW,      bT + bH*0.38);
        ctx.lineTo(bL + bW,      bT + bH);
        ctx.lineTo(bL,           bT + bH);
        ctx.lineTo(bL,           bT + bH*0.38);
        ctx.lineTo(bL + bW*0.28, bT + bH*0.38);
        ctx.closePath();
        ctx.clip();

        // ── Rings (centred on block, repelled by ball) ────────
        const INFLUENCE = outerR * 0.70;
        const MAX_PUSH  = outerR * 0.18;

        const RINGS = [
          { r: outerR*0.26, n: 18, dr: 1.0, spd:  0.0070, op: 0.50 },
          { r: outerR*0.44, n: 30, dr: 1.1, spd: -0.0045, op: 0.65 },
          { r: outerR*0.62, n: 42, dr: 1.2, spd:  0.0032, op: 0.78 },
          { r: outerR*0.80, n: 56, dr: 1.3, spd: -0.0022, op: 0.88 },
          { r: outerR*0.96, n: 72, dr: 1.4, spd:  0.0014, op: 0.94 },
        ];

        for (const ring of RINGS) {
          const off = eyeFrameRef.current * ring.spd;
          for (let j = 0; j < ring.n; j++) {
            const a = (j / ring.n) * Math.PI * 2 + off;
            let dx = Math.cos(a) * ring.r;
            let dy = Math.sin(a) * ring.r;

            const rx = cx + dx - bX, ry = cy + dy - bY;
            const rd = Math.sqrt(rx*rx + ry*ry) || 1;
            if (rd < INFLUENCE) {
              const push = (1 - rd / INFLUENCE) * MAX_PUSH;
              dx += (rx / rd) * push;
              dy += (ry / rd) * push;
            }

            ctx.globalAlpha = gA * ring.op;
            ctx.fillStyle   = "#C04DFF";
            ctx.beginPath();
            ctx.arc(cx + dx, cy + dy, ring.dr, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // ── Ball aura ─────────────────────────────────────────
        const aura = ctx.createRadialGradient(bX, bY, 0, bX, bY, ballR * 3.4);
        aura.addColorStop(0,    `rgba(192, 77, 255, ${gA * 0.55})`);
        aura.addColorStop(0.38, `rgba(192, 77, 255, ${gA * 0.20})`);
        aura.addColorStop(1,    `rgba(192, 77, 255, 0)`);
        ctx.globalAlpha = 1;
        ctx.fillStyle   = aura;
        ctx.beginPath();
        ctx.arc(bX, bY, ballR * 3.4, 0, Math.PI * 2);
        ctx.fill();

        // ── Ball sphere ───────────────────────────────────────
        const ballFill = ctx.createRadialGradient(bX - ballR*0.35, bY - ballR*0.35, 0, bX, bY, ballR);
        ballFill.addColorStop(0,    `rgba(240, 195, 255, ${gA})`);
        ballFill.addColorStop(0.45, `rgba(192, 77,  255, ${gA})`);
        ballFill.addColorStop(1,    `rgba(75,  0,   125, ${gA})`);
        ctx.fillStyle = ballFill;
        ctx.beginPath();
        ctx.arc(bX, bY, ballR, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = `rgba(220, 150, 255, ${gA * 0.80})`;
        ctx.lineWidth   = 1.2;
        ctx.stroke();

        // Highlights
        ctx.fillStyle   = `rgba(255, 255, 255, ${gA * 0.95})`;
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(bX - ballR*0.33, bY - ballR*0.33, ballR * 0.19, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore(); // remove I-beam clip
        ctx.globalAlpha = 1;
      }
    }

    /* ── Figure (shape 3) ───────────────────────────────────── */
    if (figurePxRef.current.length > 0) {
      const DRIFT_MAX = 50;
      const isHov = hoveredRef.current === 2;
      for (const px of figurePxRef.current) {
        if (isHov) {
          if (px.alpha < 1) { px.alpha = Math.min(1, px.alpha+0.04); }
          else { px.dy -= px.speed; if (px.dy < -DRIFT_MAX) { px.dy=0; px.alpha=0; } }
        } else { px.alpha -= 0.03; }
        if (px.alpha <= 0) continue;
        ctx.globalAlpha = px.alpha * px.baseOpacity;
        ctx.beginPath();
        ctx.arc(px.bx, px.by+px.dy, Math.max(0.5,px.r), 0, Math.PI*2);
        if (px.filled) { ctx.fillStyle="#3ACFFF"; ctx.fill(); }
        else           { ctx.strokeStyle="#3ACFFF"; ctx.lineWidth=0.8; ctx.stroke(); }
      }
      if (!figureActiveRef.current) figurePxRef.current = figurePxRef.current.filter(p=>p.alpha>0);
    }

    ctx.globalAlpha = 1;

    const keepGlobe  = hoveredRef.current === 1 || globeAlphaRef.current > 0;
    const keepFigure = figurePxRef.current.length > 0;
    const keepEye    = hoveredRef.current === 3 || eyeAlphaRef.current > 0;
    if (particlesRef.current.length > 0 || hoveredRef.current === 0 || keepGlobe || keepFigure || keepEye) {
      rafRef.current = requestAnimationFrame(() => tickRef.current());
    } else {
      runningRef.current = false;
    }
  };

  const startLoop = useCallback(() => {
    if (!runningRef.current) {
      runningRef.current = true;
      rafRef.current = requestAnimationFrame(() => tickRef.current());
    }
  }, []);

  /* ── Shape triggers ─────────────────────────────────────────── */
  const triggerShape1 = useCallback(() => {
    const el = shapeRefs.current[0], cont = containerRef.current;
    if (!el || !cont) return;
    const cr=cont.getBoundingClientRect(), sr=el.getBoundingClientRect();
    const sx=sr.left-cr.left, sy=sr.top-cr.top, sw=sr.width, sh=sr.height;
    timersRef.current.forEach(clearTimeout); timersRef.current=[];
    const ROWS=18, COLS=14;
    for (let row=0; row<ROWS; row++) {
      const t = setTimeout(() => {
        for (let col=0; col<COLS; col++) {
          particlesRef.current.push({
            x: sx+(col/COLS)*sw+(Math.random()-0.5)*6, y: sy+(row/ROWS)*sh+(Math.random()-0.5)*6,
            vx:(Math.random()-0.5)*0.4, vy:(Math.random()-0.5)*0.4,
            life:0.9+Math.random()*0.1, size:Math.random()<0.6?3:2, color:"#3DFF6E",
          });
        }
      }, row*18);
      timersRef.current.push(t);
    }
    startLoop();
  }, [startLoop]);

  const triggerShape2 = useCallback(() => {
    timersRef.current.forEach(clearTimeout); timersRef.current=[];
    startLoop();
  }, [startLoop]);

  const triggerShape3 = useCallback(() => {
    const el = shapeRefs.current[2], cont = containerRef.current;
    if (!el || !cont) return;
    const cr=cont.getBoundingClientRect(), sr=el.getBoundingClientRect();
    const sx=sr.left-cr.left, sy=sr.top-cr.top, sw=sr.width, sh=sr.height;
    const scale=Math.min(sw/FIGURE_SRC_W, sh/FIGURE_SRC_H)*0.85;
    const originX=sx+(sw-FIGURE_SRC_W*scale)/2, originY=sy+(sh-FIGURE_SRC_H*scale)/2;
    figureActiveRef.current = true;
    figurePxRef.current = FIGURE_JSON.particles.map(p => ({
      bx: originX+p.x*scale, by: originY+p.y*scale,
      dy: -(Math.random()*60), alpha: 0,
      speed: 0.18+Math.random()*0.32, r: p.r*scale,
      baseOpacity: p.opacity, filled: p.type==="fill",
    }));
    startLoop();
  }, [startLoop]);

  const triggerShape4 = useCallback(() => {
    // Init ball at block centre so it doesn't snap from (0,0)
    const el4 = shapeRefs.current[3], cont = containerRef.current;
    if (el4 && cont) {
      const cr = cont.getBoundingClientRect(), sr = el4.getBoundingClientRect();
      eyePupilXRef.current = sr.left - cr.left + sr.width  / 2;
      eyePupilYRef.current = sr.top  - cr.top  + sr.height / 2;
    }
    startLoop();
  }, [startLoop]);

  const triggerSimple = useCallback((i: number) => {
    const el = shapeRefs.current[i], cont = containerRef.current;
    if (!el || !cont) return;
    const cr=cont.getBoundingClientRect(), sr=el.getBoundingClientRect();
    const cx=sr.left-cr.left+sr.width/2, cy=sr.top-cr.top+sr.height/2;
    burst(particlesRef.current, cx, cy, shapes[i].neon, 200, 1, 7, 0.85);
    startLoop();
  }, [startLoop]);

  const handleEnter = useCallback((i: number) => {
    setHovered(i);
    hoveredRef.current = i;
    emitFrameRef.current = 0;
    if (i !== 2) figureActiveRef.current = false;
    if      (i === 0) triggerShape1();
    else if (i === 1) triggerShape2();
    else if (i === 2) triggerShape3();
    else if (i === 3) triggerShape4();
    else              triggerSimple(i);
  }, [triggerShape1, triggerShape2, triggerShape3, triggerShape4, triggerSimple]);

  const handleLeave = useCallback(() => {
    setHovered(null);
    hoveredRef.current = null;
    figureActiveRef.current = false;
  }, []);

  /* ── Mouse move — globe velocity + eye cursor tracking ───────── */
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const cont = containerRef.current;
    if (!cont) return;
    const cr = cont.getBoundingClientRect();
    cursorCXRef.current = e.clientX - cr.left;
    cursorCYRef.current = e.clientY - cr.top;

    if (hoveredRef.current === 1) {
      const el = shapeRefs.current[1];
      if (el) {
        const sr = el.getBoundingClientRect();
        cursorVelRef.current = ((e.clientX - sr.left) / sr.width - 0.5) * 10;
      }
    }
  }, []);

  /* ── Canvas resize ──────────────────────────────────────────── */
  useEffect(() => {
    const cont=containerRef.current, canvas=canvasRef.current;
    if (!cont || !canvas) return;
    const sync = () => { canvas.width=cont.offsetWidth; canvas.height=cont.offsetHeight; };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(cont);
    return () => { ro.disconnect(); cancelAnimationFrame(rafRef.current); timersRef.current.forEach(clearTimeout); };
  }, []);

  return (
    <footer style={{ backgroundColor:"#060504", borderTop:"1px solid rgba(255,255,255,0.05)", overflow:"hidden", paddingLeft: 24, paddingRight: 24 }}>

      {/* CTA */}
      <div className="footer-cta flex items-center justify-between px-8 py-14"
        style={{ borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
        <div>
          <p style={{ fontFamily:"var(--font-space)", fontSize:"clamp(0.75rem, 1.2vw, 1rem)",
            color:"#3DFF6E", letterSpacing:"0.02em", marginBottom:"0.75rem", maxWidth:"420px" }}>
            Estou sempre aberta para conectar e falar sobre a vida e design.
          </p>
          <div style={{ display:"flex", flexDirection:"column", gap:"0.25rem" }}>
            <a href="https://www.linkedin.com/in/salautens/" target="_blank" rel="noopener noreferrer"
              style={{ fontFamily:"var(--font-space)", fontSize:"clamp(0.75rem, 1vw, 0.9rem)",
                color:"#7A7570", letterSpacing:"0.02em", textDecoration:"none" }}>
              linkedin.com/in/salautens
            </a>
            <a href="mailto:lautens.sa@gmail.com" style={{ fontFamily:"var(--font-space)",
              fontSize:"clamp(1rem, 2vw, 1.5rem)", color:"#F2EDE8", letterSpacing:"0.02em" }}>
              lautens.sa@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* Shapes + Canvas */}
      <div ref={containerRef} onMouseMove={handleMouseMove}
        style={{ position:"relative", padding:"0 1.5rem" }}>
        <canvas ref={canvasRef}
          style={{ position:"absolute", inset:0, zIndex:20, pointerEvents:"none" }} />

        <div className="footer-shapes flex items-end justify-center gap-3" style={{ height:"380px" }}>
          {shapes.map((shape, i) => (
            <motion.div
              key={shape.id}
              ref={(el) => { shapeRefs.current[i] = el; }}
              style={{ width:widths[i], height:heights[i], position:"relative", flexShrink:0, zIndex:10 }}
              animate={{ y: hovered===i ? -20 : 0 }}
              transition={{ duration:0.4, ease:[0.25,0,0,1] }}
              onMouseEnter={() => handleEnter(i)}
              onMouseLeave={handleLeave}
            >
              {shape.arch ? (
                <div style={{ width:"100%", height:"100%", position:"relative" }}>
                  <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)",
                    width:"28%", paddingBottom:"28%", backgroundColor:"#1A1815", borderRadius:"50%", zIndex:2 }} />
                  <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"94%",
                    backgroundColor:"#1A1815", borderRadius:"50% 50% 0 0 / 20% 20% 0 0" }} />
                </div>
              ) : (
                <div style={{ ...shape.style, position:"absolute", inset:0,
                  clipPath:(shape.style as { clipPath?: string }).clipPath }} />
              )}

              {/* Neon edge glow — skip shapes 1–4 */}
              {i !== 0 && i !== 1 && i !== 2 && i !== 3 && (
                <motion.div style={{ position:"absolute", inset:0, zIndex:3, pointerEvents:"none",
                  boxShadow:`0 0 0 1px ${shape.neon}`,
                  clipPath:(shape.style as { clipPath?: string }).clipPath }}
                  animate={{ opacity: hovered===i ? 0.7 : 0 }}
                  transition={{ duration:0.15 }} />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom flex items-center justify-between px-8 py-5"
        style={{ borderTop:"1px solid rgba(255,255,255,0.05)" }}>
        <span style={{ fontFamily:"var(--font-space)", fontSize:"0.55rem", letterSpacing:"0.3em",
          color:"rgba(255,255,255,0.2)", textTransform:"uppercase" }}>São Paulo, Brasil</span>
        <span style={{ fontFamily:"var(--font-space)", fontSize:"0.55rem", letterSpacing:"0.3em",
          color:"rgba(255,255,255,0.2)", textTransform:"uppercase" }}>© 2025 SA-BRINA</span>
        <div className="footer-social flex gap-8">
          {["LinkedIn","Behance","Dribbble"].map(s => (
            <a key={s} href="#" style={{ fontFamily:"var(--font-space)", fontSize:"0.55rem",
              letterSpacing:"0.25em", color:"rgba(255,255,255,0.2)", textTransform:"uppercase" }}>{s}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}
