"use client";

import { useState, useEffect } from "react";
import {
  Radio,
  AlertTriangle,
  Send,
  Sparkles,
  MapPin,
  Phone,
  User,
  ShieldCheck,
  CheckCircle,
  Loader2,
  Clock,
} from "lucide-react";
import { AIAssessment, IncidentCategory } from "@/types";

export default function CitizenDesk() {
  const [category, setCategory] = useState<IncidentCategory>("COLLISION");
  const [location, setLocation] = useState("Metro Central Plaza, Sector 4");
  const [description, setDescription] = useState(
    "Two cars collided at high speed. One vehicle is smoking heavily, and the driver appears trapped inside."
  );
  const [reporterName, setReporterName] = useState("");
  const [reporterPhone, setReporterPhone] = useState("");

  const [assessment, setAssessment] = useState<AIAssessment | null>(null);
  const [isAssessing, setIsAssessing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedIncidentId, setSubmittedIncidentId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Live preview AI assessment as user types or changes fields
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!description.trim() || !location.trim()) return;
      setIsAssessing(true);
      try {
        const res = await fetch("/api/assess", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ category, description, location }),
        });
        if (res.ok) {
          const data = await res.json();
          setAssessment(data.assessment);
        }
      } catch (err) {
        console.error("AI preview failed", err);
      } finally {
        setIsAssessing(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [category, description, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          location,
          description,
          reporterName: reporterName || "Anonymous Citizen",
          reporterPhone,
        }),
      });

      const data = await res.json();
      if (res.ok && data.incident) {
        setSubmittedIncidentId(data.incident.id);
      } else {
        setErrorMessage(data.error || "Failed to submit emergency report");
      }
    } catch (err) {
      setErrorMessage("Network error connecting to municipal dispatch");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUseCurrentLocation = () => {
    setLocation("Current GPS: 19.0760° N, 72.8777° E (Metropolis Sector 4)");
  };

  return (
    <div className="min-h-screen bg-ink-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-signal-teal/10 border border-signal-teal/30 text-signal-teal text-xs font-mono uppercase tracking-wider mb-2">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            Citizen Emergency Portal
          </div>
          <h1 className="text-3xl sm:text-5xl font-display uppercase font-bold text-white tracking-tight">
            Report Urgent Incident
          </h1>
          <p className="text-sm text-mist-300 mt-1">
            Real-time severity preview scores your report with municipal IoT sensor telemetry and auto-dispatches first responders.
          </p>
        </div>

        {submittedIncidentId ? (
          <div className="p-8 rounded-2xl bg-ink-900 border border-signal-teal/40 text-center max-w-xl mx-auto shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-signal-teal/20 border border-signal-teal text-signal-teal flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-display uppercase font-bold text-white">
              Dispatch Synchronized!
            </h2>
            <p className="text-sm text-mist-300 mt-2">
              Your report has been received and triaged. Incident Ticket:
            </p>
            <div className="mt-4 p-3 bg-ink-950 rounded-xl border border-ink-800 font-mono text-2xl text-signal-teal font-bold tracking-widest">
              {submittedIncidentId}
            </div>
            <p className="text-xs text-mist-400 mt-4">
              Nearest first responder units have been notified with priority tactical routing.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={() => {
                  setSubmittedIncidentId(null);
                  setDescription("");
                }}
                className="px-5 py-2.5 rounded-xl bg-ink-800 hover:bg-ink-700 text-white font-medium text-xs font-mono border border-ink-700 transition-colors"
              >
                Submit Another Report
              </button>
              <a
                href="/responder"
                className="px-5 py-2.5 rounded-xl bg-signal-teal hover:bg-signal-teal/90 text-ink-950 font-bold text-xs font-mono transition-colors"
              >
                Track on Responder Board →
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form Column */}
            <div className="lg:col-span-7">
              <form
                onSubmit={handleSubmit}
                className="p-6 rounded-2xl bg-ink-900/80 border border-ink-800 backdrop-blur-md shadow-xl space-y-5"
              >
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-signal-coral/20 border border-signal-coral/50 text-signal-coral text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    {errorMessage}
                  </div>
                )}

                {/* Category Selection */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-mist-300 mb-2">
                    Emergency Classification
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {(
                      [
                        { id: "COLLISION", label: "Collision / Crash" },
                        { id: "STRUCTURE_FIRE", label: "Structure Fire" },
                        { id: "MEDICAL_CARDIAC", label: "Medical / Cardiac" },
                        { id: "HAZMAT_LEAK", label: "Hazmat / Chemical" },
                        { id: "CIVIL_DISTURBANCE", label: "Disturbance" },
                        { id: "MASS_CASUALTY", label: "Mass Casualty" },
                      ] as const
                    ).map((cat) => (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => setCategory(cat.id)}
                        className={`p-2.5 text-xs rounded-xl font-medium border text-left transition-all ${
                          category === cat.id
                            ? "bg-signal-teal/15 border-signal-teal text-white shadow-sm"
                            : "bg-ink-800/50 border-ink-750 text-mist-300 hover:bg-ink-800 hover:text-white"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-mist-300 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-signal-teal" />
                      Incident Location / Landmark
                    </label>
                    <button
                      type="button"
                      onClick={handleUseCurrentLocation}
                      className="text-[11px] text-signal-teal hover:underline font-mono"
                    >
                      Use GPS Position
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Flyover Junction 9B, Sector 4"
                    className="w-full px-4 py-2.5 rounded-xl bg-ink-950 border border-ink-700 text-white placeholder-mist-400 text-sm focus:outline-none focus:border-signal-teal"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-mist-300 mb-1.5">
                    What is happening? (Include injuries, hazards, trapped people)
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe scene details, number of casualties, flames, weapons, vehicle types..."
                    className="w-full px-4 py-2.5 rounded-xl bg-ink-950 border border-ink-700 text-white placeholder-mist-400 text-sm focus:outline-none focus:border-signal-teal"
                  />
                </div>

                {/* Reporter Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="text-xs font-mono text-mist-400 mb-1 flex items-center gap-1">
                      <User className="w-3 h-3 text-mist-400" />
                      Your Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={reporterName}
                      onChange={(e) => setReporterName(e.target.value)}
                      placeholder="e.g. Ramesh K."
                      className="w-full px-3 py-2 rounded-xl bg-ink-950 border border-ink-750 text-white text-xs placeholder-mist-400 focus:outline-none focus:border-signal-teal"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-mist-400 mb-1 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-mist-400" />
                      Callback Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      value={reporterPhone}
                      onChange={(e) => setReporterPhone(e.target.value)}
                      placeholder="+91 98000 00000"
                      className="w-full px-3 py-2 rounded-xl bg-ink-950 border border-ink-750 text-white text-xs placeholder-mist-400 focus:outline-none focus:border-signal-teal"
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-signal-coral to-signal-amber text-white font-display uppercase tracking-wider text-xl font-bold flex items-center justify-center gap-2 hover:opacity-95 shadow-lg shadow-signal-coral/20 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      TRANSMITTING TO DISPATCH...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      DISPATCH EMERGENCY ASSISTANCE NOW
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* AI Live Severity Preview Column */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-6 rounded-2xl bg-ink-900/90 border border-ink-800 backdrop-blur-md shadow-xl sticky top-20">
                <div className="flex items-center justify-between pb-3 border-b border-ink-800">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-signal-teal" />
                    <h3 className="text-sm font-display uppercase tracking-wider font-bold text-white">
                      AI Severity Triage Engine
                    </h3>
                  </div>
                  {isAssessing && (
                    <span className="text-[10px] font-mono text-signal-teal flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" /> Scoring...
                    </span>
                  )}
                </div>

                {assessment ? (
                  <div className="mt-4 space-y-4">
                    {/* Score Dial */}
                    <div className="p-4 rounded-xl bg-ink-950 border border-ink-800 flex items-center justify-between">
                      <div>
                        <div className="text-[11px] font-mono text-mist-400 uppercase">
                          Computed Severity Index
                        </div>
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span className="text-4xl font-display font-bold text-white">
                            {assessment.score}
                          </span>
                          <span className="text-xs font-mono text-mist-400">/ 100</span>
                        </div>
                      </div>

                      <div
                        className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold uppercase tracking-wider ${
                          assessment.severity === "CRITICAL"
                            ? "bg-signal-coral/20 border-signal-coral text-signal-coral"
                            : assessment.severity === "HIGH"
                            ? "bg-signal-amber/20 border-signal-amber text-signal-amber"
                            : "bg-signal-teal/20 border-signal-teal text-signal-teal"
                        }`}
                      >
                        {assessment.severity}
                      </div>
                    </div>

                    {/* Threat Assessment */}
                    <div>
                      <div className="text-[11px] font-mono text-mist-400 uppercase">
                        Primary Threat Assessment
                      </div>
                      <p className="text-xs text-white mt-1 font-medium bg-ink-800/40 p-2.5 rounded-lg border border-ink-800">
                        {assessment.primaryThreat}
                      </p>
                    </div>

                    {/* Recommended Response Units */}
                    <div>
                      <div className="text-[11px] font-mono text-mist-400 uppercase mb-1.5">
                        Automated Dispatch Recommendation
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {assessment.recommendedUnits.map((unit) => (
                          <span
                            key={unit}
                            className="text-[10px] font-mono px-2 py-1 rounded bg-ink-800 border border-ink-700 text-signal-teal font-semibold"
                          >
                            + {unit.replace("_", " ")}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Hospital Trauma Tier */}
                    <div className="flex items-center justify-between text-xs py-2 px-3 rounded-lg bg-ink-950 border border-ink-800">
                      <span className="font-mono text-mist-400">Trauma Tier:</span>
                      <span className="font-mono font-bold text-white">
                        {assessment.traumaTierRequired}
                      </span>
                    </div>

                    {/* Rationale Breakdown */}
                    {assessment.rationale.length > 0 && (
                      <div>
                        <div className="text-[11px] font-mono text-mist-400 uppercase mb-1">
                          AI Fusion Signals
                        </div>
                        <ul className="space-y-1 text-xs text-mist-300">
                          {assessment.rationale.map((r, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-signal-teal">›</span>
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-12 text-center text-xs text-mist-400 font-mono">
                    Enter incident details to calculate real-time AI severity.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
