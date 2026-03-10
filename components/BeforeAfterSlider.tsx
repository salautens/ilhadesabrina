"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = "Antes (Legado)",
  afterLabel = "Depois (SO5)",
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (event: React.MouseEvent | React.TouchEvent) => {
    if (!isResizing || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = "touches" in event ? event.touches[0].clientX : event.clientX;
    const position = ((x - rect.left) / rect.width) * 100;

    if (position >= 0 && position <= 100) {
      setSliderPosition(position);
    }
  };

  const handleMouseDown = () => setIsResizing(true);
  const handleMouseUp = () => setIsResizing(false);

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video overflow-hidden cursor-col-resize select-none"
      onMouseMove={handleMove}
      onTouchMove={handleMove}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
    >
      {/* After Image (Primary) */}
      <Image
        src={afterImage}
        alt="After"
        fill
        className="object-cover"
        priority
      />

      {/* Before Image (Overlay) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <Image
          src={beforeImage}
          alt="Before"
          fill
          className="object-cover"
          style={{ objectPosition: "left" }}
        />
      </div>

      {/* Slider Line */}
      <div
        className="absolute inset-y-0 z-10 w-1 bg-white shadow-[0_0_15px_rgba(0,0,0,0.5)]"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-[#3DFF6E]">
          <div className="flex gap-1">
            <div className="w-1 h-3 bg-black/20 rounded-full" />
            <div className="w-1 h-3 bg-black/20 rounded-full" />
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute bottom-6 left-6 z-20 pointer-events-none">
        <span className="bg-black/60 backdrop-blur-md px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-bold text-white border border-white/20">
          {beforeLabel}
        </span>
      </div>
      <div className="absolute bottom-6 right-6 z-20 pointer-events-none">
        <span className="bg-[#3DFF6E]/90 px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-bold text-black shadow-lg">
          {afterLabel}
        </span>
      </div>
    </div>
  );
}
