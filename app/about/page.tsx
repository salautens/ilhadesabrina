"use client";

import { motion, useMotionValue, useAnimationFrame } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useLang } from "@/lib/lang";

const P = 3; // pixel size
const HAND_GRID = [
  [0,0,0,1,0,1,0,0],
  [0,0,1,1,1,1,0,0],
  [0,1,1,1,1,1,1,0],
  [0,1,1,1,1,1,1,0],
  [1,1,1,1,1,1,1,0],
  [1,1,1,1,1,1,0,0],
  [0,1,1,1,1,0,0,0],
  [0,0,1,1,0,0,0,0],
];

function PixelHand({ color = "#F2EDE8" }: { color?: string }) {
  return (
    <svg
      width={8 * P} height={8 * P}
      style={{ imageRendering: "pixelated", display: "inline-block", verticalAlign: "middle" }}
    >
      {HAND_GRID.flatMap((row, r) =>
        row.map((cell, c) =>
          cell ? <rect key={`${r}-${c}`} x={c * P} y={r * P} width={P} height={P} fill={color} /> : null
        )
      )}
    </svg>
  );
}

const BALL = 180;
const SPEED = 2.8;

function PinballPhoto() {
  const { lang } = useLang();
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const vx = useRef(SPEED);
  const vy = useRef(SPEED * 0.75);
  const active = useRef(false);
  const [isActive, setIsActive] = useState(false);
  const [centerY, setCenterY] = useState(0);
  const [hovered, setHovered] = useState(false);

  const boundsRef = useRef({ maxX: 0, maxY: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(() => {
      const { width, height } = el.getBoundingClientRect();
      if (!width || !height) return;
      boundsRef.current = { maxX: width - BALL, maxY: height - BALL };
      const cx = (width - BALL) / 2 + 200;
      const cy = (height - BALL) / 2;
      x.set(cx);
      y.set(cy);
      setCenterY(cy);
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [x, y]);

  useAnimationFrame(() => {
    if (!active.current) return;
    const { maxX, maxY } = boundsRef.current;

    let nx = x.get() + vx.current;
    let ny = y.get() + vy.current;
    if (nx <= 0) { nx = 0; vx.current = Math.abs(vx.current); }
    else if (nx >= maxX) { nx = maxX; vx.current = -Math.abs(vx.current); }
    if (ny <= 0) { ny = 0; vy.current = Math.abs(vy.current); }
    else if (ny >= maxY) { ny = maxY; vy.current = -Math.abs(vy.current); }

    x.set(nx); y.set(ny);
  });

  const resetPos = () => {
    const { maxX, maxY } = boundsRef.current;
    x.set(maxX / 2 + 200);
    y.set(maxY / 2);
  };

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%", height: "100%" }}>
      <motion.div style={{ position: "absolute", x, y }}>
        {!isActive && [0, 1, 2].map((i) => (
          <motion.span
            key={i}
            style={{
              position: "absolute",
              inset: -2,
              borderRadius: "50%",
              border: "1px solid #3DFF6E",
              pointerEvents: "none",
            }}
            initial={{ scale: 1, opacity: 0 }}
            animate={{ scale: [1, 1.05, 1.65], opacity: [0, 0.35, 0] }}
            transition={{
              duration: 3,
              ease: [0.25, 0, 0.5, 1],
              repeat: Infinity,
              delay: i * 1,
              times: [0, 0.15, 1],
            }}
          />
        ))}
        <motion.div
          style={{
            position: "absolute",
            bottom: "calc(100% + 10px)",
            left: "50%",
            transform: "translateX(-50%)",
            pointerEvents: "none",
            whiteSpace: "nowrap",
            fontFamily: "var(--font-bitmap)",
            fontSize: "0.65rem",
            letterSpacing: "0.2em",
            color: "#3DFF6E",
            backgroundColor: "rgba(10,9,8,0.85)",
            border: "1px solid rgba(61,255,110,0.25)",
            padding: "4px 10px",
          }}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 6 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {isActive
            ? (lang === "pt" ? "[ PARAR ]" : "[ STOP ]")
            : (lang === "pt" ? "[ ANIMAR ]" : "[ ANIMATE ]")}
        </motion.div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/sabrina.png"
          alt="Sabrina"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => {
            if (active.current) { active.current = false; setIsActive(false); resetPos(); }
            else { active.current = true; setIsActive(true); }
          }}
          style={{ width: BALL, height: BALL, borderRadius: "50%", objectFit: "cover", objectPosition: "center top", display: "block", cursor: "pointer" }}
        />
      </motion.div>
      <span style={{
        position: "absolute",
        top: centerY + BALL / 2,
        left: 0,
        transform: "translateY(-50%)",
        fontFamily: "var(--font-space)", fontSize: "0.9rem", fontWeight: 700,
        letterSpacing: "0.15em", color: "#7A7570", textTransform: "uppercase",
        whiteSpace: "nowrap",
        pointerEvents: "none",
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/hand.png" alt="" style={{ width: 150, height: 150, objectFit: "contain", display: "inline-block", verticalAlign: "middle", filter: "invert(1) brightness(0.45)", marginRight: -20 }} />
        {lang === "pt" ? "Oi, eu sou a Sabrina" : "Hi, I'm Sabrina"}
      </span>
    </div>
  );
}

export default function About() {
  const { lang } = useLang();

  const skills = [
    { area: lang === "pt" ? "Research & Estratégia" : "Research & Strategy", items: ["User Research", "Jobs-to-be-done", "Competitive Analysis", "Trend Mapping"] },
    { area: lang === "pt" ? "Design & Sistemas" : "Design & Systems", items: ["UX Architecture", "UI Design", "Design Systems", "Prototyping"] },
    { area: "Tools", items: ["Figma", "Maze", "Hotjar", "Notion", "Jira"] },
    { area: "Context", items: ["B2B SaaS", "Fintech", "Startups", "Enterprise"] },
  ];

  const values = lang === "pt" ? [
    {
      icon: "🎯",
      title: "Clareza",
      desc: "Design deve fazer a complexidade parecer simples. Acredito em criar experiências que comunicam sem esforço, guiando pessoas com intenção e precisão.",
    },
    {
      icon: "✦",
      title: "Craft",
      desc: "Cada pixel, movimento e palavra importa. Valorizo a profundidade do detalhe — a harmonia entre função e beleza que transforma interfaces em experiências.",
    },
    {
      icon: "⬆",
      title: "Evolução",
      desc: "Design nunca está terminado. Abraço iteração e curiosidade como ferramentas de progresso — refinando ideias até que pareçam inevitáveis.",
    },
  ] : [
    {
      icon: "🎯",
      title: "Clarity",
      desc: "Design should make complexity feel simple. I believe in creating experiences that communicate effortlessly, guiding people with intention and precision.",
    },
    {
      icon: "✦",
      title: "Craft",
      desc: "Every pixel, motion, and word matters. I value depth of detail — the harmony between function and beauty that transforms interfaces into experiences.",
    },
    {
      icon: "⬆",
      title: "Evolution",
      desc: "Design is never finished. I embrace iteration and curiosity as tools of progress — refining ideas until they feel inevitable.",
    },
  ];

  const expCards = lang === "pt" ? [
    {
      icon: "✦",
      period: "Out 2025 → Presente",
      role: "Product Designer · Equifax / Boa Vista",
      desc: "Liderando UX da migração cloud da plataforma legada AS400/COBOL da Boa Vista — maior banco de dados comercial do Brasil, com 350M+ registros de consumidores e 200M+ consultas mensais. Co-líder da Iris AI Community: programa interno com 44 mulheres avançando letramento em IA em produto, engenharia e operações.",
      accent: "#3DFF6E",
    },
    {
      icon: "💻",
      period: "Abr 2025 → Dez 2025",
      role: "Product Designer · Yeb Market Intelligence",
      desc: "Fundei a função de design de produto em uma empresa de 9 anos liderada por engenheiros. Liderei o redesign completo da plataforma nos setores agrícola, saúde e diesel. Estruturei a operação do zero: Design Thinking, design system Yeb no Figma, e entreguei o módulo CRM Interações — da pesquisa ao handoff.",
      accent: null,
    },
    {
      icon: "🛍️",
      period: "Jun 2023 → Mar 2025",
      role: "Product Designer · Carrefour Group",
      desc: "Primeira Product Designer do time na maior varejista do Brasil (720+ lojas, 130K+ funcionários, R$108B+ de receita anual). Projetei e entreguei 8 produtos B2B end-to-end. Reduzi a necessidade de headcount em operações de marketing de 40 para 15 pessoas — ganho de eficiência de 62%.",
      accent: null,
    },
  ] : [
    {
      icon: "✦",
      period: "Oct 2025 → Present",
      role: "Product Designer · Equifax / Boa Vista",
      desc: "Lead UX for the cloud migration of Boa Vista's legacy AS400/COBOL credit bureau platform — Brazil's largest commercial database, with 350M+ consumer records and 200M+ monthly queries. Co-lead Iris AI Community: internal program of 44 women advancing AI literacy across product, engineering, and operations.",
      accent: "#3DFF6E",
    },
    {
      icon: "💻",
      period: "Apr 2025 → Dec 2025",
      role: "Product Designer · Yeb Market Intelligence",
      desc: "Founded the product design function at a 9-year-old engineering-led company. Led the platform's full redesign across agricultural, healthcare, and diesel commodity sectors. Architected the design operation from scratch: Design Thinking, Yeb design system in Figma, and shipped the CRM Interações module from research through delivery.",
      accent: null,
    },
    {
      icon: "🛍️",
      period: "Jun 2023 → Mar 2025",
      role: "Product Designer · Carrefour Group",
      desc: "Joined as the first Product Designer within Brazil's largest retailer (720+ stores, 130K+ employees, R$108B+ annual revenue). Designed and shipped 8 B2B products end-to-end. Reduced marketing operations headcount from 40 to 15 — a 62% efficiency gain.",
      accent: null,
    },
  ];

  const expCards2 = lang === "pt" ? [
    {
      icon: "💳",
      period: "Mar 2021 → Mai 2023",
      role: "UI/UX Designer · Mooven Consulting (CIP)",
      desc: "Integrei o primeiro time de design da CIP — Câmara Interbancária de Pagamentos do Brasil. Reestruturei o design system completo end-to-end: tokens, componentes e padrões adotados em produtos bancários. Projetei e entreguei 2 portais internos e 3 portais bancários externos.",
    },
    {
      icon: "🏛️",
      period: "Mar 2020 → Mar 2021",
      role: "UX/UI Designer · Banco do Brasil",
      desc: "Contribuí para o lançamento do PIX — sistema de pagamentos instantâneos usado por 178M+ brasileiros e responsável por 54,7% de todas as transações no Brasil em 2025. Apliquei metodologia centrada no usuário na pesquisa pré-lançamento e conduzi entrevistas com gestores corporativos para mapear fricções de integração.",
    },
  ] : [
    {
      icon: "💳",
      period: "Mar 2021 → May 2023",
      role: "UI/UX Designer · Mooven Consulting (CIP)",
      desc: "Joined CIP's first design team — Brazil's national interbank payments clearinghouse. Restructured the entire design system end-to-end: tokens, components, and patterns adopted across banking products. Designed and delivered 2 internal portals and 3 external banking portals.",
    },
    {
      icon: "🏛️",
      period: "Mar 2020 → Mar 2021",
      role: "UX/UI Designer · Banco do Brasil",
      desc: "Contributed to the rollout of PIX — Brazil's instant-payments system now used by 178M+ Brazilians and accounting for 54.7% of all transactions in H2 2025. Applied user-centered methodology during pre-launch research and led conversations with corporate managers to surface integration friction.",
    },
  ];

  const awards = lang === "pt" ? [
    { year: "2019", title: "Vencedora", sub: "Ironhack Hackathon" },
    { year: "2019", title: "3º Lugar — TechStars", sub: "Startup Weekend Fashion Tech" },
  ] : [
    { year: "2019", title: "Winner", sub: "Ironhack Hackathon" },
    { year: "2019", title: "3rd Place — TechStars", sub: "Startup Weekend Fashion Tech" },
  ];

  return (
    <main className="about-main-px min-h-screen pt-24" style={{ backgroundColor: "#0A0908", paddingLeft: 68, paddingRight: 68 }}>

      {/* Header */}
      <section className="py-16" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <motion.h1
          className="uppercase"
          style={{
            fontFamily: "var(--font-bitmap)",
            fontSize: "clamp(1rem, 2vw, 2rem)",
            letterSpacing: "0.2em",
            color: "#7A7570",
            lineHeight: 1,
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0, 0, 1] }}
        >
          {lang === "pt" ? "Sobre" : "About"}
        </motion.h1>
      </section>

      {/* Main content — foto + texto */}
      <section className="grid-about-hero" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "700px" }}>

          {/* Esquerda — pinball photo, full height */}
          <div className="about-photo-col" style={{ position: "relative", minHeight: "700px" }}>
            <PinballPhoto />
          </div>

          {/* Direita — O que me move */}
          <motion.div
            style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "4rem" }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7, ease: [0.25, 0, 0, 1] }}
          >
            <p style={{ fontFamily: "var(--font-space)", fontSize: "clamp(1.2rem, 1.8vw, 1.6rem)", fontWeight: 700, color: "#F2EDE8", lineHeight: 1.2, marginBottom: "1.25rem" }}>
              {lang === "pt" ? "O que me move" : "What drives me"}
            </p>
            <p style={{ fontFamily: "var(--font-geist)", fontSize: "0.95rem", color: "#B8B3AE", lineHeight: 1.8 }}>
              {lang === "pt" ? (
                <>
                  Meu trabalho vive na interseção entre empatia e estratégia. Sou infinitamente curiosa sobre
                  o que move as pessoas e o que realmente impulsiona o crescimento. Ao unir compreensão profunda
                  do usuário com visão de negócio, crio experiências que<span style={{ color: "#3DFF6E" }}> conectam significado com resultado.</span>
                </>
              ) : (
                <>
                  My work lives at the intersection of empathy and strategy. I'm infinitely curious about
                  what moves people and what truly drives growth. By combining deep user understanding
                  with business vision, I create experiences that<span style={{ color: "#3DFF6E" }}> connect meaning with outcome.</span>
                </>
              )}
            </p>
          </motion.div>
      </section>

      {/* Conquistas */}
      <section className="" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", paddingTop: 58, paddingBottom: 58 }}>
        <motion.span
          className="block mb-12 uppercase"
          style={{ fontFamily: "var(--font-space)", fontSize: "0.6rem", letterSpacing: "0.4em", color: "#7A7570" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {lang === "pt" ? "Conquistas & Prêmios" : "Achievements & Awards"}
        </motion.span>

        <div className="flex flex-col gap-5" style={{ maxWidth: "600px", margin: "0 auto" }}>
          {awards.map((item, i) => (
            <motion.div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.25rem",
                backgroundColor: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "100px",
                padding: "1rem 1.5rem",
              }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/trophy.png" alt="" style={{ width: 120, height: 120, objectFit: "contain", flexShrink: 0, filter: "invert(1) brightness(0.55)" }} />
              <div>
                <p style={{ fontFamily: "var(--font-space)", fontSize: "1.4rem", fontWeight: 600, color: "#F2EDE8", letterSpacing: "0.02em" }}>
                  {item.year} &nbsp;{item.title}
                </p>
                <p style={{ fontFamily: "var(--font-geist)", fontSize: "1rem", color: "#7A7570", marginTop: "0.35rem" }}>
                  {item.sub}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Valores */}
      <section className="" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", paddingTop: 120, paddingBottom: 120 }}>
        <motion.p
          style={{ fontFamily: "var(--font-space)", fontSize: "clamp(1.4rem, 2.2vw, 2rem)", fontWeight: 700, color: "#F2EDE8", marginBottom: "3rem" }}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {lang === "pt" ? "O que eu valorizo" : "What I value"}
        </motion.p>

        <div className="grid-values grid grid-cols-3 gap-6">
          {values.map((item, i) => (
            <motion.div
              key={i}
              style={{
                backgroundColor: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "20px",
                padding: "2rem",
                cursor: "default",
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{
                backgroundColor: "rgba(61,255,110,0.04)",
                borderColor: "rgba(61,255,110,0.3)",
                borderRadius: "32px",
              }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.06)",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: "1.5rem", fontSize: "1.1rem",
              }}>
                {item.icon}
              </div>
              <motion.p
                style={{ fontFamily: "var(--font-space)", fontSize: "0.9rem", fontWeight: 600, marginBottom: "0.75rem" }}
                whileHover={{ color: "#3DFF6E" }}
                initial={{ color: "#F2EDE8" }}
              >
                {item.title}
              </motion.p>
              <p style={{ fontFamily: "var(--font-geist)", fontSize: "0.85rem", color: "#7A7570", lineHeight: 1.75 }}>
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Experiência Profissional */}
      <section className="" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", paddingTop: 120, paddingBottom: 120 }}>

        {/* Header 2 colunas */}
        <div className="grid-exp-header grid grid-cols-12 gap-8 mb-16">
          <motion.p
            className="col-span-5"
            style={{ fontFamily: "var(--font-space)", fontSize: "clamp(1.4rem, 2.2vw, 2rem)", fontWeight: 700, color: "#F2EDE8", lineHeight: 1.2 }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {lang === "pt" ? "Experiência Profissional" : "Professional Experience"}
          </motion.p>
          <motion.p
            className="col-span-7"
            style={{ fontFamily: "var(--font-geist)", fontSize: "0.95rem", color: "#B8B3AE", lineHeight: 1.75 }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {lang === "pt"
              ? "Construí uma carreira multidisciplinar enraizada na curiosidade, no pensamento estratégico e na busca incansável por clareza — usando o design como ponte entre dados, tecnologia e emoção."
              : "I've built a multidisciplinary career rooted in curiosity, strategic thinking, and the relentless pursuit of clarity — using design as a bridge between data, technology, and emotion."}
          </motion.p>
        </div>

        {/* Cards de experiência */}
        <div className="grid-exp grid grid-cols-3 gap-6">
          {expCards.map((item, i) => (
            <motion.div
              key={i}
              style={{
                backgroundColor: i === 0 ? "rgba(61,255,110,0.04)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${i === 0 ? "rgba(61,255,110,0.2)" : "rgba(255,255,255,0.07)"}`,
                borderRadius: "4px",
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
                <span style={{ fontFamily: "var(--font-space)", fontSize: "0.8rem", fontWeight: 600, color: i === 0 ? "#3DFF6E" : "#F2EDE8", letterSpacing: "0.02em" }}>
                  {item.period}
                </span>
              </div>
              {item.role && (
                <p style={{ fontFamily: "var(--font-space)", fontSize: "0.7rem", letterSpacing: "0.05em", color: "#7A7570", textTransform: "uppercase" }}>
                  {item.role}
                </p>
              )}
              <p style={{ fontFamily: "var(--font-geist)", fontSize: "0.85rem", color: "#B8B3AE", lineHeight: 1.75, whiteSpace: "pre-line" }}>
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Segunda linha */}
        <div className="grid grid-cols-2 gap-6 mt-6">
          {expCards2.map((item, i) => (
            <motion.div
              key={i}
              style={{
                backgroundColor: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "4px",
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
                <span style={{ fontFamily: "var(--font-space)", fontSize: "0.8rem", fontWeight: 600, color: "#F2EDE8", letterSpacing: "0.02em" }}>
                  {item.period}
                </span>
              </div>
              <p style={{ fontFamily: "var(--font-space)", fontSize: "0.7rem", letterSpacing: "0.05em", color: "#7A7570", textTransform: "uppercase" }}>
                {item.role}
              </p>
              <p style={{ fontFamily: "var(--font-geist)", fontSize: "0.85rem", color: "#B8B3AE", lineHeight: 1.75 }}>
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

    </main>
  );
}
