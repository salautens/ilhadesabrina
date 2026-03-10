"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type VisionMode =
  | "dark"
  | "light"
  | "deuteranopia"
  | "protanopia"
  | "tritanopia"
  | "achromatopsia";

export const FILTERS: Record<VisionMode, string> = {
  dark: "",
  light: "invert(1) grayscale(0.92)",
  deuteranopia: "url(#cb-deuteranopia)",
  protanopia: "url(#cb-protanopia)",
  tritanopia: "url(#cb-tritanopia)",
  achromatopsia: "url(#cb-achromatopsia)",
};

interface VisionCtx {
  mode: VisionMode;
  setMode: (m: VisionMode) => void;
}

const Ctx = createContext<VisionCtx>({ mode: "dark", setMode: () => {} });

export function VisionProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<VisionMode>("dark");

  // Read localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("sa-vision") as VisionMode | null;
    if (stored && stored in FILTERS) setModeState(stored);
  }, []);

  // Apply filter whenever mode changes
  useEffect(() => {
    document.documentElement.style.filter = FILTERS[mode];
    document.documentElement.setAttribute("data-vision", mode);
  }, [mode]);

  const setMode = (m: VisionMode) => {
    setModeState(m);
    localStorage.setItem("sa-vision", m);
  };

  return <Ctx.Provider value={{ mode, setMode }}>{children}</Ctx.Provider>;
}

export const useVision = () => useContext(Ctx);
