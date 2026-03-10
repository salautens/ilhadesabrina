"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Hotspot {
    x: number; // percentage
    y: number; // percentage
    title: string;
    description: string;
}

interface InteractiveHotspotsProps {
    children: React.ReactNode;
    hotspots: Hotspot[];
}

export default function InteractiveHotspots({ children, hotspots }: InteractiveHotspotsProps) {
    const [activeHotspot, setActiveHotspot] = useState<number | null>(null);

    return (
        <div className="relative w-full overflow-hidden group">
            {children}

            {hotspots.map((spot, i) => (
                <div
                    key={i}
                    className="absolute z-20"
                    style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                >
                    {/* Pulsing Dot */}
                    <button
                        onClick={() => setActiveHotspot(activeHotspot === i ? null : i)}
                        onMouseEnter={() => setActiveHotspot(i)}
                        onMouseLeave={() => setActiveHotspot(null)}
                        className="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2 w-8 h-8 focus:outline-none"
                    >
                        <span className="absolute inline-flex h-full w-full rounded-full bg-[#3DFF6E] opacity-40 animate-ping" />
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-[#3DFF6E] border-2 border-white shadow-lg" />
                    </button>

                    {/* Tooltip */}
                    <AnimatePresence>
                        {activeHotspot === i && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                className={`absolute z-30 bottom-12 ${spot.x > 80 ? 'right-0' : spot.x < 20 ? 'left-0' : 'left-1/2 -translate-x-1/2'} w-72 p-5 bg-[#0D0C0B]/80 backdrop-blur-2xl border border-white/10 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)] pointer-events-none rounded-sm`}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#3DFF6E]" />
                                    <h4 className="font-bold text-[#F2EDE8] text-[11px] uppercase tracking-[0.25em] font-space italic">
                                        {spot.title}
                                    </h4>
                                </div>
                                <p className="text-[13px] text-[#B8B3AE] leading-relaxed font-geist font-light">
                                    {spot.description}
                                </p>

                                {/* Arrow (only if not at edges) */}
                                {spot.x >= 20 && spot.x <= 80 && (
                                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white/10" />
                                )}
                                <div className={`absolute -bottom-[7px] ${spot.x > 80 ? 'right-4' : spot.x < 20 ? 'left-4' : 'left-1/2 -translate-x-1/2'} w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#0D0C0B]/80`} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>
    );
}
