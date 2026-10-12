import { AIAssessment, CitySignal, IncidentCategory, SeverityLevel } from "@/types";

export interface AssessmentInput {
  category: IncidentCategory;
  description: string;
  location: string;
  signals?: CitySignal[];
}

export function assessIncident(input: AssessmentInput): AIAssessment {
  const { category, description, location, signals = [] } = input;
  const text = (description + " " + location).toLowerCase();

  let score = 30; // base score
  const rationale: string[] = [];
  const correlatedSignals: string[] = [];

  // 1. Category Baseline
  switch (category) {
    case "MASS_CASUALTY":
      score += 45;
      rationale.push("Incident classified as Mass Casualty Event (+45 severity).");
      break;
    case "HAZMAT_LEAK":
      score += 38;
      rationale.push("Hazmat classification triggers bio/chemical containment protocols (+38 severity).");
      break;
    case "STRUCTURE_FIRE":
      score += 32;
      rationale.push("Structural thermal incident identified with potential structural collapse risk (+32 severity).");
      break;
    case "COLLISION":
      score += 24;
      rationale.push("Vehicular collision on municipal arterial road (+24 severity).");
      break;
    case "MEDICAL_CARDIAC":
      score += 35;
      rationale.push("Time-critical cardiac/respiratory emergency (+35 severity).");
      break;
    case "CIVIL_DISTURBANCE":
      score += 20;
      rationale.push("Crowd tension / disturbance reported in public space (+20 severity).");
      break;
    case "WATER_MAIN_BURST":
      score += 15;
      rationale.push("Infrastructure utility breach with potential localized flooding (+15 severity).");
      break;
  }

  // 2. Lexical & NLP Indicators
  const criticalKeywords = ["unconscious", "trapped", "explosion", "bleeding heavily", "gunshot", "crushed", "infant", "collapse", "toxic fumes"];
  const highKeywords = ["smoke", "flames", "injured", "pedestrian", "highway", "spill", "blocked", "panic"];

  let criticalHits = 0;
  criticalKeywords.forEach((kw) => {
    if (text.includes(kw)) {
      criticalHits++;
      score += 12;
      rationale.push(`Critical indicator detected: "${kw}" (+12)`);
    }
  });

  let highHits = 0;
  highKeywords.forEach((kw) => {
    if (text.includes(kw)) {
      highHits++;
      score += 6;
      rationale.push(`Risk factor detected: "${kw}" (+6)`);
    }
  });

  // 3. City-Signal Fusion (Correlating IoT Telemetry)
  signals.forEach((sig) => {
    const locMatch = sig.location.toLowerCase();
    const isNearby = locMatch.split(" ").some((part) => part.length > 3 && text.includes(part));

    if (isNearby || text.includes(sig.location.toLowerCase())) {
      if (sig.anomalyScore > 0.7) {
        score += Math.round(sig.anomalyScore * 15);
        correlatedSignals.push(`${sig.source} at ${sig.location}: ${sig.value} (Anomaly: ${(sig.anomalyScore * 100).toFixed(0)}%)`);
        rationale.push(`Telemetry corroboration from ${sig.source}: ${sig.value}`);
      }
    }
  });

  // Cap score between 10 and 99
  const finalScore = Math.min(Math.max(score, 12), 99);

  // Derive Severity Level
  let severity: SeverityLevel = "LOW";
  let traumaTier: "LEVEL_1" | "LEVEL_2" | "LEVEL_3" | "NONE" = "NONE";
  const recommendedUnits: ("AMBULANCE" | "FIRE_ENGINE" | "POLICE_PATROL" | "HAZMAT" | "DRONE_RECON")[] = [];

  if (finalScore >= 80) {
    severity = "CRITICAL";
    traumaTier = "LEVEL_1";
    recommendedUnits.push("AMBULANCE", "POLICE_PATROL", "DRONE_RECON");
    if (category === "STRUCTURE_FIRE" || category === "HAZMAT_LEAK") recommendedUnits.push("FIRE_ENGINE");
    if (category === "HAZMAT_LEAK") recommendedUnits.push("HAZMAT");
  } else if (finalScore >= 60) {
    severity = "HIGH";
    traumaTier = "LEVEL_2";
    recommendedUnits.push("AMBULANCE", "POLICE_PATROL");
    if (category === "STRUCTURE_FIRE") recommendedUnits.push("FIRE_ENGINE");
    if (category === "HAZMAT_LEAK") recommendedUnits.push("HAZMAT");
  } else if (finalScore >= 40) {
    severity = "MODERATE";
    traumaTier = "LEVEL_3";
    if (category === "COLLISION" || category === "CIVIL_DISTURBANCE") recommendedUnits.push("POLICE_PATROL");
    if (category === "MEDICAL_CARDIAC") recommendedUnits.push("AMBULANCE");
    if (category === "STRUCTURE_FIRE") recommendedUnits.push("FIRE_ENGINE");
  } else {
    severity = "LOW";
    traumaTier = "NONE";
    recommendedUnits.push("POLICE_PATROL");
  }

  // Deduplicate units
  const uniqueUnits = Array.from(new Set(recommendedUnits));

  // Confidence computation based on signal density & keywords
  const signalBoost = correlatedSignals.length * 0.12;
  const keywordBoost = (criticalHits + highHits) * 0.05;
  const confidence = Math.min(Number((0.68 + signalBoost + keywordBoost).toFixed(2)), 0.98);

  const primaryThreat =
    severity === "CRITICAL"
      ? "Immediate Threat to Life & Structural Safety"
      : severity === "HIGH"
      ? "Significant Casualty Risk & Active Hazard"
      : severity === "MODERATE"
      ? "Localized Disruption with Medical/Safety Escalation Risk"
      : "Standard Municipal Dispatch Protocol";

  return {
    score: finalScore,
    severity,
    confidence,
    primaryThreat,
    recommendedUnits: uniqueUnits,
    traumaTierRequired: traumaTier,
    rationale: rationale.slice(0, 5),
    correlatedSignals,
  };
}
