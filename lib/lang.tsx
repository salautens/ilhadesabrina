"use client";
import { createContext, useContext, useState } from "react";

export type Lang = "pt" | "en";

interface LangCtx { lang: Lang; toggle: () => void; }
const LangContext = createContext<LangCtx>({ lang: "pt", toggle: () => {} });

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("pt");
  return (
    <LangContext.Provider value={{ lang, toggle: () => setLang(l => l === "pt" ? "en" : "pt") }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
