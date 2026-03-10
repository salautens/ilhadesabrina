"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

const cases = [
  {
    index: "01",
    slug: "/work/so5",
    title: "SO5 Intelligence Hub",
    subtitle: "Intelligence Hub Platform",
    category: "Product Design · Enterprise",
    client: "YEB",
    year: "2024",
    tags: ["Design System", "Enterprise", "Legacy Migration", "B2B", "Commodity Trading"],
    summary: "From green screen to design system. Transforming a legacy commodity trading platform into a modern, scalable enterprise experience.",
    tension: "Expert users with entrenched mental models vs. a business need for scalable, modern infrastructure.",
    problem: "The SO5 platform carried years of accumulated complexity. Expert commodity traders and agricultural analysts navigated dense, unintuitive interfaces derived from AS/400 legacy systems — creating critical bottlenecks in time-sensitive market decisions. High cognitive load, lack of visual hierarchy, and fragmented workflows made the system intimidating for new users and inefficient for seasoned ones.",
    constraints: [
      { label: "Legacy Tech Debt", detail: "Incremental redesign required — couldn't break existing production flows." },
      { label: "Expert User Base", detail: "High resistance to change from seasoned users with muscle memory." },
      { label: "Parallel Delivery", detail: "Design system + screen delivery simultaneously under tight timelines." },
    ],
    approach: "A systematic redesign from the ground up. Role-based interfaces so analysts see data and managers see strategy. Transparent processing to transform data chaos into trusted intelligence. Drag-and-drop prioritization and high-contrast displays built for volatile market decisions.",
    pillars: [
      { num: "01", title: "Transparent Processing", desc: "Real-time visibility of all processing engines and data sources — turning data chaos into trusted intelligence." },
      { num: "02", title: "Intelligent Content Automation", desc: "Documents, videos, newsletters, and market analyses generated from a single data source. No more tool switching." },
      { num: "03", title: "Advanced Calculation Engine", desc: "Real-time computation feedback, performance monitoring, and visible calculation queues for agricultural pricing models." },
      { num: "04", title: "Complete User Independence", desc: "Users control their entire workflow — from data prioritization to content generation — without IT dependency." },
    ],
    results: [
      "Zero IT dependency for daily operations",
      "Onboarding new clients independently",
      "Design system scalable across all modules",
      "Expert users adopted new flows without resistance",
    ],
    color: "#3DFF6E",
  },
  {
    index: "02",
    title: "Onboarding Zero",
    subtitle: "Anxiety-Free Activation",
    category: "UX Research · Startup",
    client: "Fintech Startup",
    year: "2024",
    tags: ["UX Research", "Startup", "Mobile", "Conversion"],
    summary: "De 67% de abandono a uma experiência que as pessoas completam sem perceber.",
    tension: "Onboarding completo necessário para compliance vs. usuários que abandonam ao menor sinal de esforço.",
    problem: "O onboarding tinha 23 etapas obrigatórias por regulamentação. A maioria dos usuários abandonava na etapa 7. A equipe assumia que o problema era quantidade — mas era percepção de esforço.",
    constraints: [],
    approach: "Research com 40 usuários revelou que o peso emocional, não o volume de passos, causava abandono. Redesenhei com progressive disclosure, âncoras de progresso invisíveis e micro-vitórias a cada etapa.",
    pillars: [],
    results: [
      "↓ 67% taxa de abandono",
      "↑ 3x conversão de ativação",
      "NPS +42 pontos pós-onboarding",
      "23 etapas mantidas, percepção de esforço zerada",
    ],
    color: "#C04DFF",
  },
  {
    index: "03",
    title: "Dashboard Calm",
    subtitle: "Data Visualization Redesign",
    category: "Data Visualization · Fintech",
    client: "Fintech",
    year: "2023",
    tags: ["Data Viz", "Fintech", "Desktop", "Density Design"],
    summary: "Quando usuários param de ter medo dos próprios dados.",
    tension: "Precisão analítica máxima vs. cognição humana em situações de pressão.",
    problem: "Um dashboard com 80 métricas visíveis simultaneamente. Analistas relatavam ansiedade só de abrir a tela — e tomavam decisões baseadas apenas nas primeiras métricas visíveis, ignorando o restante.",
    constraints: [],
    approach: "Hierarquia de densidade adaptativa: o dashboard exibe o essencial e revela profundidade sob demanda. O sistema aprende quais métricas cada usuário acessa mais e reorganiza a hierarquia automaticamente.",
    pillars: [],
    results: [
      "↓ 52% calls ao suporte",
      "↑ 91% engajamento diário",
      "4.8/5 NPS de facilidade de uso",
      "100% das métricas acessadas regularmente pela primeira vez",
    ],
    color: "#3ACFFF",
  },
];

