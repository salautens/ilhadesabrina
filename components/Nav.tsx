"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-8 py-6"
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
            <span style={{ visibility: "hidden" }}>AI PRODUCT BUILDER</span>
            <motion.span
              style={{ position: "absolute", top: 0, left: 0, color: "#F2EDE8", whiteSpace: "nowrap" }}
              animate={{ clipPath: hovered ? "inset(100% 0 0% 0)" : "inset(0% 0 0% 0)" }}
              transition={{ duration: SCAN_DURATION, ease: "linear" }}
            >
              DESIGN
            </motion.span>
            <motion.span
              style={{ position: "absolute", top: 0, left: 0, color: "#3DFF6E", whiteSpace: "nowrap" }}
              animate={{ clipPath: hovered ? "inset(0% 0 0% 0)" : "inset(0% 0 100% 0)" }}
              transition={{ duration: SCAN_DURATION, ease: "linear" }}
            >
              AI PRODUCT BUILDER
            </motion.span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-10">
          {links.map(({ href, en }) => {
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
          <VisionSwitcher />
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <motion.span
            animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 7 : 0 }}
            style={{ display: "block", width: 22, height: 1.5, backgroundColor: "#F2EDE8" }}
          />
          <motion.span
            animate={{ opacity: menuOpen ? 0 : 1 }}
            style={{ display: "block", width: 22, height: 1.5, backgroundColor: "#F2EDE8" }}
          />
          <motion.span
            animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -7 : 0 }}
            style={{ display: "block", width: 22, height: 1.5, backgroundColor: "#F2EDE8" }}
          />
        </button>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: "fixed", inset: 0, zIndex: 40,
              backgroundColor: "rgba(10,9,8,0.97)",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: "2.5rem",
            }}
          >
            {links.map(({ href, en }, i) => (
              <motion.div
                key={href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <Link
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    fontFamily: "var(--font-space)",
                    fontSize: "2rem",
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    color: pathname === href ? "#3DFF6E" : "#F2EDE8",
                    textTransform: "uppercase",
                    textDecoration: "none",
                  }}
                >
                  {en}
                </Link>
              </motion.div>
            ))}
            <div className="mt-4">
              <VisionSwitcher />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
