"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRef, useState, useCallback } from "react";
import ChipTrail from "@/components/ChipTrail";
import GlitchTitle from "@/components/GlitchTitle";
import HalftoneCanvas from "@/components/HalftoneCanvas";

/* ─── Section label — consistent anatomy across all sections ─── */
function SectionLabel({ n, text }: { n: string; text: string }) {
  return (
    <div className="flex items-center gap-5 mb-14">
      <span
        style={{
          fontFamily: "var(--font-space)",
          fontSize: "0.6rem",
          letterSpacing: "0.3em",
          color: "#3DFF6E",
          textTransform: "uppercase",
          fontWeight: 600,
        }}
      >
        {n}
      </span>
      <div style={{ flex: 1, height: "1px", backgroundColor: "rgba(255,255,255,0.14)" }} />
      <span
        style={{
          fontFamily: "var(--font-space)",
          fontSize: "0.55rem",
          letterSpacing: "0.35em",
          color: "#B8B3AE",
          textTransform: "uppercase",
        }}
      >
        {text}
      </span>
    </div>
  );
}

/* ─── Scroll-driven marquee with bitmap hover glitch ─── */
const GLITCH_FRAMES = 4;
const GLITCH_MS = 90;

function ScrollMarquee({ text, direction = 1 }: { text: string; direction?: 1 | -1 }) {
  const ref = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isBitmap, setIsBitmap] = useState(false);
  const [glitchOffset, setGlitchOffset] = useState({ x: 0, y: 0 });
  const [glitchOpacity, setGlitchOpacity] = useState(1);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    direction === 1 ? ["-5%", "-40%"] : ["-40%", "-5%"]
  );

  const runGlitch = useCallback((endBitmap: boolean) => {
    if (timerRef.current) clearInterval(timerRef.current);
    let frame = 0;
    timerRef.current = setInterval(() => {
      const even = frame % 2 === 0;
      setIsBitmap(even ? !endBitmap : endBitmap);
      setGlitchOffset({
        x: even ? (Math.random() - 0.5) * 6 : 0,
        y: even ? (Math.random() - 0.5) * 2 : 0,
      });
      setGlitchOpacity(even ? 0.85 + Math.random() * 0.15 : 1);
      frame++;
      if (frame >= GLITCH_FRAMES) {
        clearInterval(timerRef.current!);
        setIsBitmap(endBitmap);
        setGlitchOffset({ x: 0, y: 0 });
        setGlitchOpacity(1);
      }
    }, GLITCH_MS);
  }, []);

  const repeated = Array(6).fill(text).join("  ·  ");

  return (
    <div
      ref={ref}
      style={{ overflow: "hidden", lineHeight: 0.9 }}
      onMouseEnter={() => runGlitch(true)}
      onMouseLeave={() => runGlitch(false)}
    >
      <motion.p
        style={{
          x,
          fontFamily: isBitmap ? "var(--font-bitmap)" : "var(--font-space)",
          fontSize: isBitmap
            ? "clamp(1rem, 2.2vw, 2.8rem)"
            : "clamp(3rem, 6vw, 7.5rem)",
          fontWeight: isBitmap ? 400 : 700,
          letterSpacing: isBitmap ? "0.04em" : "-0.02em",
          color: "#F2EDE8",
          whiteSpace: "nowrap",
          willChange: "transform",
          lineHeight: isBitmap ? 1.4 : 0.9,
          transform: `translate(${glitchOffset.x}px, ${glitchOffset.y}px)`,
          opacity: glitchOpacity,
          transition: "font-size 0s, line-height 0s, font-family 0s",
        }}
      >
        {repeated}
      </motion.p>
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.25, 0, 0, 1] as const },
  }),
};

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  return (
    <main ref={containerRef} className="min-h-screen" style={{ backgroundColor: "#0A0908" }}>

      <ChipTrail containerRef={heroRef} />

      {/* ══ 01 · HERO — flat-e grid composition ════════════════════ */}
      <section
        ref={heroRef}
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          padding: "6rem clamp(1.5rem, 4vw, 3rem) 4rem",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          overflow: "hidden",
        }}
      >
        {/* Halftone dither */}
        <HalftoneCanvas opacity={0.38} />


        {/* Subtle column grid overlay */}
        <div className="absolute inset-0 grid grid-cols-12 pointer-events-none">
          {Array.from({ length: 11 }).map((_, i) => (
            <div key={i} style={{ borderRight: "1px solid rgba(255,255,255,0.025)" }} />
          ))}
        </div>

        {/* spacer so title centers in remaining height */}
        <div style={{ flex: "0 0 0" }} />

        {/* ── MIDDLE: GIANT TITLE — vertically centered ── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            position: "relative",
            zIndex: 10,
            padding: "2rem 0",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0, 0, 1] }}
            style={{ width: "100%" }}
          >
            <GlitchTitle />
          </motion.div>
        </div>

        {/* ── BOTTOM ROW: tagline left + CTA right ── */}
        <motion.div
          style={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: "2rem",
            flexWrap: "wrap",
          }}
          variants={fadeUp}
          custom={5}
          initial="hidden"
          animate="show"
        >
          {/* Tagline — large, flat-e scale */}
          <p
            style={{
              fontFamily: "var(--font-geist)",
              fontSize: "clamp(1.6rem, 3.2vw, 3.8rem)",
              fontWeight: 300,
              color: "#B8B3AE",
              lineHeight: 1.15,
              maxWidth: "820px",
            }}
          >
            Design que{" "}
            <span style={{ color: "#F2EDE8", fontWeight: 400 }}>
              &#123;transforma caos em calma&#125;
            </span>{" "}
            operacional.{" "}
            <span style={{ color: "#7A7570" }}>
              Produtos para humanos que operam em escala.
            </span>
          </p>

          {/* Scroll pulse */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexShrink: 0 }}>
            <motion.div
              style={{ width: 1, height: 28, backgroundColor: "#3DFF6E", transformOrigin: "top" }}
              animate={{ scaleY: [1, 0.25, 1] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            />
            <span
              style={{
                fontFamily: "var(--font-space)",
                fontSize: "0.5rem",
                letterSpacing: "0.4em",
                color: "#F2EDE8",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              Scroll
            </span>
          </div>
        </motion.div>
      </section>

      {/* ══ 02 · STATEMENT MARQUEE ══════════════════════════════════ */}
      <section
        className="overflow-hidden"
        style={{
          paddingTop: "5rem",
          paddingBottom: "0",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <ScrollMarquee text="UX IS NOT DECORATION" direction={1} />
        <div style={{ height: "2px", backgroundColor: "rgba(61,255,110,0.15)", margin: "0.5rem 0" }} />
        <ScrollMarquee text="70% PSYCHOLOGY · 30% DESIGN" direction={-1} />
        <div style={{ height: "5rem" }} />
      </section>

      {/* ══ 03 · FIGMA → CLAUDE ══════════════════════════════════════ */}
      <section
        className="section-px"
        style={{
          padding: "6rem clamp(1.5rem, 4vw, 3rem)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div
          className="grid-figma"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            gap: "3rem",
            alignItems: "center",
          }}
        >
          {/* Figma */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.25, 0, 0, 1] }}
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              padding: "2.5rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1.5rem",
              backgroundColor: "rgba(255,255,255,0.02)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/figma-icon.png" alt="Figma" style={{ width: 80, height: 80, objectFit: "contain" }} />
            <div style={{ textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-space)", fontSize: "0.9rem", fontWeight: 600, color: "#F2EDE8", letterSpacing: "0.05em" }}>Figma</p>
              <p style={{ fontFamily: "var(--font-space)", fontSize: "0.48rem", letterSpacing: "0.3em", color: "#7A7570", textTransform: "uppercase", marginTop: "0.4rem" }}>Design System · Protótipo · Handoff</p>
            </div>
          </motion.div>

          {/* Arrow */}
          <motion.div
            className="arrow-col"
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <motion.div style={{ height: 1, backgroundColor: "#3DFF6E", width: "4rem" }} animate={{ scaleX: [0.6, 1, 0.6] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }} />
            <motion.span style={{ fontFamily: "var(--font-space)", fontSize: "1.2rem", color: "#3DFF6E" }} animate={{ x: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}>→</motion.span>
            <motion.div style={{ height: 1, backgroundColor: "#3DFF6E", width: "4rem" }} animate={{ scaleX: [1, 0.6, 1] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }} />
          </motion.div>

          {/* Claude Code */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.25, 0, 0, 1] }}
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              padding: "2.5rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1.5rem",
              backgroundColor: "rgba(255,255,255,0.02)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/claude-code-icon.png" alt="Claude Code" style={{ width: 160, height: 80, objectFit: "contain", mixBlendMode: "screen" }} />
            <div style={{ textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-space)", fontSize: "0.9rem", fontWeight: 600, color: "#F2EDE8", letterSpacing: "0.05em" }}>Claude Code</p>
              <p style={{ fontFamily: "var(--font-space)", fontSize: "0.48rem", letterSpacing: "0.3em", color: "#7A7570", textTransform: "uppercase", marginTop: "0.4rem" }}>Claude Code · Anthropic</p>
            </div>
          </motion.div>
        </div>

        <motion.p
          style={{
            fontFamily: "var(--font-space)",
            fontSize: "clamp(1.6rem, 3.2vw, 4rem)",
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            color: "#F2EDE8",
            marginTop: "3rem",
            maxWidth: "100%",
          }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0, 0, 1] }}
        >
          Do <span style={{ color: "#B8B3AE" }}>Figma</span> ao{" "}
          <span style={{ color: "#3DFF6E" }}>Claude Code</span>{" "}
          não uma substituição,{" "}
          <span style={{ color: "#7A7570" }}>mas uma coevolução.</span>
        </motion.p>
      </section>

      {/* ══ 04 · CLIENTS ════════════════════════════════════════════ */}
      <section
        style={{
          padding: "6rem clamp(1.5rem, 4vw, 3rem)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div
          className="grid-clients"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "2rem",
            alignItems: "center",
          }}
        >
          {[
            { src: "/logos/bancodobrasil.png", alt: "Banco do Brasil" },
            { src: "/logos/carrefour.svg", alt: "Carrefour" },
            { src: "/logos/equifax.svg", alt: "Equifax" },
            { src: "/logos/nuclea.svg", alt: "Nuclea" },
            { src: "/logos/cip.svg", alt: "CIP" },
            { src: "/logos/yeb.svg", alt: "YEB" },
            { src: "/logos/sapore.png", alt: "Sapore" },
          ].map((logo, i) => (
            <motion.div
              key={logo.alt}
              className="flex items-center justify-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={180}
                height={70}
                className="object-contain transition-all duration-500"
                style={{ maxHeight: "56px", width: "auto", filter: "brightness(0) invert(1)", opacity: 0.35 }}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══ 05 · SELECTED WORK ══════════════════════════════════════ */}
      <section
        style={{
          padding: "6rem clamp(1.5rem, 4vw, 3rem)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <SectionLabel n="05" text="Projetos" />

        {/* Asymmetric editorial grid: 62fr / 38fr */}
        <div
          className="grid-work"
          style={{
            display: "grid",
            gridTemplateColumns: "62fr 38fr",
            gap: "1.5rem",
          }}
        >
          {/* Card 01 — dominant */}
          {[
            {
              index: "01",
              href: "/work/so5",
              tag: "Product Design · YEB",
              title: "SO5 Intelligence Hub",
              desc: "From green screen to design system. A legacy commodity trading platform rebuilt end-to-end.",
              year: "2024",
              img: "/so5/so5-cover.png",
              accent: "#3DFF6E",
              ratio: "16/9",
            },
            {
              index: "02",
              href: "https://www.behance.net/gallery/160092813/Folheteria-Digital",
              tag: "Digital Publishing · Carrefour",
              title: "Folheteria Digital",
              desc: "Transformando folhetos impressos em um sistema dinâmico de publicação digital em escala.",
              year: "2023",
              img: "/folheteria-cover.png",
              accent: "#FF3FA8",
              ratio: "4/5",
            },
          ].map((card, i) => (
            <motion.div
              key={card.index}
              className={i === 1 ? "work-card-offset" : ""}
              style={{ marginTop: i === 1 ? "clamp(3rem, 6vw, 7rem)" : 0 }}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.14, duration: 0.7, ease: [0.25, 0, 0, 1] as const }}
            >
              <a href={card.href} target={card.href.startsWith("http") ? "_blank" : "_self"} rel="noopener noreferrer" style={{ cursor: "none", display: "block", textDecoration: "none" }}>
                <motion.div
                  style={{ overflow: "hidden", borderRadius: 0 }}
                  whileHover={{ borderRadius: "28px" }}
                  transition={{ duration: 0.5, ease: [0.25, 0, 0, 1] }}
                >
                  {/* Image / placeholder */}
                  <div
                    style={{
                      width: "100%",
                      aspectRatio: card.ratio,
                      backgroundColor: "#141210",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    {card.img ? (
                      <Image src={card.img} alt={card.title} fill className="object-cover object-top" />
                    ) : (
                      /* Placeholder with stripe texture */
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: `
                            repeating-linear-gradient(
                              -45deg,
                              transparent,
                              transparent 28px,
                              ${card.accent}09 28px,
                              ${card.accent}09 29px
                            )`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "var(--font-space)",
                            fontSize: "0.5rem",
                            letterSpacing: "0.45em",
                            color: card.accent + "70",
                            textTransform: "uppercase",
                          }}
                        >
                          Em breve
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Caption */}
                  <div
                    style={{
                      backgroundColor: card.accent + "18",
                      padding: "1.75rem",
                      borderTop: "1px solid " + card.accent + "40",
                    }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        style={{
                          fontFamily: "var(--font-space)",
                          fontSize: "0.5rem",
                          letterSpacing: "0.2em",
                          color: card.accent,
                          border: "1px solid " + card.accent + "65",
                          borderRadius: "99px",
                          padding: "4px 12px",
                          textTransform: "uppercase",
                        }}
                      >
                        {card.tag}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-space)",
                          fontSize: "0.5rem",
                          letterSpacing: "0.3em",
                          color: "#7A7570",
                          textTransform: "uppercase",
                        }}
                      >
                        {card.year}
                      </span>
                    </div>
                    <h3
                      style={{
                        fontFamily: "var(--font-space)",
                        fontSize: "clamp(1.2rem, 2vw, 1.8rem)",
                        fontWeight: 700,
                        color: "#F2EDE8",
                        lineHeight: 1.15,
                        marginBottom: "0.75rem",
                      }}
                    >
                      {card.title}
                    </h3>
                    <p style={{ fontSize: "0.88rem", color: "#B8B3AE", lineHeight: 1.7, fontFamily: "var(--font-geist)" }}>
                      {card.desc}
                    </p>
                  </div>
                </motion.div>
              </a>
            </motion.div>
          ))}
        </div>

        {/* All projects link */}
        <motion.div
          className="flex justify-end mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link href="/work">
            <span
              style={{
                fontFamily: "var(--font-space)",
                fontSize: "0.58rem",
                letterSpacing: "0.3em",
                color: "#F2EDE8",
                textTransform: "uppercase",
              }}
            >
              Todos os Projetos →
            </span>
          </Link>
        </motion.div>
      </section>

    </main>
  );
}
