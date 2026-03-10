"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import InteractiveHotspots from "@/components/InteractiveHotspots";

const pillars = [
  {
    num: "01",
    title: "Information Architecture",
    desc: "Reorganized panel structure with clear hierarchy, logical grouping, and context-aware navigation patterns.",
  },
  {
    num: "02",
    title: "Simplified Flows",
    desc: "Mapped and streamlined critical user journeys including order management, position tracking, and market data visualization.",
  },
  {
    num: "03",
    title: "Component Library",
    desc: "Modular components built with shadcn/ui as foundation, consistent implementation across the entire platform.",
  },
  {
    num: "04",
    title: "Onboarding System",
    desc: "Structured first-use experience that reduces dependency on human training and accelerates time-to-productivity.",
  },
  {
    num: "05",
    title: "Iterative Validation",
    desc: "Continuous testing cycles with real users, documented learnings, and prototype-driven refinement throughout.",
  },
];

const screens = [
  {
    src: "/so5/dashboard-commodities.png",
    title: "Base de Dados — Commodities Energéticas",
    desc: "Unified data layer with real-time commodity tickers (Câmbio, Brent, Gás, Carvão). Analysts manage Nacional, Internacional, Importação, Frete and Geral data from a single surface.",
  },
  {
    src: "/so5/analise-paridade.png",
    title: "Análise de Paridade",
    desc: "Parity calculator with diário/semanal toggle. Users configure calculation type, base type and exchange rate — then see import price vs national average side by side in real time.",
  },
  {
    src: "/so5/motor-grafico.png",
    title: "Motor de Gráfico",
    desc: "On-demand chart engine. From risk matrix to time series — users build visualizations directly from their own data models, configured in real time.",
  },
  {
    src: "/so5/base-dados.png",
    title: "Gerenciamento — Marcas e Produtos",
    desc: "Internal and external data management with card/list toggle. Each brand entry connects to its products, segments, collaborators and pricing models.",
  },
];

function PillarItem({ p, i, scrollProgress }: { p: any; i: number; scrollProgress: any }) {
  const range = [i * 0.2, (i + 1) * 0.2];
  const opacity = useTransform(scrollProgress, [range[0] - 0.1, range[0], range[1], range[1] + 0.1], [0.3, 1, 1, 0.3]);
  const scale = useTransform(scrollProgress, [range[0] - 0.1, range[0], range[1], range[1] + 0.1], [0.98, 1, 1, 0.98]);

  return (
    <motion.div
      style={{
        opacity,
        scale,
        borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.07)" : "none",
        paddingLeft: i > 0 ? "2rem" : 0
      }}
      className={`pr-8${i > 0 ? " so5-border-l" : ""}`}
    >
      <span
        className="block mb-3 uppercase"
        style={{ fontFamily: "var(--font-space)", fontSize: "0.6rem", letterSpacing: "0.3em", color: "#3DFF6E" }}
      >
        {p.num}
      </span>
      <p className="font-medium mb-3 text-sm" style={{ fontFamily: "var(--font-space)", color: "#F2EDE8" }}>
        {p.title}
      </p>
      <p className="text-xs leading-relaxed font-geist font-light" style={{ color: "#B8B3AE" }}>
        {p.desc}
      </p>
    </motion.div>
  );
}

