import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { DASHBOARD_SESSION_COOKIE, verifyDashboardSession } from "@/lib/dashboardAuth";

export async function GET() {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(DASHBOARD_SESSION_COOKIE)?.value ?? "";

  return NextResponse.json({
    authenticated: verifyDashboardSession(cookieValue),
  });
}
