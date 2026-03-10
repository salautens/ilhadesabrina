"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WORDS = [
  "Product Design",
  "UX",
  "Digital",
  "Systems",
  "Research",
  "Human Behaviour",
  "Flow",
  "Strategy",
  "Enterprise",
  "Calm",
  "Psychology",
  "Data",
  "A → Z",
];

const PALETTE = [
  { bg: "#3DFF6E", text: "#0A0908" },   // neon green
  { bg: "#F5E040", text: "#0A0908" },   // neon yellow
  { bg: "#3ACFFF", text: "#0A0908" },   // neon blue
  { bg: "#C04DFF", text: "#F2EDE8" },   // neon purple
  { bg: "#FF3FA8", text: "#F2EDE8" },   // neon pink
  { bg: "#C17F3A", text: "#F2EDE8" },   // amber
  { bg: "#F2EDE8", text: "#0A0908" },   // warm white
];

type Chip = {
  id: number;
  x: number;
  y: number;
  word: string;
  bg: string;
  text: string;
  drift: number;
};

interface Props {
  containerRef: React.RefObject<HTMLElement | null>;
}

export default function ChipTrail({ containerRef }: Props) {
  const [chips, setChips] = useState<Chip[]>([]);
  const lastPos = useRef({ x: 0, y: 0 });
  const counter = useRef(0);
  const active = useRef(false);

  const spawnChip = useCallback((x: number, y: number) => {
    const id = counter.current++;
    const idx = id % WORDS.length;
    const color = PALETTE[id % PALETTE.length];
    const drift = (Math.random() - 0.5) * 40;

    const chip: Chip = {
      id,
      x: x + (Math.random() - 0.5) * 12,
      y: y + (Math.random() - 0.5) * 12,
      word: WORDS[idx],
      bg: color.bg,
      text: color.text,
      drift,
    };

    setChips((prev) => [...prev.slice(-14), chip]);

    setTimeout(() => {
      setChips((prev) => prev.filter((c) => c.id !== chip.id));
    }, 1800);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onEnter = () => { active.current = true; };
    const onLeave = () => { active.current = false; };

    const onMove = (e: MouseEvent) => {
      if (!active.current) return;
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      if (Math.sqrt(dx * dx + dy * dy) < 55) return;
      lastPos.current = { x: e.clientX, y: e.clientY };
      spawnChip(e.clientX, e.clientY);
    };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    window.addEventListener("mousemove", onMove);

    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mousemove", onMove);
    };
  }, [containerRef, spawnChip]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 200,
      }}
    >
      <AnimatePresence>
        {chips.map((chip) => (
          <motion.div
            key={chip.id}
            style={{
              position: "absolute",
              left: chip.x,
              top: chip.y,
              x: "-50%",
              y: "-50%",
              backgroundColor: chip.bg,
              color: chip.text,
              padding: "5px 14px",
              borderRadius: "99px",
              fontFamily: "var(--font-space)",
              fontSize: "0.6rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              lineHeight: 1,
            }}
            initial={{ opacity: 0, scale: 0.5, y: "-50%" }}
            animate={{ opacity: 1, scale: 1, y: `calc(-50% + ${chip.drift}px)` }}
            exit={{ opacity: 0, scale: 0.7, y: `calc(-50% + ${chip.drift - 24}px)` }}
            transition={{ duration: 0.35, ease: [0.25, 0, 0, 1] }}
          >
            {chip.word}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
