"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";
import VisionSwitcher from "./VisionSwitcher";

const links = [
  { href: "/", label: "Home", en: "Home" },
  { href: "/work", label: "Case", en: "Case" },
  { href: "/about", label: "Sobre", en: "Sobre" },
];

const SCAN_DURATION = 0.35;

export default function Nav() {
  const pathname = usePathname();
  const [hovered, setHovered] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6"
      style={{
        backgroundColor: "rgba(10,9,8,0.92)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <span
          className="font-bold text-sm uppercase"
          style={{
            fontFamily: "var(--font-space)",
            letterSpacing: "0.4em",
            position: "relative",
            display: "inline-block",
          }}
        >
          {/* Spacer — keeps width stable */}
          <span style={{ visibility: "hidden" }}>AI PRODUCT BUILDER</span>

          {/* DESIGN — exits top-to-bottom on hover */}
          <motion.span
            style={{ position: "absolute", top: 0, left: 0, color: "#F2EDE8", whiteSpace: "nowrap" }}
            animate={{ clipPath: hovered ? "inset(100% 0 0% 0)" : "inset(0% 0 0% 0)" }}
            transition={{ duration: SCAN_DURATION, ease: "linear" }}
          >
            DESIGN
          </motion.span>

          {/* AI PRODUCT BUILDER — enters top-to-bottom on hover */}
          <motion.span
            style={{ position: "absolute", top: 0, left: 0, color: "#3DFF6E", whiteSpace: "nowrap" }}
            animate={{ clipPath: hovered ? "inset(0% 0 0% 0)" : "inset(0% 0 100% 0)" }}
            transition={{ duration: SCAN_DURATION, ease: "linear" }}
          >
            AI PRODUCT BUILDER
          </motion.span>
        </span>
      </Link>

      {/* Links + Vision Switcher */}
      <div className="flex items-center gap-10">
        {links.map(({ href, label, en }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} className="relative group">
              <span
                className="text-xs uppercase transition-colors duration-200"
                style={{
                  fontFamily: "var(--font-space)",
                  letterSpacing: "0.25em",
                  color: active ? "#3DFF6E" : "#7A7570",
                }}
              >
                {en}
              </span>
              {active && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -bottom-1 left-0 right-0 h-[1px]"
                  style={{ backgroundColor: "#3DFF6E" }}
                  transition={{ type: "spring", stiffness: 400, damping: 40 }}
                />
              )}
            </Link>
          );
        })}

        {/* Vision accessibility switcher */}
        <VisionSwitcher />
      </div>
    </nav>
  );
}
