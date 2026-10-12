import { CitySignal, Hospital, Incident, Unit } from "@/types";
import { assessIncident } from "./ai-severity";

interface StoreState {
  incidents: Incident[];
  signals: CitySignal[];
  units: Unit[];
  hospitals: Hospital[];
}

// Initial seed data for Metropolis simulation
const initialSignals: CitySignal[] = [
  {
    id: "SIG-801",
    source: "ACOUSTIC_ARRAY",
    location: "Metro Central Plaza, Sector 4",
    timestamp: "2 mins ago",
    value: "Acoustic decibel spike: 114 dB (Impact / Explosion acoustic signature)",
    confidence: 0.94,
    anomalyScore: 0.92,
  },
  {
    id: "SIG-802",
    source: "CCTV_AI",
    location: "Flyover Junction 9B",
    timestamp: "4 mins ago",
    value: "Dense dark smoke column detected (Confidence 88%)",
    confidence: 0.88,
    anomalyScore: 0.85,
  },
  {
    id: "SIG-803",
    source: "TRAFFIC_LOOP",
    location: "Sector 12 Ring Corridor",
    timestamp: "Just now",
    value: "Flow halted: Average speed dropped from 58 km/h to 3 km/h",
    confidence: 0.99,
    anomalyScore: 0.81,
  },
  {
    id: "SIG-804",
    source: "AIR_SENSOR",
    location: "Industrial Gateway South",
    timestamp: "7 mins ago",
    value: "PM2.5 spike: 340 µg/m³ with elevated volatile organics",
    confidence: 0.91,
    anomalyScore: 0.76,
  },
];

const initialUnits: Unit[] = [
  {
    id: "UNIT-MED-1",
    name: "Trauma Medic 01",
    type: "AMBULANCE",
    status: "DISPATCHED",
    location: "Sector 4 Outer Ring",
    etaMinutes: 4,
    assignedIncidentId: "INC-2041",
  },
  {
    id: "UNIT-MED-2",
    name: "ALS Mobile Unit 04",
    type: "AMBULANCE",
    status: "AVAILABLE",
    location: "Central General Station",
    etaMinutes: 7,
  },
  {
    id: "UNIT-FIRE-1",
    name: "Heavy Engine 12",
    type: "FIRE_ENGINE",
    status: "DISPATCHED",
    location: "Grand Avenue",
    etaMinutes: 5,
    assignedIncidentId: "INC-2041",
  },
  {
    id: "UNIT-POL-1",
    name: "Rapid Interceptor 09",
    type: "POLICE_PATROL",
    status: "ON_SCENE",
    location: "Metro Central Plaza",
    etaMinutes: 0,
    assignedIncidentId: "INC-2041",
  },
  {
    id: "UNIT-HAZ-1",
    name: "Hazmat Team 3",
    type: "HAZMAT",
    status: "AVAILABLE",
    location: "South Industrial Depot",
    etaMinutes: 12,
  },
  {
    id: "UNIT-DRONE-1",
    name: "AeroScan Sentinel 2",
    type: "DRONE_RECON",
    status: "AVAILABLE",
    location: "Civic Command Rooftop",
    etaMinutes: 2,
  },
];

const initialHospitals: Hospital[] = [
  {
    id: "HOSP-01",
    name: "Metropolis Apex Trauma Center",
    traumaLevel: "LEVEL_1",
    erBedsAvailable: 8,
    icuBedsAvailable: 3,
    surgeStatus: "ELEVATED",
    distanceKm: 3.2,
  },
  {
    id: "HOSP-02",
    name: "Memorial General Hospital",
    traumaLevel: "LEVEL_2",
    erBedsAvailable: 15,
    icuBedsAvailable: 6,
    surgeStatus: "NORMAL",
    distanceKm: 5.8,
  },
  {
    id: "HOSP-03",
    name: "Westside Community Care",
    traumaLevel: "LEVEL_3",
    erBedsAvailable: 19,
    icuBedsAvailable: 4,
    surgeStatus: "NORMAL",
    distanceKm: 8.4,
  },
];

const initialIncidents: Incident[] = [
  {
    id: "INC-2041",
    title: "Multi-Vehicle Pileup with Structural Debris",
    category: "COLLISION",
    description: "Multi-vehicle collision on Flyover Junction 9B involving a fuel tanker and bus. Multiple passengers trapped, fuel leakage visible, dense black smoke.",
    location: "Flyover Junction 9B, Metro Central Plaza",
    coordinates: { lat: 19.076, lng: 72.8777 },
    status: "DISPATCHED",
    reportedAt: new Date(Date.now() - 6 * 60000).toISOString(),
    reporterName: "Kavita Rao (Commuter)",
    reporterPhone: "+91 98200 44123",
    assessment: {
      score: 88,
      severity: "CRITICAL",
      confidence: 0.94,
      primaryThreat: "Fuel explosion hazard & trapped victims",
      recommendedUnits: ["AMBULANCE", "FIRE_ENGINE", "POLICE_PATROL", "DRONE_RECON"],
      traumaTierRequired: "LEVEL_1",
      rationale: [
        "Multiple injured trapped passengers reported",
        "Hydrocarbon / fuel leak detected near active fire",
        "Corroborated by CCTV smoke column and Traffic freeze",
      ],
      correlatedSignals: [
        "CCTV_AI at Flyover Junction 9B: Dense smoke column (88%)",
        "TRAFFIC_LOOP at Sector 12 Ring Corridor: Flow halted (99%)",
      ],
    },
    assignedUnitIds: ["UNIT-MED-1", "UNIT-FIRE-1", "UNIT-POL-1"],
    targetHospitalId: "HOSP-01",
  },
  {
    id: "INC-2038",
    title: "Commercial Warehouse Chemical Vapor Alert",
    category: "HAZMAT_LEAK",
    description: "Storage depot container seal compromised. White acrid vapor escaping towards pedestrian sidewalk.",
    location: "Industrial Gateway South, Warehouse 14",
    coordinates: { lat: 19.041, lng: 72.862 },
    status: "ASSESSED",
    reportedAt: new Date(Date.now() - 18 * 60000).toISOString(),
    reporterName: "Security Desk (Gateway)",
    assessment: {
      score: 74,
      severity: "HIGH",
      confidence: 0.89,
      primaryThreat: "Toxic vapor dispersion into adjacent residential corridor",
      recommendedUnits: ["HAZMAT", "FIRE_ENGINE", "POLICE_PATROL"],
      traumaTierRequired: "LEVEL_2",
      rationale: [
        "Uncontained chemical plume",
        "Air sensor indicates spike in volatile organic compounds",
      ],
      correlatedSignals: ["AIR_SENSOR: PM2.5 and chemical surge"],
    },
    assignedUnitIds: [],
    targetHospitalId: "HOSP-02",
  },
];

