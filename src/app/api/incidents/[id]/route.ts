import { NextResponse } from "next/server";
import { getIncidentById, updateIncidentStatus } from "@/lib/store";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const incident = getIncidentById(id);

  if (!incident) {
    return NextResponse.json({ error: "Incident not found" }, { status: 404 });
  }

  return NextResponse.json({ incident });
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    if (!body.status) {
      return NextResponse.json(
        { error: "Status field is required" },
        { status: 400 }
      );
    }

    const updated = updateIncidentStatus(id, body.status);

    if (!updated) {
      return NextResponse.json({ error: "Incident not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, incident: updated });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update incident", details: String(error) },
      { status: 500 }
    );
  }
}