export default function SO5Case() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pillarsRef = useRef<HTMLElement>(null);

  const { scrollYProgress: pillarScroll } = useScroll({
    target: pillarsRef,
    offset: ["start center", "end center"],
  });

  const pillarBg = useTransform(
    pillarScroll,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    [
      "rgba(61,255,110,0.01)",
      "rgba(61,255,110,0.05)",
      "rgba(255,63,168,0.05)",
      "rgba(26,188,254,0.05)",
      "rgba(10,207,131,0.05)",
      "rgba(61,255,110,0.01)",
    ]
  );

  return (
    <main className="min-h-screen pt-24" style={{ backgroundColor: "#0A0908" }}>

      {/* ── BACK ── */}
      <div className="px-8 py-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <Link href="/work">
          <span
            className="uppercase transition-colors"
            style={{ fontFamily: "var(--font-space)", fontSize: "0.6rem", letterSpacing: "0.3em", color: "#7A7570" }}
          >
            ← Work
          </span>
        </Link>
      </div>

      {/* ── HERO ── */}
      <section className="px-8 py-20" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="so5-hero-grid grid grid-cols-12 gap-8 items-end">
          <motion.div
            className="so5-col-8 col-span-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0, 0, 1] }}
          >
            <span
              className="block mb-4 uppercase"
              style={{ fontFamily: "var(--font-space)", fontSize: "0.6rem", letterSpacing: "0.4em", color: "#3DFF6E" }}
            >
              01 · Product Design · YEB · 2024
            </span>
            <h1
              className="font-bold uppercase leading-none mb-6"
              style={{
                fontFamily: "var(--font-space)",
                fontSize: "clamp(2.5rem, 7vw, 7rem)",
                letterSpacing: "0.03em",
                color: "#F2EDE8",
              }}
            >
              SO5
              <br />
              Intelligence
              <br />
              Hub
            </h1>
            <p
              className="max-w-lg leading-relaxed"
              style={{ fontSize: "1.1rem", color: "#B8B3AE", fontFamily: "var(--font-geist)" }}
            >
              Transforming a legacy commodity trading platform into a modern, scalable enterprise experience.
              From green screen to design system.
            </p>
          </motion.div>

          <motion.div
            className="so5-col-4 col-span-4 flex flex-col gap-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {[
              { label: "Client", value: "YEB" },
              { label: "Scope", value: "End-to-end product design" },
              { label: "Context", value: "Commodity trading · Agribusiness" },
              { label: "Deliverable", value: "Design system + full platform" },
            ].map((item) => (
              <div key={item.label} style={{ paddingBottom: "1.25rem", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <span
                  className="block uppercase mb-1"
                  style={{ fontFamily: "var(--font-space)", fontSize: "0.5rem", letterSpacing: "0.35em", color: "#7A7570" }}
                >
                  {item.label}
                </span>
                <span
                  className="text-sm"
                  style={{ fontFamily: "var(--font-space)", color: "#F2EDE8" }}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CORE TENSION ── */}
      <section className="px-8 py-16" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="py-8 px-10"
          style={{ borderLeft: "2px solid #3DFF6E", backgroundColor: "rgba(61,255,110,0.04)" }}
        >
          <span
            className="block mb-2 uppercase"
            style={{ fontFamily: "var(--font-space)", fontSize: "0.5rem", letterSpacing: "0.4em", color: "#3DFF6E" }}
          >
            Core Tension
          </span>
          <p
            style={{
              fontFamily: "var(--font-space)",
              fontSize: "clamp(1.1rem, 2.5vw, 1.8rem)",
              fontWeight: 300,
              color: "#F2EDE8",
            }}
          >
            Expert users with entrenched mental models
            <br />
            vs. a business need for scalable, modern infrastructure.
          </p>
        </motion.div>
      </section>

      {/* ── PROBLEM ── */}
      <section className="px-8 py-20" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="so5-hero-grid grid grid-cols-12 gap-12 mb-16">
          <motion.div
            className="so5-col-5 col-span-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span
              className="block mb-6 uppercase"
              style={{ fontFamily: "var(--font-space)", fontSize: "0.6rem", letterSpacing: "0.4em", color: "#7A7570" }}
            >
              Problem Statement
            </span>
            <h2
              className="font-medium mb-6"
              style={{ fontFamily: "var(--font-space)", fontSize: "1.6rem", color: "#F2EDE8", lineHeight: 1.3 }}
            >
              A platform built for yesterday&apos;s workflow
            </h2>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "#B8B3AE" }}>
              The SO5 platform carried years of accumulated complexity. Expert commodity traders and agricultural
              analysts navigated dense, unintuitive interfaces derived from AS/400 legacy systems — creating
              critical bottlenecks in time-sensitive market decisions.
            </p>
          </motion.div>

          <div className="so5-col-7 col-span-7">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="border border-white/10 rounded-sm overflow-hidden shadow-2xl"
            >
              <BeforeAfterSlider
                afterImage="/so5/dashboard-commodities.png"
                beforeImage="/so5/motor-calculo.png"
              />
            </motion.div>
          </div>
        </div>

        <div className="so5-hero-grid grid grid-cols-12 gap-12">
          <div className="so5-col-5 col-span-5 hidden md:block" />
          <motion.div
            className="so5-col-7 col-span-7"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            <span
              className="block mb-6 uppercase"
              style={{ fontFamily: "var(--font-space)", fontSize: "0.6rem", letterSpacing: "0.4em", color: "#7A7570" }}
            >
              Why This Mattered
            </span>
            <div className="space-y-0">
              {[
                "Central to YEB's core commodity trading and market intelligence operations",
                "Interface friction directly impacted decision speed in volatile markets",
                "Modernization required to scale the product and onboard clients independently",
                "Significant gap between data sophistication and user ability to access it fluidly",
                "Legacy system created developer bottlenecks with every new feature request",
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-5 py-4"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                >
                  <span style={{ color: "#3DFF6E", fontFamily: "var(--font-space)", fontSize: "0.6rem", paddingTop: "2px" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm leading-relaxed" style={{ color: "#B8B3AE" }}>{item}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CONSTRAINTS ── */}
      <section className="px-8 py-16" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", backgroundColor: "rgba(255,255,255,0.02)" }}>
        <span
          className="block mb-10 uppercase"
          style={{ fontFamily: "var(--font-space)", fontSize: "0.6rem", letterSpacing: "0.4em", color: "#7A7570" }}
        >
          Working Within the Real World
        </span>
        <div className="so5-pillars grid grid-cols-3 gap-0">
          {[
            { label: "Legacy Tech Debt", detail: "Incremental redesign required — couldn't break existing production flows." },
            { label: "Expert User Base", detail: "High resistance to change from seasoned users with entrenched muscle memory." },
            { label: "Parallel Delivery", detail: "Design system + screen delivery simultaneously under tight timelines." },
          ].map((c, i) => (
            <motion.div
              key={c.label}
              className={`pr-10${i > 0 ? " so5-border-l" : ""}`}
              style={{ borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.07)" : "none", paddingLeft: i > 0 ? "2.5rem" : 0 }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <span
                className="block mb-3 uppercase"
                style={{ fontFamily: "var(--font-space)", fontSize: "0.6rem", letterSpacing: "0.3em", color: "#3DFF6E" }}
              >
                {c.label}
              </span>
              <p className="text-sm leading-relaxed" style={{ color: "#B8B3AE" }}>{c.detail}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── INFORMATION ARCHITECTURE ── */}
      <section className="px-8 py-20" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <motion.span
          className="block mb-8 uppercase"
          style={{ fontFamily: "var(--font-space)", fontSize: "0.6rem", letterSpacing: "0.4em", color: "#7A7570" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Information Architecture
        </motion.span>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full overflow-hidden"
          style={{ border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <Image
            src="/so5/info-architecture.png"
            alt="SO5 Information Architecture — full sitemap"
            width={1600}
            height={600}
            className="w-full h-auto"
            style={{ display: "block" }}
          />
        </motion.div>
        <p className="mt-4 text-xs" style={{ color: "#7A7570", fontFamily: "var(--font-space)", letterSpacing: "0.2em" }}>
          Full platform sitemap — Dash → Motor de Cálculo → Motor Gráfico · Base de Dados · Conteúdo · Gerenciamento
        </p>
      </section>

      {/* ── DESIGN PILLARS ── */}
      <motion.section
        ref={pillarsRef}
        className="px-8 py-32 transition-colors duration-1000"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          backgroundColor: pillarBg as any,
        }}
      >
        <span
          className="block mb-16 uppercase"
          style={{ fontFamily: "var(--font-space)", fontSize: "0.6rem", letterSpacing: "0.4em", color: "#7A7570" }}
        >
          Approach — 5 Design Pillars
        </span>
        <div className="so5-pillars grid grid-cols-5 gap-0">
          {pillars.map((p, i) => (
            <PillarItem
              key={p.num}
              p={p}
              i={i}
              scrollProgress={pillarScroll}
            />
          ))}
        </div>
      </motion.section>

      {/* ── SCREENS ── */}
      <section className="px-8 py-20" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <span
          className="block mb-12 uppercase"
          style={{ fontFamily: "var(--font-space)", fontSize: "0.6rem", letterSpacing: "0.4em", color: "#7A7570" }}
        >
          Designed for Performance
        </span>

        <div className="space-y-24">
          {screens.map((s, i) => (
            <motion.div
              key={s.title}
              className={`so5-hero-grid grid grid-cols-12 gap-12 items-center ${i % 2 === 1 ? "direction-rtl" : ""}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.25, 0, 0, 1] }}
            >
              <div
                className={`so5-col-8 col-span-8 overflow-hidden ${i % 2 === 1 ? "col-start-5 md:order-2 order-1" : "order-1"}`}
                style={{ border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {i === 0 ? (
                  <InteractiveHotspots
                    hotspots={[
                      { x: 32, y: 35, title: "Fluxo Unificado", description: "Centralizamos dados nacionais e internacionais em uma única visão para acelerar o tempo de reação." },
                      { x: 74, y: 12, title: "Indicadores em Tempo Real", description: "Tickers de commodities (Brent, Gás) integrados diretamente na arquitetura da página." },
                      { x: 15, y: 78, title: "Arquitetura Modular", description: "O sistema de cards permite que cada analista configure sua workspace conforme a trading desk." }
                    ]}
                  >
                    <Image
                      src={s.src}
                      alt={s.title}
                      width={1400}
                      height={900}
                      className="w-full h-auto block transition-transform duration-700 hover:scale-[1.02]"
                    />
                  </InteractiveHotspots>
                ) : (
                  <Image
                    src={s.src}
                    alt={s.title}
                    width={1400}
                    height={900}
                    className="w-full h-auto block transition-transform duration-700 hover:scale-[1.02]"
                  />
                )}
              </div>

              <div className={`so5-col-4 col-span-4 ${i % 2 === 1 ? "col-start-1 md:order-1 order-2" : "order-2"}`}>
                <span
                  className="block mb-2 uppercase"
                  style={{ fontFamily: "var(--font-space)", fontSize: "0.5rem", letterSpacing: "0.35em", color: "#3DFF6E" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3
                  className="font-medium mb-4"
                  style={{ fontFamily: "var(--font-space)", fontSize: "1rem", color: "#F2EDE8" }}
                >
                  {s.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#B8B3AE" }}>
                  {s.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── RESULTS ── */}
      <section className="px-8 py-20" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <span
          className="block mb-12 uppercase"
          style={{ fontFamily: "var(--font-space)", fontSize: "0.6rem", letterSpacing: "0.4em", color: "#7A7570" }}
        >
          Outcomes
        </span>
        <div className="so5-pillars grid grid-cols-4 gap-0">
          {[
            { value: "Zero", label: "IT dependency for daily operations" },
            { value: "5 pillars", label: "delivered in a single design system" },
            { value: "Independent", label: "client onboarding — no human training" },
            { value: "A→Z", label: "end-to-end ownership of every module" },
          ].map((r, i) => (
            <motion.div
              key={r.label}
              className={`pr-10${i > 0 ? " so5-border-l" : ""}`}
              style={{ borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.07)" : "none", paddingLeft: i > 0 ? "2.5rem" : 0 }}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <p
                className="font-bold mb-2"
                style={{ fontFamily: "var(--font-space)", fontSize: "2rem", color: "#3DFF6E", lineHeight: 1 }}
              >
                {r.value}
              </p>
              <p className="text-sm" style={{ color: "#B8B3AE" }}>{r.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── NAV BOTTOM ── */}
      <section className="px-8 py-12 flex items-center justify-between">
        <Link href="/work">
          <span
            className="uppercase transition-colors"
            style={{ fontFamily: "var(--font-space)", fontSize: "0.6rem", letterSpacing: "0.3em", color: "#7A7570" }}
          >
            ← All Work
          </span>
        </Link>
        <Link href="/contact">
          <span
            className="uppercase transition-colors"
            style={{ fontFamily: "var(--font-space)", fontSize: "0.6rem", letterSpacing: "0.3em", color: "#F2EDE8" }}
          >
            Start a project →
          </span>
        </Link>
      </section>
    </main>
  );
}
