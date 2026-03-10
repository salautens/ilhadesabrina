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
    title: "Arquitetura de Informação",
    desc: "Estrutura de painéis reorganizada com hierarquia clara, agrupamento lógico e padrões de navegação contextual.",
  },
  {
    num: "02",
    title: "Fluxos Simplificados",
    desc: "Mapeamos e otimizamos jornadas críticas — gestão de pedidos, rastreamento de posições e visualização de dados de mercado.",
  },
  {
    num: "03",
    title: "Biblioteca de Componentes",
    desc: "Componentes modulares construídos com shadcn/ui como base, com implementação consistente em toda a plataforma.",
  },
  {
    num: "04",
    title: "Sistema de Onboarding",
    desc: "Experiência estruturada de primeiro uso que reduz a dependência de treinamento humano e acelera a produtividade.",
  },
  {
    num: "05",
    title: "Validação Iterativa",
    desc: "Ciclos contínuos de testes com usuários reais, aprendizados documentados e refinamento guiado por protótipos.",
  },
];

const screens = [
  {
    src: "/so5/dashboard-commodities.png",
    title: "Base de Dados — Commodities Energéticas",
    desc: "Camada de dados unificada com tickers em tempo real (Câmbio, Brent, Gás, Carvão). Analistas gerenciam dados Nacionais, Internacionais, Importação, Frete e Geral em uma única superfície.",
  },
  {
    src: "/so5/analise-paridade.png",
    title: "Análise de Paridade",
    desc: "Calculadora de paridade com toggle diário/semanal. Usuários configuram tipo de cálculo, base e câmbio — e visualizam preço de importação versus média nacional lado a lado em tempo real.",
  },
  {
    src: "/so5/motor-grafico.png",
    title: "Motor de Gráfico",
    desc: "Motor gráfico sob demanda. De matriz de risco a séries temporais — usuários constroem visualizações diretamente dos seus modelos de dados, configuradas em tempo real.",
  },
  {
    src: "/so5/base-dados.png",
    title: "Gerenciamento — Marcas e Produtos",
    desc: "Gestão de dados internos e externos com toggle card/lista. Cada entrada de marca se conecta a produtos, segmentos, colaboradores e modelos de precificação.",
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

      {/* ── VOLTAR ── */}
      <div className="px-8 py-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <Link href="/work">
          <span
            className="uppercase transition-colors"
            style={{ fontFamily: "var(--font-space)", fontSize: "0.6rem", letterSpacing: "0.3em", color: "#7A7570" }}
          >
            ← Trabalhos
          </span>
        </Link>
      </div>

      {/* ── HERO ── */}
      <section className="px-8 py-44" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
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
              01 · Design de Produto · YEB · 2024
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
              Transformando uma plataforma legada de trading de commodities em uma experiência
              moderna e escalável. Do sistema legado ao design system.
            </p>
          </motion.div>

          <motion.div
            className="so5-col-4 col-span-4 flex flex-col gap-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {[
              { label: "Cliente", value: "YEB" },
              { label: "Escopo", value: "Design de produto end-to-end" },
              { label: "Contexto", value: "Trading de commodities · Agronegócio" },
              { label: "Entrega", value: "Design system + plataforma completa" },
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

      {/* ── TENSÃO CENTRAL ── */}
      <section className="px-8 py-40" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
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
            Tensão Central
          </span>
          <p
            style={{
              fontFamily: "var(--font-space)",
              fontSize: "clamp(1.1rem, 2.5vw, 1.8rem)",
              fontWeight: 300,
              color: "#F2EDE8",
            }}
          >
            Usuários especialistas com modelos mentais arraigados
            <br />
            vs. necessidade do negócio de uma infraestrutura moderna e escalável.
          </p>
        </motion.div>
      </section>

      {/* ── PROBLEMA ── */}
      <section className="px-8 py-44" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="so5-hero-grid grid grid-cols-12 gap-12 mb-20">
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
              O Problema
            </span>
            <h2
              className="font-medium mb-6"
              style={{ fontFamily: "var(--font-space)", fontSize: "1.6rem", color: "#F2EDE8", lineHeight: 1.3 }}
            >
              Uma plataforma construída para o fluxo de trabalho de ontem
            </h2>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "#B8B3AE" }}>
              A plataforma SO5 carregava anos de complexidade acumulada. Traders de commodities e analistas
              agrícolas navegavam em interfaces densas e pouco intuitivas, herdadas de sistemas legados AS/400
              — criando gargalos críticos em decisões de mercado sensíveis ao tempo.
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
                beforeImage="/so5/legacy-produtos.png"
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
              Por Que Isso Importava
            </span>
            <div className="space-y-0">
              {[
                "Central às operações de trading de commodities e inteligência de mercado da YEB",
                "O atrito da interface impactava diretamente a velocidade de decisão em mercados voláteis",
                "A modernização era necessária para escalar o produto e integrar clientes de forma independente",
                "Grande lacuna entre a sofisticação dos dados e a capacidade do usuário de acessá-los com fluidez",
                "O sistema legado criava gargalos de desenvolvimento a cada nova solicitação de funcionalidade",
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

      {/* ── RESTRIÇÕES ── */}
      <section className="px-8 py-40" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", backgroundColor: "rgba(255,255,255,0.02)" }}>
        <span
          className="block mb-12 uppercase"
          style={{ fontFamily: "var(--font-space)", fontSize: "0.6rem", letterSpacing: "0.4em", color: "#7A7570" }}
        >
          Trabalhando com a Realidade
        </span>
        <div className="so5-pillars grid grid-cols-3 gap-0">
          {[
            { label: "Dívida Técnica Legada", detail: "Redesign incremental obrigatório — não podíamos quebrar fluxos de produção existentes." },
            { label: "Base de Usuários Especialistas", detail: "Alta resistência à mudança de usuários experientes com memória muscular consolidada." },
            { label: "Entrega Paralela", detail: "Design system + entrega de telas simultaneamente dentro de prazos apertados." },
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

      {/* ── ARQUITETURA DE INFORMAÇÃO ── */}
      <section className="px-8 py-44" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <motion.span
          className="block mb-10 uppercase"
          style={{ fontFamily: "var(--font-space)", fontSize: "0.6rem", letterSpacing: "0.4em", color: "#7A7570" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Arquitetura de Informação
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
            alt="Arquitetura de Informação SO5 — sitemap completo"
            width={1600}
            height={600}
            className="w-full h-auto"
            style={{ display: "block" }}
          />
        </motion.div>
        <p className="mt-4 text-xs" style={{ color: "#7A7570", fontFamily: "var(--font-space)", letterSpacing: "0.2em" }}>
          Sitemap completo da plataforma — Dash → Motor de Cálculo → Motor Gráfico · Base de Dados · Conteúdo · Gerenciamento
        </p>
      </section>

      {/* ── PILARES DE DESIGN ── */}
      <motion.section
        ref={pillarsRef}
        className="px-8 py-56 transition-colors duration-1000"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          backgroundColor: pillarBg as any,
        }}
      >
        <span
          className="block mb-16 uppercase"
          style={{ fontFamily: "var(--font-space)", fontSize: "0.6rem", letterSpacing: "0.4em", color: "#7A7570" }}
        >
          Abordagem — 5 Pilares de Design
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

      {/* ── TELAS ── */}
      <section className="px-8 py-44" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <span
          className="block mb-16 uppercase"
          style={{ fontFamily: "var(--font-space)", fontSize: "0.6rem", letterSpacing: "0.4em", color: "#7A7570" }}
        >
          Projetado para Performance
        </span>

        <div className="space-y-32">
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

      {/* ── RESULTADOS ── */}
      <section className="px-8 py-44" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <span
          className="block mb-16 uppercase"
          style={{ fontFamily: "var(--font-space)", fontSize: "0.6rem", letterSpacing: "0.4em", color: "#7A7570" }}
        >
          Resultados
        </span>
        <div className="so5-pillars grid grid-cols-4 gap-0">
          {[
            { value: "Zero", label: "dependência de TI nas operações diárias" },
            { value: "5 pilares", label: "entregues em um único design system" },
            { value: "Independente", label: "onboarding de clientes — sem treinamento humano" },
            { value: "A→Z", label: "ownership end-to-end de cada módulo" },
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

      {/* ── NAV INFERIOR ── */}
      <section className="px-8 py-32 flex items-center justify-between">
        <Link href="/work">
          <span
            className="uppercase transition-colors"
            style={{ fontFamily: "var(--font-space)", fontSize: "0.6rem", letterSpacing: "0.3em", color: "#7A7570" }}
          >
            ← Todos os trabalhos
          </span>
        </Link>
        <Link href="/contact">
          <span
            className="uppercase transition-colors"
            style={{ fontFamily: "var(--font-space)", fontSize: "0.6rem", letterSpacing: "0.3em", color: "#F2EDE8" }}
          >
            Iniciar um projeto →
          </span>
        </Link>
      </section>
    </main>
  );
}
