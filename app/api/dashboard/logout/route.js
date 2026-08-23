import { NextResponse } from "next/server";
import { clearDashboardSessionCookie } from "@/lib/dashboardAuth";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  clearDashboardSessionCookie(response);
  return response;
}
