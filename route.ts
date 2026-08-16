import { NextResponse } from "next/server";

// Jednoduchý health-check endpoint – hodí se pro Coolify (health check URL)
// i pro ruční ověření, že appka a spojení na appku běží.
export async function GET() {
  return NextResponse.json({ status: "ok" });
}
