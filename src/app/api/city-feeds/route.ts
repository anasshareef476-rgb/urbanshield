import { NextResponse } from "next/server";
import { getStoreData } from "@/lib/store";

export async function GET() {
  const { signals } = getStoreData();
  return NextResponse.json({
    signals,
    timestamp: new Date().toISOString(),
    sensorCluster: "Metropolis Metropolitan Grid V4",
    activeSensors: 1420,
    health: "OPTIMAL",
  });
}
