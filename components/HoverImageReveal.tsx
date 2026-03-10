"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const IMAGES = [
  "/so5/so5-cover.png",
  "/folheteria-cover.png",
  "/so5/so5-cover.png",
  "/folheteria-cover.png",
];

interface FloatImg {
  id: number;
  x: number;
  y: number;
  rot: number;
  src: string;
  w: number;
  h: number;
}

const SIZES = [
  { w: 280, h: 190 },
  { w: 220, h: 300 },
  { w: 320, h: 210 },
  { w: 240, h: 320 },
];

let uid = 0;

export default function HoverImageReveal() {
  const [imgs, setImgs] = useState<FloatImg[]>([]);
  const [visible, setVisible] = useState(false);
  const lastFired = useRef(0);
  const lastPos = useRef({ x: -999, y: -999 });
  const imgIdx = useRef(0);

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const now = Date.now();
    if (now - lastFired.current < 220) return;

    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    if (Math.sqrt(dx * dx + dy * dy) < 50) return;

    lastFired.current = now;
    lastPos.current = { x: e.clientX, y: e.clientY };

    const rect = e.currentTarget.getBoundingClientRect();
    const i = imgIdx.current % SIZES.length;
    const { w, h } = SIZES[i];
    const src = IMAGES[imgIdx.current % IMAGES.length];
    imgIdx.current++;

    const id = ++uid;
    const x = e.clientX - rect.left - w / 2 + (Math.random() - 0.5) * 60;
    const y = e.clientY - rect.top  - h / 2 + (Math.random() - 0.5) * 40;
    const rot = (Math.random() - 0.5) * 12;

    // Keep last 5 images, no auto-removal
    setImgs(prev => [...prev.slice(-4), { id, x, y, rot, src, w, h }]);
  }, []);

  const handleEnter = useCallback(() => setVisible(true), []);

  const handleLeave = useCallback(() => {
    setVisible(false);
    // Clear images after fade out completes
    setTimeout(() => setImgs([]), 600);
  }, []);

  return (
    <div
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{ position: "absolute", inset: 0, zIndex: 4 }}
    >
      <AnimatePresence>
        {visible && imgs.map((img) => (
          <motion.div
            key={img.id}
            style={{
              position: "absolute",
              left: img.x,
              top: img.y,
              width: img.w,
              height: img.h,
              rotate: img.rot,
              overflow: "hidden",
              pointerEvents: "none",
              willChange: "transform, opacity",
            }}
            initial={{ clipPath: "inset(100% 0% 0% 0%)", scale: 0.96, opacity: 1 }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)", scale: 1, opacity: 1 }}
            exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.5, ease: "easeOut" } }}
            transition={{
              clipPath: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
              scale:    { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
            }}
          >
            <Image
              src={img.src}
              alt=""
              fill
              className="object-cover object-top"
              sizes={`${img.w}px`}
              priority={false}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
