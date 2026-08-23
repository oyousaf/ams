import { NextResponse } from "next/server";
import { setDashboardSessionCookie } from "@/lib/dashboardAuth";

const DASHBOARD_PASSKEY = process.env.DASHBOARD_PASSKEY || "";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const passkey = String(body.passkey ?? "");

  if (!DASHBOARD_PASSKEY || passkey !== DASHBOARD_PASSKEY) {
    return NextResponse.json({ error: "Incorrect passkey" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  setDashboardSessionCookie(response, DASHBOARD_PASSKEY);

  return response;
}
