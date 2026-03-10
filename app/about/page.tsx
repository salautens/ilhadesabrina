"use client";

import { motion, useMotionValue, useAnimationFrame } from "framer-motion";
import { useRef, useEffect, useState } from "react";

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

const BALL = 180; // diameter px
const SPEED = 2.8;

function PinballPhoto() {
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
        {/* Ping rings — visíveis só no estado idle */}
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
        {/* Tooltip */}
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
          {isActive ? "[ PARAR ]" : "[ ANIMAR ]"}
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
        Oi, eu sou a Sabrina
      </span>
    </div>
  );
}

const skills = [
  { area: "Research & Strategy", items: ["User Research", "Jobs-to-be-done", "Competitive Analysis", "Trend Mapping"] },
  { area: "Design & Systems", items: ["UX Architecture", "UI Design", "Design Systems", "Prototyping"] },
  { area: "Tools", items: ["Figma", "Maze", "Hotjar", "Notion", "Jira"] },
  { area: "Context", items: ["B2B SaaS", "Fintech", "Startups", "Enterprise"] },
];

export default function About() {
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
          About
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
              O que me move
            </p>
            <p style={{ fontFamily: "var(--font-geist)", fontSize: "0.95rem", color: "#B8B3AE", lineHeight: 1.8 }}>
              Meu trabalho vive na interseção entre empatia e estratégia. Sou infinitamente curiosa sobre
              o que move as pessoas e o que realmente impulsiona o crescimento. Ao unir compreensão profunda
              do usuário com visão de negócio, crio experiências que<span style={{ color: "#3DFF6E" }}> conectam significado com resultado.</span>
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
          Conquistas &amp; Prêmios
        </motion.span>

        <div className="flex flex-col gap-5" style={{ maxWidth: "600px", margin: "0 auto" }}>
          {[
            { year: "2019", title: "Vencedora", sub: "Ironhack Hackathon" },
            { year: "2019", title: "3º Lugar — TechStars", sub: "Startup Weekend Fashion Tech" },
          ].map((item, i) => (
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
          O que eu valorizo
        </motion.p>

        <div className="grid-values grid grid-cols-3 gap-6">
          {[
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
          ].map((item, i) => (
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
            Experiência Profissional
          </motion.p>
          <motion.p
            className="col-span-7"
            style={{ fontFamily: "var(--font-geist)", fontSize: "0.95rem", color: "#B8B3AE", lineHeight: 1.75 }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Construí uma carreira multidisciplinar enraizada na curiosidade, no pensamento estratégico e na busca incansável por clareza — usando o design como ponte entre dados, tecnologia e emoção.
          </motion.p>
        </div>

        {/* Cards de experiência */}
        <div className="grid-exp grid grid-cols-3 gap-6">
          {[
            {
              icon: "✦",
              period: "Sua empresa, a seguir",
              role: "",
              desc: "Vamos construir o próximo capítulo.\n\nTrago clareza de design, pensamento sistêmico e colaboração multifuncional para transformar complexidade em crescimento escalável e centrado nas pessoas.",
              accent: "#3DFF6E",
            },
            {
              icon: "💻",
              period: "Presente → 2025",
              role: "Product Designer · YEB Market Intelligence",
              desc: "Liderando a estratégia de experiência para plataformas de inteligência de dados. Estruturo workflows, frameworks de research e design systems que tornam a informação mais intuitiva, acionável e humana — conectando design, dados e decisão em escala enterprise.",
              accent: null,
            },
            {
              icon: "🛍️",
              period: "2024 → 2021",
              role: "Product Designer · K2 Solutions – Grupo Carrefour",
              desc: "Atuei na transformação digital do Carrefour lançando 8 produtos B2B enterprise e criando um Design System em Figma para escalar a colaboração. Aprendi a alinhar design com impacto de negócio, orquestrar times e manter precisão em ecossistemas complexos.",
              accent: null,
            },
          ].map((item, i) => (
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
        <div className="grid grid-cols-3 gap-6 mt-6">
          {[
            {
              icon: "💳",
              period: "2023 → 2021",
              role: "UI/UX Designer · Mooven Consulting",
              desc: "Na Mooven, desenhei interfaces seguras e eficientes para sistemas financeiros e enterprise, incluindo o CIP (Sistema de Pagamentos Interbancários Brasileiro). Estabeleci frameworks de documentação que melhoraram a comunicação com stakeholders e aceleraram a entrega em projetos de transformação digital.",
            },
            {
              icon: "🏛️",
              period: "2021",
              role: "UX/UI Designer · Banco do Brasil",
              desc: "Contribuí para a revolução dos pagamentos digitais no Brasil desenhando experiências centradas no usuário para o PIX — o primeiro sistema de transferência instantânea do país, usado por milhões diariamente. Meu trabalho focou em research e clareza, simplificando dados complexos e garantindo acessibilidade para um público nacional.",
            },
            {
              icon: "🍴",
              period: "2020 → 2019",
              role: "UX/UI Designer · Sapore",
              desc: "Desenhei produtos digitais que conectaram tecnologia e design de serviço em operações alimentares de grande escala. Liderei um sistema de segurança com IA para detecção de EPIs e criei uma plataforma digital de pedidos que melhorou eficiência, segurança e experiência em ambientes do dia a dia.",
            },
          ].map((item, i) => (
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
