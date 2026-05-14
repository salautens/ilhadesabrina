"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import InteractiveHotspots from "@/components/InteractiveHotspots";
import { useLang, Lang } from "@/lib/lang";

function getPillars(lang: Lang) {
  return lang === "pt" ? [
    { num: "01", title: "Arquitetura de Informação", desc: "Estrutura de painéis reorganizada com hierarquia clara, agrupamento lógico e padrões de navegação contextual." },
    { num: "02", title: "Fluxos Simplificados", desc: "Mapeamos e otimizamos jornadas críticas — gestão de pedidos, rastreamento de posições e visualização de dados de mercado." },
    { num: "03", title: "Biblioteca de Componentes", desc: "Componentes modulares construídos com shadcn/ui como base, com implementação consistente em toda a plataforma." },
    { num: "04", title: "Sistema de Onboarding", desc: "Experiência estruturada de primeiro uso que reduz a dependência de treinamento humano e acelera a produtividade." },
    { num: "05", title: "Validação Iterativa", desc: "Ciclos contínuos de testes com usuários reais, aprendizados documentados e refinamento guiado por protótipos." },
  ] : [
    { num: "01", title: "Information Architecture", desc: "Reorganized panel structure with clear hierarchy, logical grouping, and contextual navigation patterns." },
    { num: "02", title: "Simplified Flows", desc: "Mapped and optimized critical journeys — order management, position tracking, and market data visualization." },
    { num: "03", title: "Component Library", desc: "Modular components built on shadcn/ui as a foundation, with consistent implementation across the platform." },
    { num: "04", title: "Onboarding System", desc: "Structured first-use experience that reduces dependency on human training and accelerates productivity." },
    { num: "05", title: "Iterative Validation", desc: "Continuous testing cycles with real users, documented learnings, and prototype-guided refinement." },
  ];
}

function getScreens(lang: Lang) {
  return lang === "pt" ? [
    { src: "/so5/dashboard-commodities.png", title: "LineUp — Controle de Embarques", desc: "Sistema de rastreamento marítimo em tempo real. Operadores visualizam total de chegadas, atracamentos e tempo médio de demurrage — com cards por navio mostrando produto, exportador, importador e datas de chegada, atracamento e saída." },
    { src: "/so5/analise-paridade.png", title: "Análise de Paridade", desc: "Calculadora de paridade com toggle diário/semanal. Usuários configuram tipo de cálculo, base e câmbio — e visualizam preço de importação versus média nacional lado a lado em tempo real." },
    { src: "/so5/motor-grafico.png", title: "Motor de Gráfico", desc: "Motor gráfico sob demanda. De matriz de risco a séries temporais — usuários constroem visualizações diretamente dos seus modelos de dados, configuradas em tempo real." },
    { src: "/so5/base-dados.png", title: "Gerenciamento — Marcas e Produtos", desc: "Gestão de dados internos e externos com toggle card/lista. Cada entrada de marca se conecta a produtos, segmentos, colaboradores e modelos de precificação." },
  ] : [
    { src: "/so5/dashboard-commodities.png", title: "LineUp — Shipment Tracking", desc: "Real-time maritime tracking system. Operators see total arrivals, dockings, and average demurrage time — with per-vessel cards showing product, exporter, importer, and arrival, docking, and departure dates." },
    { src: "/so5/analise-paridade.png", title: "Parity Analysis", desc: "Parity calculator with daily/weekly toggle. Users configure calculation type, base, and exchange rate — and view import price vs. national average side by side in real time." },
    { src: "/so5/motor-grafico.png", title: "Chart Engine", desc: "On-demand chart engine. From risk matrix to time series — users build visualizations directly from their data models, configured in real time." },
    { src: "/so5/base-dados.png", title: "Management — Brands & Products", desc: "Internal and external data management with card/list toggle. Each brand entry connects to products, segments, collaborators, and pricing models." },
  ];
}

