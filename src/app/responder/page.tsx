"use client";

import { useEffect, useState } from "react";
import {
  Ambulance,
  CheckCircle,
  Navigation,
  RefreshCw,
  ShieldAlert,
  Flame,
  Radio,
  Clock,
  MapPin,
  ChevronRight,
  AlertOctagon,
} from "lucide-react";
import { Incident, Unit, Hospital } from "@/types";

export default function ResponderDesk() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/incidents");
      if (res.ok) {
        const data = await res.json();
        setIncidents(data.incidents || []);
        setUnits(data.units || []);
        setHospitals(data.hospitals || []);
        if (!selectedIncidentId && data.incidents?.length > 0) {
          setSelectedIncidentId(data.incidents[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to load responder board", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 8000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateStatus = async (
    incidentId: string,
    status: Incident["status"]
  ) => {
    try {
      setIsUpdating(true);
      const res = await fetch(`/api/incidents/${incidentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const selectedIncident = incidents.find((i) => i.id === selectedIncidentId);
  const assignedUnits = units.filter((u) =>
    selectedIncident?.assignedUnitIds.includes(u.id)
  );
  const targetHospital = hospitals.find(
    (h) => h.id === selectedIncident?.targetHospitalId
  );

  return (
    <div className="min-h-screen bg-ink-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-signal-amber/10 border border-signal-amber/30 text-signal-amber text-xs font-mono uppercase tracking-wider mb-2">
              <Ambulance className="w-3.5 h-3.5 animate-pulse" />
              First Responder Tactical Command
            </div>
            <h1 className="text-3xl sm:text-5xl font-display uppercase font-bold text-white tracking-tight">
              Emergency Dispatch Board
            </h1>
            <p className="text-sm text-mist-300 mt-1">
              Active incident staging, real-time unit telematics, on-scene coordination & status transitions.
            </p>
          </div>

          <button
            onClick={fetchData}
            disabled={loading}
            className="self-start sm:self-center px-4 py-2 rounded-xl bg-ink-900 border border-ink-700 hover:border-signal-amber text-xs font-mono text-mist-200 flex items-center gap-2 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh Board
          </button>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Incidents Queue (Left Column) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-mono text-mist-400 uppercase tracking-wider">
                Live Incidents ({incidents.length})
              </span>
              <span className="text-[11px] font-mono text-signal-amber">
                Auto-syncing (8s)
              </span>
            </div>

            <div className="space-y-3">
              {incidents.map((inc) => {
                const isSelected = inc.id === selectedIncidentId;
                return (
                  <div
                    key={inc.id}
                    onClick={() => setSelectedIncidentId(inc.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-ink-900 border-signal-amber shadow-lg shadow-signal-amber/10"
                        : "bg-ink-900/60 border-ink-800 hover:bg-ink-850 hover:border-ink-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs text-mist-400 font-bold">
                        {inc.id}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                          inc.assessment.severity === "CRITICAL"
                            ? "bg-signal-coral/20 text-signal-coral border border-signal-coral/40"
                            : inc.assessment.severity === "HIGH"
                            ? "bg-signal-amber/20 text-signal-amber border border-signal-amber/40"
                            : "bg-signal-teal/20 text-signal-teal border border-signal-teal/40"
                        }`}
                      >
                        {inc.assessment.severity} ({inc.assessment.score}/100)
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-white truncate">
                      {inc.title}
                    </h3>

                    <div className="text-xs text-mist-300 mt-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-mist-400 shrink-0" />
                      <span className="truncate">{inc.location}</span>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-ink-800 flex items-center justify-between text-xs">
                      <span
                        className={`font-mono text-[11px] font-semibold ${
                          inc.status === "ON_SCENE"
                            ? "text-signal-lime"
                            : inc.status === "RESOLVED"
                            ? "text-mist-400 line-through"
                            : "text-signal-amber"
                        }`}
                      >
                        ● {inc.status}
                      </span>
                      <span className="text-mist-400 font-mono text-[11px]">
                        {inc.assignedUnitIds.length} Units Dispatched
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Incident Detail & Unit Control (Right Column) */}
          <div className="lg:col-span-7">
            {selectedIncident ? (
              <div className="p-6 rounded-2xl bg-ink-900/90 border border-ink-800 backdrop-blur-md shadow-xl space-y-6">
                {/* Header detail */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-ink-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-signal-amber font-bold">
                        {selectedIncident.id}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-ink-800 text-mist-300 font-mono">
                        {selectedIncident.category}
                      </span>
                    </div>
                    <h2 className="text-2xl font-display uppercase font-bold text-white mt-1">
                      {selectedIncident.title}
                    </h2>
                  </div>

                  {/* Tactical Action Buttons */}
                  <div className="flex items-center gap-2">
                    {selectedIncident.status !== "ON_SCENE" &&
                      selectedIncident.status !== "RESOLVED" && (
                        <button
                          disabled={isUpdating}
                          onClick={() =>
                            handleUpdateStatus(selectedIncident.id, "ON_SCENE")
                          }
                          className="px-3 py-1.5 rounded-lg bg-signal-teal hover:bg-signal-teal/90 text-ink-950 text-xs font-mono font-bold transition-all"
                        >
                          Mark On-Scene
                        </button>
                      )}
                    {selectedIncident.status !== "RESOLVED" && (
                      <button
                        disabled={isUpdating}
                        onClick={() =>
                          handleUpdateStatus(selectedIncident.id, "RESOLVED")
                        }
                        className="px-3 py-1.5 rounded-lg bg-signal-lime hover:bg-signal-lime/90 text-ink-950 text-xs font-mono font-bold transition-all"
                      >
                        Mark Resolved
                      </button>
                    )}
                  </div>
                </div>

                {/* Location & Scene Description */}
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-ink-950 border border-ink-800 flex items-start gap-3">
                    <Navigation className="w-5 h-5 text-signal-teal shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-mono text-mist-400">
                        TACTICAL DISPATCH DESTINATION
                      </div>
                      <div className="text-sm font-semibold text-white mt-0.5">
                        {selectedIncident.location}
                      </div>
                      <div className="text-[11px] font-mono text-mist-400 mt-1">
                        GPS: {selectedIncident.coordinates.lat.toFixed(4)}° N,{" "}
                        {selectedIncident.coordinates.lng.toFixed(4)}° E
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-mono uppercase text-mist-400 mb-1">
                      Citizen Scene Report
                    </h4>
                    <p className="text-sm text-mist-200 bg-ink-950/60 p-3 rounded-xl border border-ink-800">
                      {selectedIncident.description}
                    </p>
                  </div>
                </div>

                {/* Assigned Units */}
                <div>
                  <h4 className="text-xs font-mono uppercase text-mist-400 mb-2">
                    Assigned Tactical Fleet Units ({assignedUnits.length})
                  </h4>
                  {assignedUnits.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {assignedUnits.map((unit) => (
                        <div
                          key={unit.id}
                          className="p-3 rounded-xl bg-ink-950 border border-ink-800 flex items-center justify-between"
                        >
                          <div>
                            <div className="text-xs font-bold text-white">
                              {unit.name}
                            </div>
                            <div className="text-[10px] font-mono text-mist-400">
                              {unit.type} • {unit.location}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-[11px] font-mono text-signal-lime font-bold">
                              {unit.status}
                            </span>
                            <div className="text-[10px] text-mist-400 font-mono">
                              ETA {unit.etaMinutes}m
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-mist-400 font-mono p-3 rounded-xl bg-ink-950 border border-ink-800">
                      No units currently assigned to this incident.
                    </div>
                  )}
                </div>

                {/* Designated Hospital Trauma Alert */}
                {targetHospital && (
                  <div>
                    <h4 className="text-xs font-mono uppercase text-mist-400 mb-2">
                      Designated Receiving Trauma Center
                    </h4>
                    <div className="p-3 rounded-xl bg-ink-950 border border-signal-coral/30 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-white">
                          {targetHospital.name}
                        </div>
                        <div className="text-[10px] font-mono text-mist-400">
                          {targetHospital.traumaLevel} • {targetHospital.distanceKm} km away
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-mono text-signal-teal font-bold">
                          {targetHospital.erBedsAvailable} ER Beds Open
                        </div>
                        <div className="text-[10px] text-mist-400 font-mono">
                          Surge: {targetHospital.surgeStatus}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 text-center text-mist-400 font-mono bg-ink-900 rounded-2xl border border-ink-800">
                Select an incident from the queue to view tactical details and update statuses.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
