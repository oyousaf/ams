import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { DASHBOARD_SESSION_COOKIE, verifyDashboardSession } from "@/lib/dashboardAuth";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_BASE_URL ||
  "https://api.acemotorsales.uk"
).replace(/\/$/, "");

async function proxyRequest(url, init = {}) {
  const response = await fetch(url, {
    ...init,
    cache: "no-store",
  });

  const contentType = response.headers.get("content-type") || "";
  const rawText = await response.text();

  if (!rawText) {
    return new NextResponse(null, {
      status: response.status,
      statusText: response.statusText,
    });
  }

  if (contentType.includes("application/json")) {
    return NextResponse.json(JSON.parse(rawText), {
      status: response.status,
      statusText: response.statusText,
    });
  }

  return new NextResponse(rawText, {
    status: response.status,
    statusText: response.statusText,
    headers: {
      "content-type": contentType || "text/plain; charset=utf-8",
    },
  });
}

export async function GET() {
  return proxyRequest(`${API_BASE}/api/cars`);
}

export async function POST(request) {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(DASHBOARD_SESSION_COOKIE)?.value ?? "";

  if (!verifyDashboardSession(cookieValue)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();

  return proxyRequest(`${API_BASE}/api/cars`, {
    method: "POST",
    body: formData,
  });
}
