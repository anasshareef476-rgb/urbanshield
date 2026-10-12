import { NextResponse } from "next/server";
import { assessIncident } from "@/lib/ai-severity";
import { getStoreData } from "@/lib/store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.category || !body.description || !body.location) {
      return NextResponse.json(
        { error: "Missing required fields: category, description, location" },
        { status: 400 }
      );
    }

    const { signals } = getStoreData();
    const assessment = assessIncident({
      category: body.category,
      description: body.description,
      location: body.location,
      signals,
    });

    return NextResponse.json({ assessment });
  } catch (error) {
    return NextResponse.json(
      { error: "Assessment failed", details: String(error) },
      { status: 500 }
    );
  }
}
