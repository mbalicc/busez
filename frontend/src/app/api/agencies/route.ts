import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_API_URL || "http://localhost:3001";

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/agencies/`, { cache: "no-store" });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Backend unavailable" }, { status: 503 });
  }
}
