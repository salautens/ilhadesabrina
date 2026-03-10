"use client";

import { useRef, useState, useEffect } from "react";

type VisionMode = "dark" | "light" | "deuteranopia" | "protanopia" | "tritanopia" | "achromatopsia";

const FILTERS: Record<VisionMode, string> = {
  dark: "",
  light: "invert(1) grayscale(0.92)",
  deuteranopia: "url(#cb-deuteranopia)",
  protanopia: "url(#cb-protanopia)",
  tritanopia: "url(#cb-tritanopia)",
  achromatopsia: "url(#cb-achromatopsia)",
};

/* ── Vision modes catalogue ────────────────────────────────────── */
const MODES: {
  id: VisionMode;
  label: string;
  sub: string;
  swatches: string[];
}[] = [
  {
    id: "dark",
    label: "Dark",
    sub: "Padrão",
    swatches: ["#0A0908", "#3DFF6E", "#F2EDE8", "#C17F3A"],
  },
  {
    id: "light",
    label: "Light",
    sub: "Cinza minimalista",
    swatches: ["#F0F0EE", "#4A4A4A", "#1A1A19", "#888884"],
  },
  {
    id: "deuteranopia",
    label: "Deuteranopia",
    sub: "Cegueira ao verde",
    swatches: ["#0A0908", "#B8A800", "#F2EDE8", "#0076C0"],
  },
  {
    id: "protanopia",
    label: "Protanopia",
    sub: "Cegueira ao vermelho",
    swatches: ["#0A0908", "#9DBF00", "#F2EDE8", "#0070B8"],
  },
  {
    id: "tritanopia",
    label: "Tritanopia",
    sub: "Cegueira ao azul",
    swatches: ["#0A0908", "#3DFF6E", "#F2EDE8", "#FF6B6B"],
  },
  {
    id: "achromatopsia",
    label: "Acromatopsia",
    sub: "Sem cor",
    swatches: ["#1A1A1A", "#B0B0B0", "#F0F0F0", "#707070"],
  },
];

/* ── Pixel eye icon — 14×8 grid ────────────────────────────────── */
function PixelEye({ color = "#7A7570" }: { color?: string }) {
  const grid = [
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
    [0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0],
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0],
    [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  ];
  const s = 2;
  return (
    <svg
      width={14 * s}
      height={8 * s}
      viewBox={`0 0 ${14 * s} ${8 * s}`}
      style={{ display: "block", imageRendering: "pixelated" }}
    >
      {grid.map((row, y) =>
        row.map((px, x) =>
          px ? (
            <rect
              key={`${x}-${y}`}
              x={x * s}
              y={y * s}
              width={s}
              height={s}
              fill={color}
            />
          ) : null
        )
      )}
    </svg>
  );
}

/* ── VisionSwitcher — self-contained, no context dependency ────── */
export default function VisionSwitcher() {
  const [mode, setModeState] = useState<VisionMode>("dark");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Read localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("sa-vision") as VisionMode | null;
    if (stored && stored in FILTERS) setModeState(stored);
  }, []);

  // Apply filter to html whenever mode changes
  useEffect(() => {
    document.documentElement.style.filter = FILTERS[mode];
  }, [mode]);

  const setMode = (m: VisionMode) => {
    setModeState(m);
    localStorage.setItem("sa-vision", m);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* Eye button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Modo visual de acessibilidade"
        style={{
          cursor: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 36,
          height: 36,
          border: `1px solid ${open ? "rgba(61,255,110,0.5)" : "rgba(255,255,255,0.07)"}`,
          backgroundColor: open ? "rgba(61,255,110,0.06)" : "transparent",
          transition: "border-color 0.2s, background-color 0.2s",
        }}
      >
        <PixelEye color={open ? "#3DFF6E" : "#7A7570"} />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            minWidth: 272,
            backgroundColor: "rgba(10,9,8,0.97)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(20px)",
            zIndex: 200,
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "0.9rem 1.1rem 0.7rem",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-space)",
                fontSize: "0.42rem",
                letterSpacing: "0.4em",
                color: "#7A7570",
                textTransform: "uppercase",
              }}
            >
              Modo Visual · Acessibilidade
            </span>
          </div>

          {/* Mode list */}
          {MODES.map(({ id, label, sub, swatches }) => {
            const active = mode === id;
            return (
              <button
                key={id}
                onClick={() => {
                  setMode(id);
                  setOpen(false);
                }}
                style={{
                  cursor: "none",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.85rem",
                  padding: "0.7rem 1.1rem",
                  backgroundColor: active
                    ? "rgba(61,255,110,0.07)"
                    : "transparent",
                  borderLeft: `2px solid ${active ? "#3DFF6E" : "transparent"}`,
                  transition: "background-color 0.15s",
                }}
              >
                {/* Swatch row */}
                <div
                  style={{
                    display: "flex",
                    gap: 2,
                    flexShrink: 0,
                    border: "1px solid rgba(255,255,255,0.08)",
                    padding: 2,
                  }}
                >
                  {swatches.map((s, i) => (
                    <div
                      key={i}
                      style={{
                        width: 9,
                        height: 9,
                        backgroundColor: s,
                      }}
                    />
                  ))}
                </div>

                {/* Label + sub */}
                <div style={{ textAlign: "left", flex: 1 }}>
                  <p
                    style={{
                      fontFamily: "var(--font-space)",
                      fontSize: "0.58rem",
                      letterSpacing: "0.08em",
                      color: active ? "#3DFF6E" : "#F2EDE8",
                      fontWeight: active ? 600 : 400,
                    }}
                  >
                    {label}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-space)",
                      fontSize: "0.44rem",
                      letterSpacing: "0.06em",
                      color: "#7A7570",
                      marginTop: "2px",
                    }}
                  >
                    {sub}
                  </p>
                </div>

                {active && (
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      backgroundColor: "#3DFF6E",
                      flexShrink: 0,
                    }}
                  />
                )}
              </button>
            );
          })}

          {/* Footer */}
          <div
            style={{
              padding: "0.65rem 1.1rem",
              borderTop: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-space)",
                fontSize: "0.4rem",
                letterSpacing: "0.06em",
                color: "#4A4743",
                lineHeight: 1.7,
              }}
            >
              Simulação de visão para acessibilidade.
              <br />
              Light mode usa escala de cinza minimalista.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
