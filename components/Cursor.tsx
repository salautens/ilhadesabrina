"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function Cursor() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 16);
      mouseY.set(e.clientY - 16);
      dotX.set(e.clientX - 3);
      dotY.set(e.clientY - 3);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseX, mouseY, dotX, dotY]);

  return (
    <>
      {/* Outer square — Cybertruck geometry */}
      <motion.div
        style={{
          x,
          y,
          position: "fixed",
          top: 0,
          left: 0,
          width: 32,
          height: 32,
          border: "1px solid #C17F3A",
          pointerEvents: "none",
          zIndex: 9999,
        }}
      />
      {/* Inner dot */}
      <motion.div
        style={{
          x: dotX,
          y: dotY,
          position: "fixed",
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          backgroundColor: "#C17F3A",
          pointerEvents: "none",
          zIndex: 9999,
        }}
      />
    </>
  );
}
