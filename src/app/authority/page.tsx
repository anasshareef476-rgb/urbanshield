"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  Radio,
  Eye,
  Wind,
  Gauge,
  AlertTriangle,
  RefreshCw,
  BellRing,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { CitySignal } from "@/types";

export default function AuthorityDesk() {
  const [signals, setSignals] = useState<CitySignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [alertLevel, setAlertLevel] = useState<"NORMAL" | "ADVISORY" | "WARNING" | "CRISIS">("WARNING");
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState(
    "METROPOLIS CIVIC ADVISORY: Traffic rerouting active near Flyover Junction 9B. Emergency corridors reserved for medical dispatch."
  );

  const fetchSignals = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/city-feeds");
      if (res.ok) {
        const data = await res.json();
        setSignals(data.signals || []);
      }
    } catch (err) {
      console.error("Failed to load signals", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSignals();
    const interval = setInterval(fetchSignals, 9000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 5000);
  };

  // 16 Grid Sectors representing Metropolis
  const sectors = Array.from({ length: 16 }).map((_, i) => {
    const sectorNum = i + 1;
    const hasCritical = sectorNum === 4 || sectorNum === 9;
    const hasWarning = sectorNum === 12;
    return {
      id: `SEC-${sectorNum}`,
      name: `Sector ${sectorNum}`,
      status: hasCritical ? "CRITICAL" : hasWarning ? "ELEVATED" : "OPTIMAL",
    };
  });

  return (
    <div className="min-h-screen bg-ink-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-signal-lime/10 border border-signal-lime/30 text-signal-lime text-xs font-mono uppercase tracking-wider mb-2">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              Metropolis Municipal Authority Desk
            </div>
            <h1 className="text-3xl sm:text-5xl font-display uppercase font-bold text-white tracking-tight">
              City Command & Telemetry Grid
            </h1>
            <p className="text-sm text-mist-300 mt-1">
              Real-time acoustic gunshot/impact sensors, AI CCTV thermal smoke recognition, traffic loop telemetry & civil broadcast.
            </p>
          </div>

          <button
            onClick={fetchSignals}
            disabled={loading}
            className="self-start sm:self-center px-4 py-2 rounded-xl bg-ink-900 border border-ink-700 hover:border-signal-lime text-xs font-mono text-mist-200 flex items-center gap-2 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh Telemetry
          </button>
        </div>

        {/* Municipal Alert Status Selector */}
        <div className="p-4 rounded-2xl bg-ink-900 border border-ink-800 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-mist-400 uppercase">
              Current City Readiness Level:
            </span>
            <span
              className={`text-xs font-mono px-3 py-1 rounded-full font-bold uppercase border ${
                alertLevel === "CRISIS"
                  ? "bg-signal-coral/20 border-signal-coral text-signal-coral"
                  : alertLevel === "WARNING"
                  ? "bg-signal-amber/20 border-signal-amber text-signal-amber"
                  : alertLevel === "ADVISORY"
                  ? "bg-signal-teal/20 border-signal-teal text-signal-teal"
                  : "bg-signal-lime/20 border-signal-lime text-signal-lime"
              }`}
            >
              ● {alertLevel} DEFENSE STATUS
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {(["NORMAL", "ADVISORY", "WARNING", "CRISIS"] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setAlertLevel(lvl)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                  alertLevel === lvl
                    ? "bg-ink-750 text-white border border-signal-teal shadow-sm"
                    : "bg-ink-950 text-mist-400 hover:text-white"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Map and Live Feeds */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* Tactical Sector Map Matrix (Left) */}
          <div className="lg:col-span-6 p-6 rounded-2xl bg-ink-900/90 border border-ink-800 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-ink-800 mb-4">
              <h3 className="text-sm font-display uppercase tracking-wider font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-signal-teal" />
                Metropolis 16-Sector Tactical Grid
              </h3>
              <span className="text-[10px] font-mono text-mist-400">
                Live Spatial Heat
              </span>
            </div>

            <div className="grid grid-cols-4 gap-3 aspect-square max-h-[380px] w-full">
              {sectors.map((sec) => (
                <div
                  key={sec.id}
                  className={`rounded-xl p-2.5 flex flex-col justify-between border transition-all ${
                    sec.status === "CRITICAL"
                      ? "bg-signal-coral/20 border-signal-coral text-signal-coral animate-pulse"
                      : sec.status === "ELEVATED"
                      ? "bg-signal-amber/20 border-signal-amber text-signal-amber"
                      : "bg-ink-950/70 border-ink-800 text-mist-400 hover:border-signal-teal/40"
                  }`}
                >
                  <span className="font-mono text-[10px] font-bold">{sec.id}</span>
                  <div>
                    <div className="text-[11px] font-semibold text-white">{sec.name}</div>
                    <div className="text-[9px] font-mono uppercase">{sec.status}</div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[11px] font-mono text-mist-400 mt-4 text-center">
              Active Incident Hotspots: Sector 4 (Impact Debris) & Sector 9 (Smoke Column)
            </p>
          </div>

          {/* Live Sensor Telemetry (Right) */}
          <div className="lg:col-span-6 p-6 rounded-2xl bg-ink-900/90 border border-ink-800 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-ink-800 mb-4">
              <h3 className="text-sm font-display uppercase tracking-wider font-bold text-white flex items-center gap-2">
                <Gauge className="w-4 h-4 text-signal-lime" />
                Live Sensor Telemetry Array ({signals.length})
              </h3>
              <span className="text-[10px] font-mono text-signal-lime">
                ● 1,420 ONLINE
              </span>
            </div>

            <div className="space-y-3">
              {signals.map((sig) => (
                <div
                  key={sig.id}
                  className="p-3.5 rounded-xl bg-ink-950 border border-ink-800 flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-ink-800 text-signal-teal font-bold">
                        {sig.source}
                      </span>
                      <span className="text-xs text-mist-400 font-mono">
                        {sig.location}
                      </span>
                    </div>
                    <p className="text-xs text-white font-medium">
                      {sig.value}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-mono font-bold text-signal-coral">
                      {(sig.anomalyScore * 100).toFixed(0)}% ANOMALY
                    </div>
                    <div className="text-[10px] font-mono text-mist-400">
                      {sig.timestamp}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Civil Defense Emergency Broadcast */}
        <div className="p-6 rounded-2xl bg-ink-900/90 border border-ink-800 shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <BellRing className="w-4 h-4 text-signal-amber" />
            <h3 className="text-sm font-display uppercase tracking-wider font-bold text-white">
              Municipal Emergency Broadcast Transmitter
            </h3>
          </div>

          <form onSubmit={handleSendBroadcast} className="space-y-3">
            <textarea
              rows={2}
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-ink-950 border border-ink-700 text-white placeholder-mist-400 text-xs font-mono focus:outline-none focus:border-signal-amber"
            />

            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-mist-400">
                Pushes to municipal variable messaging signs & citizen mobile alert systems.
              </span>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-signal-amber hover:bg-signal-amber/90 text-ink-950 font-mono text-xs font-bold transition-colors"
              >
                Broadcast to Metropolis Citizens
              </button>
            </div>
          </form>

          {broadcastSent && (
            <div className="mt-3 p-3 rounded-xl bg-signal-lime/20 border border-signal-lime/40 text-signal-lime text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              BROADCAST TRANSMITTED ACROSS ALL METROPOLIS CELL TOWERS & DIGITAL ROADWAYS.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
