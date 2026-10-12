import Link from "next/link";
import { getStoreData } from "@/lib/store";
import {
  ShieldAlert,
  Radio,
  Ambulance,
  Building2,
  Activity,
  ArrowRight,
  TrendingUp,
  Cpu,
  Zap,
  CheckCircle2,
} from "lucide-react";

export const revalidate = 0;

export default async function HomePage() {
  const { incidents, signals, units, hospitals } = getStoreData();

  const criticalCount = incidents.filter((i) => i.assessment.severity === "CRITICAL").length;
  const activeDispatchedCount = incidents.filter((i) => i.status === "DISPATCHED" || i.status === "ON_SCENE").length;
  const availableUnitsCount = units.filter((u) => u.status === "AVAILABLE").length;
  const totalBedsAvailable = hospitals.reduce((acc, h) => acc + h.erBedsAvailable, 0);

  const desks = [
    {
      title: "Citizen Desk",
      route: "/citizen",
      badge: "Public Access",
      badgeColor: "bg-signal-teal/10 text-signal-teal border-signal-teal/30",
      icon: Radio,
      description: "Report emergencies with instant real-time AI severity assessment, photo upload & live dispatch tracking.",
      actionText: "Report Incident",
      stats: "Average Triage Latency: 1.4s",
    },
    {
      title: "First Responder Board",
      route: "/responder",
      badge: "Tactical Units",
      badgeColor: "bg-signal-amber/10 text-signal-amber border-signal-amber/30",
      icon: Ambulance,
      description: "Live dispatch queue, tactical GPS routing, turn-by-turn casualty notes & on-scene status controls.",
      actionText: "Open Dispatch Board",
      stats: `${availableUnitsCount} / ${units.length} Units Available`,
    },
    {
      title: "Hospital Trauma Hub",
      route: "/hospital",
      badge: "Medical Command",
      badgeColor: "bg-signal-coral/10 text-signal-coral border-signal-coral/30",
      icon: Building2,
      description: "Trauma pre-alerts, incoming ambulance ETA countdowns, surgical room staging & ICU/ER capacity management.",
      actionText: "Monitor Trauma Network",
      stats: `${totalBedsAvailable} Trauma ER Beds Open`,
    },
    {
      title: "City Authority Center",
      route: "/authority",
      badge: "Municipal Control",
      badgeColor: "bg-signal-lime/10 text-signal-lime border-signal-lime/30",
      icon: Activity,
      description: "Holistic Metropolis command grid, acoustic gunshot/crash detection, CCTV AI smoke alarms & city-wide broadcast alerts.",
      actionText: "Access City Feeds",
      stats: `${signals.length} Active Sensor Feeds`,
    },
  ];

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-ink-950 overflow-hidden">
      {/* Decorative Grid and Lighting Wash */}
      <div className="absolute inset-0 bg-city-grid opacity-20 pointer-events-none" />
      <div className="absolute -top-40 right-0 w-[550px] h-[550px] bg-signal-teal/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-signal-coral/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 pb-10 border-b border-ink-800/80">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-signal-teal/10 border border-signal-teal/30 text-signal-teal text-xs font-mono uppercase tracking-widest mb-4">
              <Zap className="w-3.5 h-3.5 animate-pulse" />
              Metropolis Municipal Intelligence V4
            </div>
            <h1 className="text-4xl sm:text-6xl font-display uppercase tracking-tight text-white font-bold leading-none">
              Urban<span className="text-signal-teal">Shield</span> Emergency Fusion Core
            </h1>
            <p className="mt-4 text-base sm:text-lg text-mist-300 leading-relaxed max-w-2xl">
              Unified emergency orchestration platform. Detect incidents through sensor arrays, compute AI severity in milliseconds, and orchestrate citizens, first responders, trauma centers, and city authorities on a single synchronized canvas.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="w-full lg:w-auto grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 min-w-[280px]">
            <div className="p-4 rounded-xl bg-ink-900/90 border border-ink-800 backdrop-blur-md">
              <div className="text-xs font-mono text-mist-400 uppercase">Critical Threats</div>
              <div className="text-3xl font-display font-bold text-signal-coral flex items-center gap-2 mt-1">
                {criticalCount}
                <span className="w-2 h-2 rounded-full bg-signal-coral animate-ping" />
              </div>
            </div>
            <div className="p-4 rounded-xl bg-ink-900/90 border border-ink-800 backdrop-blur-md">
              <div className="text-xs font-mono text-mist-400 uppercase">Active Dispatch</div>
              <div className="text-3xl font-display font-bold text-signal-amber mt-1">
                {activeDispatchedCount}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-ink-900/90 border border-ink-800 backdrop-blur-md">
              <div className="text-xs font-mono text-mist-400 uppercase">Available Units</div>
              <div className="text-3xl font-display font-bold text-signal-lime mt-1">
                {availableUnitsCount}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-ink-900/90 border border-ink-800 backdrop-blur-md">
              <div className="text-xs font-mono text-mist-400 uppercase">IoT Sensors Online</div>
              <div className="text-3xl font-display font-bold text-signal-teal mt-1">
                1,420
              </div>
            </div>
          </div>
        </div>

        {/* Four Role Desks Cards */}
        <div className="py-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-display uppercase tracking-wider text-white font-bold">
                Operational Desks
              </h2>
              <p className="text-xs text-mist-400 font-mono">
                Select your assigned workstation role to access role-specific workflows
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {desks.map((desk) => {
              const Icon = desk.icon;
              return (
                <Link
                  key={desk.route}
                  href={desk.route}
                  className="group relative p-6 rounded-2xl bg-ink-900/60 border border-ink-800 hover:border-signal-teal/50 hover:bg-ink-850/80 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-signal-teal/10"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-signal-teal/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-ink-800 border border-ink-700 flex items-center justify-center text-signal-teal group-hover:border-signal-teal/60 group-hover:scale-105 transition-all">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span
                        className={`text-xs font-mono px-2.5 py-1 rounded-full border ${desk.badgeColor}`}
                      >
                        {desk.badge}
                      </span>
                    </div>

                    <h3 className="text-2xl font-display uppercase tracking-wide font-bold text-white group-hover:text-signal-teal transition-colors">
                      {desk.title}
                    </h3>
                    <p className="text-sm text-mist-300 mt-2 leading-relaxed">
                      {desk.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-ink-800/80 flex items-center justify-between">
                    <span className="text-xs font-mono text-mist-400">
                      {desk.stats}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-signal-teal group-hover:translate-x-1 transition-transform">
                      {desk.actionText}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Live Active Incidents Feed Snapshot */}
        <div className="pt-6 pb-12">
          <div className="p-6 rounded-2xl bg-ink-900/90 border border-ink-800/90 backdrop-blur-md">
            <div className="flex items-center justify-between pb-4 border-b border-ink-800">
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 text-signal-coral" />
                <h3 className="text-lg font-display uppercase font-bold text-white tracking-wider">
                  Live Incidents Stream
                </h3>
              </div>
              <span className="text-xs font-mono text-mist-400">
                Auto-refreshed from memory store
              </span>
            </div>

            <div className="divide-y divide-ink-800/60 mt-2">
              {incidents.map((incident) => (
                <div
                  key={incident.id}
                  className="py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-ink-800/30 px-3 rounded-lg transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-mist-400 font-bold">
                        {incident.id}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                          incident.assessment.severity === "CRITICAL"
                            ? "bg-signal-coral/20 text-signal-coral border border-signal-coral/40"
                            : "bg-signal-amber/20 text-signal-amber border border-signal-amber/40"
                        }`}
                      >
                        {incident.assessment.severity} ({incident.assessment.score}/100)
                      </span>
                      <span className="text-xs text-signal-teal font-mono">
                        Status: {incident.status}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-white">
                      {incident.title}
                    </div>
                    <div className="text-xs text-mist-300">
                      📍 {incident.location} — {incident.description.slice(0, 110)}...
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-auto">
                    <Link
                      href={`/responder`}
                      className="text-xs px-3 py-1.5 rounded-lg bg-ink-800 border border-ink-700 hover:border-signal-teal text-mist-200 hover:text-white transition-all font-mono"
                    >
                      Track Dispatch →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