export default function Work() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <main className="min-h-screen pt-24" style={{ backgroundColor: "#0A0908" }}>
      {/* Header */}
      <section className="px-8 py-16" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex items-end justify-between">
          <motion.h1
            className="font-bold uppercase"
            style={{
              fontFamily: "var(--font-space)",
              fontSize: "clamp(3rem, 8vw, 8rem)",
              letterSpacing: "0.04em",
              color: "#F2EDE8",
              lineHeight: 1,
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0, 0, 1] }}
          >
            Work
          </motion.h1>
          <motion.span
            className="pb-2 uppercase"
            style={{ fontFamily: "var(--font-space)", fontSize: "0.6rem", letterSpacing: "0.3em", color: "#7A7570" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {cases.length} Projects
          </motion.span>
        </div>
      </section>

      {/* Cases */}
      <section className="px-8 py-0">
        {cases.map((c, i) => (
          <motion.div
            key={c.index}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.5, ease: [0.25, 0, 0, 1] }}
            style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", position: "relative" }}
          >
            {c.slug && (
              <Link href={c.slug} className="absolute inset-0 z-10" aria-label={`View ${c.title} case study`} />
            )}
            {/* Panel header */}
            <button
              onClick={() => c.slug ? undefined : setOpen(open === i ? null : i)}
              className="w-full text-left py-10 flex items-start gap-12"
              style={{ cursor: "none" }}
            >
              <span
                className="uppercase pt-1 w-8 shrink-0"
                style={{ fontFamily: "var(--font-space)", fontSize: "0.6rem", letterSpacing: "0.3em", color: "#7A7570" }}
              >
                {c.index}
              </span>

              <div className="flex-1">
                <div className="flex items-baseline gap-6 mb-1">
                  <h2
                    className="font-medium transition-colors duration-300"
                    style={{
                      fontFamily: "var(--font-space)",
                      fontSize: "clamp(1.4rem, 3vw, 2.2rem)",
                      color: open === i ? c.color : "#F2EDE8",
                    }}
                  >
                    {c.title}
                  </h2>
                  <span
                    className="uppercase"
                    style={{ fontFamily: "var(--font-space)", fontSize: "0.6rem", letterSpacing: "0.25em", color: "#7A7570" }}
                  >
                    {c.category} · {c.client}
                  </span>
                </div>
                <p className="text-xs mb-3 uppercase" style={{ fontFamily: "var(--font-space)", letterSpacing: "0.2em", color: c.color, opacity: 0.8 }}>
                  {c.subtitle}
                </p>
                <p className="text-sm leading-relaxed max-w-xl" style={{ color: "#B8B3AE" }}>
                  {c.summary}
                </p>
              </div>

              <div className="flex flex-col items-end gap-3 pt-1 shrink-0">
                <span
                  className="uppercase"
                  style={{ fontFamily: "var(--font-space)", fontSize: "0.6rem", letterSpacing: "0.3em", color: "#7A7570" }}
                >
                  {c.year}
                </span>
                {c.slug ? (
                  <span className="text-sm" style={{ color: c.color }}>→</span>
                ) : (
                  <motion.span
                    className="text-sm font-bold"
                    style={{ color: c.color }}
                    animate={{ rotate: open === i ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: [0.25, 0, 0, 1] }}
                  >
                    +
                  </motion.span>
                )}
              </div>
            </button>

            {/* Panel body */}
            <AnimatePresence>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.25, 0, 0, 1] }}
                  style={{ overflow: "hidden" }}
                >
                  {/* Core tension */}
                  {c.tension && (
                    <div className="pl-20 pb-8 pr-8">
                      <div className="py-5 px-6" style={{ borderLeft: `2px solid ${c.color}`, backgroundColor: `${c.color}10` }}>
                        <span
                          className="block mb-1 uppercase"
                          style={{ fontFamily: "var(--font-space)", fontSize: "0.5rem", letterSpacing: "0.35em", color: c.color }}
                        >
                          Core Tension
                        </span>
                        <p className="text-sm italic" style={{ color: "#B8B3AE" }}>{c.tension}</p>
                      </div>
                    </div>
                  )}

                  {/* Problem / Approach / Results */}
                  <div className="pb-10 pl-20 pr-8 grid grid-cols-3 gap-12">
                    <div>
                      <span
                        className="block mb-3 uppercase"
                        style={{ fontFamily: "var(--font-space)", fontSize: "0.55rem", letterSpacing: "0.35em", color: "#7A7570" }}
                      >
                        Problem
                      </span>
                      <p className="text-sm leading-relaxed" style={{ color: "#B8B3AE" }}>{c.problem}</p>
                    </div>

                    <div>
                      <span
                        className="block mb-3 uppercase"
                        style={{ fontFamily: "var(--font-space)", fontSize: "0.55rem", letterSpacing: "0.35em", color: "#7A7570" }}
                      >
                        Approach
                      </span>
                      <p className="text-sm leading-relaxed" style={{ color: "#B8B3AE" }}>{c.approach}</p>

                      {c.constraints.length > 0 && (
                        <div className="mt-6 space-y-3">
                          {c.constraints.map((con) => (
                            <div key={con.label}>
                              <span
                                className="block uppercase"
                                style={{ fontFamily: "var(--font-space)", fontSize: "0.5rem", letterSpacing: "0.25em", color: c.color }}
                              >
                                {con.label}
                              </span>
                              <span className="text-xs" style={{ color: "#B8B3AE" }}>{con.detail}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <span
                        className="block mb-3 uppercase"
                        style={{ fontFamily: "var(--font-space)", fontSize: "0.55rem", letterSpacing: "0.35em", color: "#7A7570" }}
                      >
                        Results
                      </span>
                      <ul className="space-y-2">
                        {c.results.map((r, j) => (
                          <li key={j} className="text-sm font-medium" style={{ color: c.color, fontFamily: "var(--font-space)" }}>
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Design pillars */}
                  {c.pillars.length > 0 && (
                    <div className="pl-20 pr-8 pb-12">
                      <span
                        className="block mb-6 uppercase"
                        style={{ fontFamily: "var(--font-space)", fontSize: "0.55rem", letterSpacing: "0.35em", color: "#7A7570" }}
                      >
                        Design Pillars
                      </span>
                      <div className="grid grid-cols-4 gap-0">
                        {c.pillars.map((p, j) => (
                          <div
                            key={p.num}
                            className="pr-8"
                            style={{ borderLeft: j > 0 ? "1px solid rgba(255,255,255,0.07)" : "none", paddingLeft: j > 0 ? "2rem" : 0 }}
                          >
                            <span
                              className="block mb-2 uppercase"
                              style={{ fontFamily: "var(--font-space)", fontSize: "0.55rem", letterSpacing: "0.3em", color: c.color }}
                            >
                              {p.num}
                            </span>
                            <p
                              className="mb-2 font-medium text-sm"
                              style={{ fontFamily: "var(--font-space)", color: "#F2EDE8" }}
                            >
                              {p.title}
                            </p>
                            <p className="text-xs leading-relaxed" style={{ color: "#B8B3AE" }}>{p.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="pb-10 pl-20 flex gap-3 flex-wrap">
                    {c.tags.map((t) => (
                      <span
                        key={t}
                        className="px-3 py-1 uppercase"
                        style={{
                          fontFamily: "var(--font-space)",
                          fontSize: "0.5rem",
                          letterSpacing: "0.25em",
                          color: c.color,
                          border: `1px solid ${c.color}40`,
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </section>
    </main>
  );
}
