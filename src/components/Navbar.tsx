"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Radio, Ambulance, Building2, MapPin, Activity } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Command Hub", href: "/", icon: Shield },
    { name: "Citizen Report", href: "/citizen", icon: Radio },
    { name: "First Responder", href: "/responder", icon: Ambulance },
    { name: "Hospital Trauma", href: "/hospital", icon: Building2 },
    { name: "City Authority", href: "/authority", icon: Activity },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-ink-700/60 bg-ink-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-signal-teal to-ink-900 border border-signal-teal/40 flex items-center justify-center text-white shadow-lg shadow-signal-teal/20 group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5 text-signal-teal" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-2xl tracking-wider uppercase font-bold text-white">
                Urban<span className="text-signal-teal">Shield</span>
              </span>
              <span className="text-[10px] tracking-widest uppercase font-mono px-1.5 py-0.5 rounded bg-signal-teal/10 border border-signal-teal/30 text-signal-teal">
                Metropolis
              </span>
            </div>
            <p className="text-[11px] text-mist-400 font-sans -mt-1 hidden sm:block">
              AI Emergency Fusion System
            </p>
          </div>
        </Link>

        {/* Navigation Desks */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? "bg-ink-800 text-signal-teal border border-signal-teal/40 shadow-sm"
                    : "text-mist-300 hover:text-white hover:bg-ink-800/60"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-signal-teal" : "text-mist-400"}`} />
                <span className="hidden md:inline">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Live System Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-ink-900 border border-ink-700/80 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-signal-lime animate-pulse" />
          <span className="text-mist-300">GRID: </span>
          <span className="text-signal-lime font-semibold">SYNCHRONIZED</span>
        </div>
      </div>
    </header>
  );
}
