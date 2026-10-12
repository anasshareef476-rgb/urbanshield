import { NextResponse } from "next/server";
import { createIncident, getStoreData } from "@/lib/store";

export async function GET() {
  const data = getStoreData();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.category || !body.description || !body.location) {
      return NextResponse.json(
        { error: "Missing required fields: category, description, location" },
        { status: 400 }
      );
    }

    const incident = createIncident({
      category: body.category,
      description: body.description,
      location: body.location,
      title: body.title,
      reporterName: body.reporterName,
      reporterPhone: body.reporterPhone,
      coordinates: body.coordinates,
    });

    return NextResponse.json({ success: true, incident }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process incident report", details: String(error) },
      { status: 500 }
    );
  }
}
