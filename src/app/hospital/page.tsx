"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  HeartPulse,
  Bed,
  Activity,
  AlertTriangle,
  RefreshCw,
  Plus,
  Minus,
  Ambulance,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { Hospital, Incident, Unit } from "@/types";

export default function HospitalDesk() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/incidents");
      if (res.ok) {
        const data = await res.json();
        setHospitals(data.hospitals || []);
        setIncidents(data.incidents || []);
        setUnits(data.units || []);
      }
    } catch (err) {
      console.error("Failed to load hospital trauma data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdjustBeds = (hospitalId: string, deltaEr: number, deltaIcu: number) => {
    setHospitals((prev) =>
      prev.map((h) => {
        if (h.id !== hospitalId) return h;
        const newEr = Math.max(0, h.erBedsAvailable + deltaEr);
        const newIcu = Math.max(0, h.icuBedsAvailable + deltaIcu);
        return {
          ...h,
          erBedsAvailable: newEr,
          icuBedsAvailable: newIcu,
          surgeStatus: newEr < 4 ? "CRITICAL" : newEr < 9 ? "ELEVATED" : "NORMAL",
        };
      })
    );
  };

  // Find incoming pre-alerts for hospitals
  const activeAmbulances = units.filter(
    (u) => u.type === "AMBULANCE" && (u.status === "DISPATCHED" || u.status === "ON_SCENE")
  );

  return (
    <div className="min-h-screen bg-ink-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-signal-coral/10 border border-signal-coral/30 text-signal-coral text-xs font-mono uppercase tracking-wider mb-2">
              <Building2 className="w-3.5 h-3.5 animate-pulse" />
              Trauma Network & Emergency Medicine
            </div>
            <h1 className="text-3xl sm:text-5xl font-display uppercase font-bold text-white tracking-tight">
              Hospital Trauma Pre-Alerts
            </h1>
            <p className="text-sm text-mist-300 mt-1">
              Live emergency room and ICU capacity management, pre-hospital telemetry & incoming trauma alerts.
            </p>
          </div>

          <button
            onClick={fetchData}
            disabled={loading}
            className="self-start sm:self-center px-4 py-2 rounded-xl bg-ink-900 border border-ink-700 hover:border-signal-coral text-xs font-mono text-mist-200 flex items-center gap-2 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh Capacity
          </button>
        </div>

        {/* Incoming Trauma Pre-Alerts Banner */}
        <div className="mb-8">
          <h2 className="text-xs font-mono uppercase tracking-wider text-mist-400 mb-3 flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-signal-coral" />
            Active Trauma Pre-Alert Feed ({incidents.filter((i) => i.status !== "RESOLVED").length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {incidents
              .filter((i) => i.status !== "RESOLVED")
              .map((inc) => (
                <div
                  key={inc.id}
                  className="p-5 rounded-2xl bg-ink-900/80 border border-signal-coral/40 shadow-lg relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-signal-coral">
                      PRE-ALERT: {inc.id}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-signal-coral/20 text-signal-coral border border-signal-coral/40 font-bold uppercase">
                      {inc.assessment.severity} — TIER {inc.assessment.traumaTierRequired}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1">
                    {inc.title}
                  </h3>
                  <p className="text-xs text-mist-300 mb-3">
                    {inc.description}
                  </p>

                  <div className="p-2.5 rounded-xl bg-ink-950 border border-ink-800 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-1.5 text-signal-teal">
                      <Ambulance className="w-4 h-4" />
                      <span>Paramedic En Route</span>
                    </div>
                    <div className="text-mist-400">
                      Destination: {inc.targetHospitalId || "Apex Trauma"}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Hospital Capacity Matrix */}
        <div>
          <h2 className="text-xs font-mono uppercase tracking-wider text-mist-400 mb-3 flex items-center gap-2">
            <Bed className="w-4 h-4 text-signal-teal" />
            Metropolis Regional Hospital Capacity Matrix
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {hospitals.map((hosp) => (
              <div
                key={hosp.id}
                className="p-6 rounded-2xl bg-ink-900/90 border border-ink-800 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-ink-800 text-mist-300 border border-ink-700">
                      {hosp.traumaLevel}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase border ${
                        hosp.surgeStatus === "CRITICAL"
                          ? "bg-signal-coral/20 border-signal-coral text-signal-coral"
                          : hosp.surgeStatus === "ELEVATED"
                          ? "bg-signal-amber/20 border-signal-amber text-signal-amber"
                          : "bg-signal-lime/20 border-signal-lime text-signal-lime"
                      }`}
                    >
                      SURGE: {hosp.surgeStatus}
                    </span>
                  </div>

                  <h3 className="text-xl font-display uppercase font-bold text-white tracking-wide">
                    {hosp.name}
                  </h3>
                  <p className="text-xs text-mist-400 font-mono mt-0.5">
                    Municipal Sector • {hosp.distanceKm} km from center
                  </p>

                  {/* Bed Counters */}
                  <div className="grid grid-cols-2 gap-3 my-5">
                    {/* ER Beds */}
                    <div className="p-3.5 rounded-xl bg-ink-950 border border-ink-800 text-center">
                      <div className="text-[10px] font-mono text-mist-400 uppercase">
                        ER Beds Free
                      </div>
                      <div className="text-3xl font-display font-bold text-signal-teal mt-1">
                        {hosp.erBedsAvailable}
                      </div>
                      <div className="flex justify-center gap-2 mt-2">
                        <button
                          onClick={() => handleAdjustBeds(hosp.id, -1, 0)}
                          className="w-6 h-6 rounded bg-ink-800 hover:bg-ink-700 text-white flex items-center justify-center text-xs font-bold border border-ink-700"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleAdjustBeds(hosp.id, 1, 0)}
                          className="w-6 h-6 rounded bg-ink-800 hover:bg-ink-700 text-white flex items-center justify-center text-xs font-bold border border-ink-700"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* ICU Beds */}
                    <div className="p-3.5 rounded-xl bg-ink-950 border border-ink-800 text-center">
                      <div className="text-[10px] font-mono text-mist-400 uppercase">
                        ICU Beds Free
                      </div>
                      <div className="text-3xl font-display font-bold text-signal-coral mt-1">
                        {hosp.icuBedsAvailable}
                      </div>
                      <div className="flex justify-center gap-2 mt-2">
                        <button
                          onClick={() => handleAdjustBeds(hosp.id, 0, -1)}
                          className="w-6 h-6 rounded bg-ink-800 hover:bg-ink-700 text-white flex items-center justify-center text-xs font-bold border border-ink-700"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleAdjustBeds(hosp.id, 0, 1)}
                          className="w-6 h-6 rounded bg-ink-800 hover:bg-ink-700 text-white flex items-center justify-center text-xs font-bold border border-ink-700"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-ink-800 text-xs font-mono text-mist-400 flex items-center justify-between">
                  <span>Surgical Suites:</span>
                  <span className="text-signal-lime font-bold">READY (CODE AMBER)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
