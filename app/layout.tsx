import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Space_Grotesk, Press_Start_2P } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Cursor from "@/components/Cursor";
import Footer from "@/components/Footer";
import { VisionProvider } from "@/components/VisionProvider";
import VisionFilters from "@/components/VisionFilters";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const pressStart = Press_Start_2P({
  variable: "--font-bitmap",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "SA-BRINA — UX/UI Designer",
  description: "Design que transforma caos em calma operacional. Products for humans who operate at scale.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${spaceGrotesk.variable} ${pressStart.variable} antialiased`}>
        {/* SVG filter defs for colorblind simulation — must be in DOM */}
        <VisionFilters />
        <VisionProvider>
          <Cursor />
          <Nav />
          {children}
          <Footer />
        </VisionProvider>
      </body>
    </html>
  );
}
