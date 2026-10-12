import type { Metadata } from "next";
import { Teko, Figtree, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const teko = Teko({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-teko",
});

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-figtree",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-mono",
});

export const metadata: Metadata = {
  title: "UrbanShield — AI Emergency Coordination for Metropolis",
  description:
    "Detect incidents from live city signals, score severity with AI fusion, and coordinate citizens, responders, hospitals, and city authorities.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${teko.variable} ${figtree.variable} ${ibmPlexMono.variable} bg-ink-950 text-mist-50 antialiased min-h-screen flex flex-col`}
      >
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-ink-800 bg-ink-950 py-6 text-center text-xs text-mist-400 font-mono">
          <p>URBANSHIELD AI DISPATCH CORE // METROPOLIS MUNICIPAL AUTONOMY SYSTEM // 24/7 ACTIVE RADAR</p>
        </footer>
      </body>
    </html>
  );
}