export default function SO5Case() {
  const { lang } = useLang();
  const containerRef = useRef<HTMLDivElement>(null);
  const pillarsRef = useRef<HTMLElement>(null);

  const pillars = getPillars(lang);
  const screens = getScreens(lang);

  const { scrollYProgress: pillarScroll } = useScroll({
    target: pillarsRef,
    offset: ["start center", "end center"],
  });

  const metaItems = lang === "pt" ? [
    { label: "Cliente", value: "YEB" },
    { label: "Escopo", value: "End-to-end" },
    { label: "Contexto", value: "Commodities · Agro" },
    { label: "Ano", value: "2024" },
  ] : [
    { label: "Client", value: "YEB" },
    { label: "Scope", value: "End-to-end" },
    { label: "Context", value: "Commodities · Agro" },
    { label: "Year", value: "2024" },
  ];

  const whyItems = lang === "pt" ? [
    "Central às operações de trading de commodities e inteligência de mercado da YEB",
    "O atrito da interface impactava diretamente a velocidade de decisão em mercados voláteis",
    "A modernização era necessária para escalar o produto e integrar clientes de forma independente",
    "Grande lacuna entre a sofisticação dos dados e a capacidade do usuário de acessá-los com fluidez",
    "O sistema legado criava gargalos de desenvolvimento a cada nova solicitação de funcionalidade",
  ] : [
    "Central to YEB's commodity trading operations and market intelligence",
    "Interface friction directly impacted decision speed in volatile markets",
    "Modernization was necessary to scale the product and onboard clients independently",
    "Large gap between data sophistication and users' ability to access it fluidly",
    "Legacy system created development bottlenecks with every new feature request",
  ];

  const results = lang === "pt" ? [
    { value: "Zero", label: "dependência de TI" },
    { value: "5", label: "pilares de design" },
    { value: "100%", label: "onboarding independente" },
    { value: "A→Z", label: "ownership end-to-end" },
  ] : [
    { value: "Zero", label: "IT dependency" },
    { value: "5", label: "design pillars" },
    { value: "100%", label: "independent onboarding" },
    { value: "A→Z", label: "end-to-end ownership" },
  ];

  const hotspots = lang === "pt" ? [
    { x: 32, y: 35, title: "Fluxo Unificado", description: "Centralizamos dados nacionais e internacionais em uma única visão para acelerar o tempo de reação." },
    { x: 74, y: 12, title: "Indicadores em Tempo Real", description: "Tickers de commodities (Brent, Gás) integrados diretamente na arquitetura da página." },
    { x: 15, y: 78, title: "Arquitetura Modular", description: "O sistema de cards permite que cada analista configure sua workspace conforme a trading desk." },
  ] : [
    { x: 32, y: 35, title: "Unified Flow", description: "We centralized national and international data into a single view to accelerate reaction time." },
    { x: 74, y: 12, title: "Real-Time Indicators", description: "Commodity tickers (Brent, Gas) integrated directly into the page architecture." },
    { x: 15, y: 78, title: "Modular Architecture", description: "The card system lets each analyst configure their workspace according to their trading desk." },
  ];

  return (
    <main ref={containerRef} className="min-h-screen pt-24" style={{ backgroundColor: "#0A0908" }}>

      {/* ── VOLTAR ── */}
      <div className="px-4 md:px-16 py-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <Link href="/work">
          <span className="uppercase transition-colors" style={{ fontFamily: "var(--font-space)", fontSize: "0.6rem", letterSpacing: "0.3em", color: "#7A7570" }}>
            ← {lang === "pt" ? "Trabalhos" : "Work"}
          </span>
        </Link>
      </div>

      {/* ── HERO ── */}
      <section className="px-4 md:px-16" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", position: "relative", overflow: "hidden" }}>
        {/* Watermark background text */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          fontFamily: "var(--font-space)", fontWeight: 700,
          fontSize: "clamp(5rem, 18vw, 16rem)",
          letterSpacing: "0.08em", textTransform: "uppercase",
          color: "rgba(255,255,255,0.025)",
          whiteSpace: "nowrap", userSelect: "none", pointerEvents: "none",
          zIndex: 0,
        }}>
          CASE STUDY
        </div>

        {/* Top labels */}
        <div className="flex items-center justify-between pt-10 md:pt-16 pb-6 md:pb-10" style={{ position: "relative", zIndex: 1 }}>
          <span style={{ fontFamily: "var(--font-space)", fontSize: "0.55rem", letterSpacing: "0.4em", color: "#7A7570", textTransform: "uppercase" }}>
            {lang === "pt" ? "UI/UX · Design de Produto" : "UI/UX · Product Design"}
          </span>
          <span style={{ fontFamily: "var(--font-space)", fontSize: "0.55rem", letterSpacing: "0.4em", color: "#7A7570", textTransform: "uppercase" }}>
            CASE STUDY
          </span>
          <span style={{ fontFamily: "var(--font-space)", fontSize: "0.55rem", letterSpacing: "0.4em", color: "#7A7570" }}>
            2024
          </span>
        </div>

        {/* Hero grid: title left, cover image right */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-20 items-end pb-12 md:pb-20" style={{ position: "relative", zIndex: 1 }}>
          <motion.div
            className="md:col-span-6 flex flex-col justify-end"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0, 0, 1] }}
          >
            <span className="block mb-6 uppercase" style={{ fontFamily: "var(--font-space)", fontSize: "0.6rem", letterSpacing: "0.4em", color: "#3DFF6E" }}>
              01 · YEB · 2024
            </span>
            <h1 className="font-bold uppercase leading-none mb-8"
              style={{ fontFamily: "var(--font-space)", fontSize: "clamp(2.5rem, 7vw, 7rem)", letterSpacing: "0.03em", color: "#F2EDE8" }}>
              SO5<br />Intelligence<br />Hub
            </h1>
            <p className="leading-relaxed" style={{ fontSize: "1rem", color: "#B8B3AE", fontFamily: "var(--font-geist)", maxWidth: "480px" }}>
              {lang === "pt"
                ? "Transformando uma plataforma legada de trading de commodities em uma experiência moderna e escalável. Do sistema legado ao design system."
                : "Transforming a legacy commodity trading platform into a modern, scalable experience. From legacy system to design system."}
            </p>
          </motion.div>

          <motion.div
            className="md:col-span-6"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.9, ease: [0.25, 0, 0, 1] }}
          >
            <div style={{ border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden" }}>
              <Image
                src="/so5/so5-cover.png"
                alt="SO5 Intelligence Hub"
                width={1200}
                height={760}
                className="w-full h-auto block"
              />
            </div>
          </motion.div>
        </div>

        {/* ── STATS BAR ── */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)", position: "relative", zIndex: 1 }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {metaItems.map((item, i) => (
            <div
              key={item.label}
              style={{
                padding: "1.5rem 0",
                borderLeft: i % 2 !== 0 ? "1px solid rgba(255,255,255,0.07)" : "none",
                paddingLeft: i % 2 !== 0 ? "1.5rem" : 0,
                borderTop: i >= 2 ? "1px solid rgba(255,255,255,0.07)" : "none",
              }}
            >
              <p style={{ fontFamily: "var(--font-space)", fontSize: "clamp(1.2rem, 2vw, 1.8rem)", fontWeight: 700, color: "#F2EDE8", marginBottom: "0.5rem" }}>
                {item.value}
              </p>
              <p style={{ fontFamily: "var(--font-space)", fontSize: "0.5rem", letterSpacing: "0.35em", color: "#7A7570", textTransform: "uppercase" }}>
                {item.label}
              </p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── PROBLEMA | ABORDAGEM ── two dashed-border boxes ── */}
      <section className="px-4 md:px-16 py-12 md:py-24" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Box esquerdo — Problema */}
          <motion.div
            className="p-6 md:p-12"
            style={{ border: "1px dashed rgba(255,255,255,0.15)" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="block mb-2 uppercase" style={{ fontFamily: "var(--font-space)", fontSize: "0.5rem", letterSpacing: "0.4em", color: "#7A7570" }}>
              {lang === "pt" ? "Problem solving" : "Problem solving"}
            </span>
            <h2 style={{ fontFamily: "var(--font-space)", fontSize: "1.4rem", fontWeight: 700, color: "#F2EDE8", marginBottom: "2rem", lineHeight: 1.2 }}>
              {lang === "pt" ? (
                <><span style={{ color: "#3DFF6E" }}>Problema</span> Central</>
              ) : (
                <><span style={{ color: "#3DFF6E" }}>Problem</span> Statement</>
              )}
            </h2>
            <div className="space-y-0">
              {whyItems.slice(0, 3).map((item, i) => (
                <div key={i} className="flex items-start gap-4 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <span style={{ color: "#3DFF6E", fontFamily: "var(--font-space)", fontSize: "0.55rem", flexShrink: 0, paddingTop: "2px" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm leading-relaxed" style={{ color: "#B8B3AE" }}>{item}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Box direito — Abordagem + Tensão */}
          <motion.div
            className="p-6 md:p-12"
            style={{ border: "1px dashed rgba(255,255,255,0.15)" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            <span className="block mb-2 uppercase" style={{ fontFamily: "var(--font-space)", fontSize: "0.5rem", letterSpacing: "0.4em", color: "#7A7570" }}>
              {lang === "pt" ? "Hipótese" : "Hypothesis"}
            </span>
            <h2 style={{ fontFamily: "var(--font-space)", fontSize: "1.4rem", fontWeight: 700, color: "#F2EDE8", marginBottom: "2rem", lineHeight: 1.2 }}>
              {lang === "pt" ? (
                <><span style={{ color: "#3DFF6E" }}>Possível</span> Solução</>
              ) : (
                <><span style={{ color: "#3DFF6E" }}>Possible</span> Solution</>
              )}
            </h2>
            <div style={{ borderLeft: "2px solid #3DFF6E", paddingLeft: "1.25rem", marginBottom: "2rem" }}>
              <p style={{ fontFamily: "var(--font-space)", fontSize: "0.85rem", fontWeight: 300, color: "#F2EDE8", lineHeight: 1.6 }}>
                {lang === "pt"
                  ? "Usuários especialistas com modelos mentais arraigados vs. necessidade do negócio de uma infraestrutura moderna e escalável."
                  : "Expert users with entrenched mental models vs. a business need for modern, scalable infrastructure."}
              </p>
            </div>
            <div className="space-y-0">
              {whyItems.slice(3).map((item, i) => (
                <div key={i} className="flex items-start gap-4 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <span style={{ color: "#3DFF6E", fontFamily: "var(--font-space)", fontSize: "0.55rem", flexShrink: 0, paddingTop: "2px" }}>
                    {String(i + 4).padStart(2, "0")}
                  </span>
                  <p className="text-sm leading-relaxed" style={{ color: "#B8B3AE" }}>{item}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── BEFORE/AFTER ── */}
      <section className="px-4 md:px-16 py-12 md:py-24" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <span className="block mb-10 uppercase" style={{ fontFamily: "var(--font-space)", fontSize: "0.6rem", letterSpacing: "0.4em", color: "#7A7570" }}>
          {lang === "pt" ? "Antes & Depois" : "Before & After"}
        </span>
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="border border-white/10 rounded-sm overflow-hidden shadow-2xl"
        >
          <BeforeAfterSlider
            afterImage="/so5/dashboard-commodities.png"
            beforeImage="/so5/legacy-produtos.png"
          />
        </motion.div>
      </section>

      {/* ── DESIGN PROCESS — TIMELINE DOS PILARES ── */}
      <motion.section
        ref={pillarsRef}
        className="px-4 md:px-16 py-12 md:py-24 transition-colors duration-1000"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="text-center mb-10 md:mb-20">
          <span className="block mb-3 uppercase" style={{ fontFamily: "var(--font-space)", fontSize: "0.5rem", letterSpacing: "0.4em", color: "#7A7570" }}>
            {lang === "pt" ? "Abordagem de Design" : "Design Framework"}
          </span>
          <h2 style={{ fontFamily: "var(--font-space)", fontSize: "clamp(1.4rem, 3vw, 2.2rem)", fontWeight: 700, color: "#F2EDE8" }}>
            {lang === "pt" ? (
              <><span style={{ color: "#3DFF6E" }}>Design</span> Process</>
            ) : (
              <><span style={{ color: "#3DFF6E" }}>Design</span> Process</>
            )}
          </h2>
        </div>

        {/* Timeline track */}
        <div style={{ position: "relative" }}>
          {/* Connecting line — desktop only */}
          <div className="hidden md:block" style={{
            position: "absolute", top: "1rem", left: "calc(10% + 1rem)", right: "calc(10% + 1rem)",
            height: "1px", backgroundColor: "rgba(61,255,110,0.2)",
          }} />

          {/* Phase dots — desktop only */}
          <div className="hidden md:grid grid-cols-5" style={{ marginBottom: "3rem" }}>
            {pillars.map((p, i) => (
              <div key={p.num} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <motion.div
                  style={{
                    width: "2rem", height: "2rem", borderRadius: "50%",
                    border: "1px solid #3DFF6E",
                    backgroundColor: "#0A0908",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: "1rem", zIndex: 1, position: "relative",
                  }}
                  initial={{ scale: 0.5, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                >
                  <span style={{ fontFamily: "var(--font-space)", fontSize: "0.45rem", letterSpacing: "0.1em", color: "#3DFF6E" }}>
                    {p.num}
                  </span>
                </motion.div>
              </div>
            ))}
          </div>

          {/* Pillar cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-0">
            {pillars.map((p, i) => (
              <motion.div
                key={p.num}
                className={
                  i > 0
                    ? "pr-8 pt-6 border-t border-white/[0.07] md:border-t-0 md:border-l md:border-white/[0.07] md:pl-8"
                    : "pr-8 pt-2"
                }
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <p className="font-medium mb-2 text-sm" style={{ fontFamily: "var(--font-space)", color: "#F2EDE8" }}>
                  {p.title}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "#7A7570" }}>
                  {p.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── ARQUITETURA DE INFORMAÇÃO ── */}
      <section className="px-4 md:px-16 py-12 md:py-24" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <motion.span
          className="block mb-10 uppercase"
          style={{ fontFamily: "var(--font-space)", fontSize: "0.6rem", letterSpacing: "0.4em", color: "#7A7570" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {lang === "pt" ? "Arquitetura de Informação" : "Information Architecture"}
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
            alt={lang === "pt" ? "Arquitetura de Informação SO5 — sitemap completo" : "SO5 Information Architecture — full sitemap"}
            width={1600}
            height={600}
            className="w-full h-auto"
            style={{ display: "block" }}
          />
        </motion.div>
        <p className="mt-4 text-xs" style={{ color: "#7A7570", fontFamily: "var(--font-space)", letterSpacing: "0.2em" }}>
          {lang === "pt"
            ? "Sitemap completo da plataforma — Dash → Motor de Cálculo → Motor Gráfico · Base de Dados · Conteúdo · Gerenciamento"
            : "Full platform sitemap — Dash → Calculation Engine → Chart Engine · Database · Content · Management"}
        </p>
      </section>

      {/* ── TELAS ── */}
      <section className="px-4 md:px-16 py-12 md:py-24" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <span className="block mb-10 md:mb-16 uppercase" style={{ fontFamily: "var(--font-space)", fontSize: "0.6rem", letterSpacing: "0.4em", color: "#7A7570" }}>
          {lang === "pt" ? "Projetado para Performance" : "Designed for Performance"}
        </span>

        <div className="space-y-20 md:space-y-52">
          {screens.map((s, i) => (
            <motion.div
              key={s.title}
              className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-20 items-center"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.25, 0, 0, 1] }}
            >
              <div
                className={`overflow-hidden md:col-span-8 ${i % 2 === 1 ? "md:col-start-5" : ""}`}
                style={{ border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {i === 0 ? (
                  <InteractiveHotspots hotspots={hotspots}>
                    <Image src={s.src} alt={s.title} width={1400} height={900} className="w-full h-auto block transition-transform duration-700 hover:scale-[1.02]" />
                  </InteractiveHotspots>
                ) : (
                  <Image src={s.src} alt={s.title} width={1400} height={900} className="w-full h-auto block transition-transform duration-700 hover:scale-[1.02]" />
                )}
              </div>

              <div className="md:col-span-4">
                <span className="block mb-3 uppercase" style={{ fontFamily: "var(--font-space)", fontSize: "0.5rem", letterSpacing: "0.35em", color: "#3DFF6E" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-medium mb-4" style={{ fontFamily: "var(--font-space)", fontSize: "1.1rem", color: "#F2EDE8", lineHeight: 1.3 }}>
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

      {/* ── RESULTADOS — stats bar ── */}
      <section className="px-4 md:px-16 py-12 md:py-24" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <span className="block mb-10 md:mb-16 uppercase" style={{ fontFamily: "var(--font-space)", fontSize: "0.6rem", letterSpacing: "0.4em", color: "#7A7570" }}>
          {lang === "pt" ? "Resultados" : "Results"}
        </span>
        <div className="grid grid-cols-2 md:grid-cols-4" style={{ borderTop: "1px solid rgba(255,255,255,0.07)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          {results.map((r, i) => (
            <motion.div
              key={r.label}
              style={{
                padding: "1.5rem 0",
                borderLeft: i % 2 !== 0 ? "1px solid rgba(255,255,255,0.07)" : "none",
                paddingLeft: i % 2 !== 0 ? "1.5rem" : 0,
                paddingRight: "1.5rem",
                borderTop: i >= 2 ? "1px solid rgba(255,255,255,0.07)" : "none",
              }}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <p className="font-bold mb-2" style={{ fontFamily: "var(--font-space)", fontSize: "clamp(2rem, 4vw, 3.5rem)", color: "#3DFF6E", lineHeight: 1 }}>
                {r.value}
              </p>
              <p className="text-sm" style={{ color: "#7A7570", fontFamily: "var(--font-space)", letterSpacing: "0.05em" }}>{r.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── NAV INFERIOR ── */}
      <section className="px-4 md:px-16 py-16 md:py-32 flex items-center justify-between">
        <Link href="/work">
          <span className="uppercase transition-colors" style={{ fontFamily: "var(--font-space)", fontSize: "0.6rem", letterSpacing: "0.3em", color: "#7A7570" }}>
            ← {lang === "pt" ? "Todos os trabalhos" : "All work"}
          </span>
        </Link>
        <Link href="/contact">
          <span className="uppercase transition-colors" style={{ fontFamily: "var(--font-space)", fontSize: "0.6rem", letterSpacing: "0.3em", color: "#F2EDE8" }}>
            {lang === "pt" ? "Iniciar um projeto →" : "Start a project →"}
          </span>
        </Link>
      </section>
    </main>
  );
}
