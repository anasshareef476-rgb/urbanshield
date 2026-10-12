export type SeverityLevel = "CRITICAL" | "HIGH" | "MODERATE" | "LOW";

export type IncidentCategory =
  | "COLLISION"
  | "STRUCTURE_FIRE"
  | "MEDICAL_CARDIAC"
  | "HAZMAT_LEAK"
  | "CIVIL_DISTURBANCE"
  | "WATER_MAIN_BURST"
  | "MASS_CASUALTY";

export type IncidentStatus =
  | "REPORTED"
  | "ASSESSED"
  | "DISPATCHED"
  | "ON_SCENE"
  | "RESOLVED";

export interface CitySignal {
  id: string;
  source: "ACOUSTIC_ARRAY" | "CCTV_AI" | "TRAFFIC_LOOP" | "AIR_SENSOR" | "CITIZEN_CALL";
  location: string;
  timestamp: string;
  value: string;
  confidence: number;
  anomalyScore: number;
}

export interface Unit {
  id: string;
  name: string;
  type: "AMBULANCE" | "FIRE_ENGINE" | "POLICE_PATROL" | "HAZMAT" | "DRONE_RECON";
  status: "AVAILABLE" | "DISPATCHED" | "ON_SCENE" | "RETURNING";
  location: string;
  etaMinutes: number;
  assignedIncidentId?: string;
}

export interface Hospital {
  id: string;
  name: string;
  traumaLevel: "LEVEL_1" | "LEVEL_2" | "LEVEL_3";
  erBedsAvailable: number;
  icuBedsAvailable: number;
  surgeStatus: "NORMAL" | "ELEVATED" | "CRITICAL";
  distanceKm: number;
}

export interface AIAssessment {
  score: number; // 0 - 100
  severity: SeverityLevel;
  confidence: number; // 0 - 1
  primaryThreat: string;
  recommendedUnits: ("AMBULANCE" | "FIRE_ENGINE" | "POLICE_PATROL" | "HAZMAT" | "DRONE_RECON")[];
  traumaTierRequired: "LEVEL_1" | "LEVEL_2" | "LEVEL_3" | "NONE";
  rationale: string[];
  correlatedSignals: string[];
}

export interface Incident {
  id: string;
  title: string;
  category: IncidentCategory;
  description: string;
  location: string;
  coordinates: { lat: number; lng: number };
  status: IncidentStatus;
  reportedAt: string;
  reporterName?: string;
  reporterPhone?: string;
  assessment: AIAssessment;
  assignedUnitIds: string[];
  targetHospitalId?: string;
}