// Persistent state across serverless requests in same process
declare global {
  // eslint-disable-next-line no-var
  var __URBAN_SHIELD_STORE__: StoreState | undefined;
}

if (!globalThis.__URBAN_SHIELD_STORE__) {
  globalThis.__URBAN_SHIELD_STORE__ = {
    incidents: initialIncidents,
    signals: initialSignals,
    units: initialUnits,
    hospitals: initialHospitals,
  };
}

const store = globalThis.__URBAN_SHIELD_STORE__;

export function getStoreData() {
  return {
    incidents: [...store.incidents],
    signals: [...store.signals],
    units: [...store.units],
    hospitals: [...store.hospitals],
  };
}

export function getIncidents(): Incident[] {
  return store.incidents;
}

export function getIncidentById(id: string): Incident | undefined {
  return store.incidents.find((inc) => inc.id === id);
}

export function createIncident(data: {
  title?: string;
  category: Incident["category"];
  description: string;
  location: string;
  reporterName?: string;
  reporterPhone?: string;
  coordinates?: { lat: number; lng: number };
}): Incident {
  const assessment = assessIncident({
    category: data.category,
    description: data.description,
    location: data.location,
    signals: store.signals,
  });

  const id = `INC-${Math.floor(2050 + Math.random() * 900)}`;
  const title =
    data.title ||
    `${data.category.replace("_", " ")} — ${data.location.split(",")[0] || "Metropolis"}`;

  // Find nearest appropriate hospital
  const targetHospital =
    store.hospitals.find(
      (h) => h.traumaLevel === assessment.traumaTierRequired && h.erBedsAvailable > 0
    ) || store.hospitals[0];

  // Auto-dispatch available units matching recommendations
  const assignedUnits: string[] = [];
  assessment.recommendedUnits.forEach((reqType) => {
    const availableUnit = store.units.find(
      (u) => u.type === reqType && u.status === "AVAILABLE"
    );
    if (availableUnit) {
      availableUnit.status = "DISPATCHED";
      availableUnit.assignedIncidentId = id;
      availableUnit.etaMinutes = Math.floor(3 + Math.random() * 6);
      assignedUnits.push(availableUnit.id);
    }
  });

  const newIncident: Incident = {
    id,
    title,
    category: data.category,
    description: data.description,
    location: data.location,
    coordinates: data.coordinates || {
      lat: 19.076 + (Math.random() - 0.5) * 0.08,
      lng: 72.877 + (Math.random() - 0.5) * 0.08,
    },
    status: assignedUnits.length > 0 ? "DISPATCHED" : "ASSESSED",
    reportedAt: new Date().toISOString(),
    reporterName: data.reporterName || "Anonymous Citizen",
    reporterPhone: data.reporterPhone,
    assessment,
    assignedUnitIds: assignedUnits,
    targetHospitalId: targetHospital?.id,
  };

  store.incidents.unshift(newIncident);
  return newIncident;
}

export function updateIncidentStatus(
  id: string,
  status: Incident["status"]
): Incident | null {
  const incident = store.incidents.find((i) => i.id === id);
  if (!incident) return null;

  incident.status = status;

  if (status === "RESOLVED") {
    // Free assigned units
    store.units.forEach((u) => {
      if (incident.assignedUnitIds.includes(u.id)) {
        u.status = "AVAILABLE";
        u.assignedIncidentId = undefined;
      }
    });
  } else if (status === "ON_SCENE") {
    store.units.forEach((u) => {
      if (incident.assignedUnitIds.includes(u.id)) {
        u.status = "ON_SCENE";
      }
    });
  }

  return incident;
}

export function updateUnitStatus(unitId: string, status: Unit["status"]) {
  const unit = store.units.find((u) => u.id === unitId);
  if (unit) {
    unit.status = status;
    if (status === "AVAILABLE") {
      unit.assignedIncidentId = undefined;
    }
  }
  return unit;
}

export function updateHospitalBeds(
  hospitalId: string,
  deltaEr: number,
  deltaIcu: number
) {
  const hosp = store.hospitals.find((h) => h.id === hospitalId);
  if (hosp) {
    hosp.erBedsAvailable = Math.max(0, hosp.erBedsAvailable + deltaEr);
    hosp.icuBedsAvailable = Math.max(0, hosp.icuBedsAvailable + deltaIcu);
    hosp.surgeStatus =
      hosp.erBedsAvailable < 3 ? "CRITICAL" : hosp.erBedsAvailable < 8 ? "ELEVATED" : "NORMAL";
  }
  return hosp;
}
