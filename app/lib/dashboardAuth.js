import { createHmac, timingSafeEqual } from "node:crypto";

export const DASHBOARD_SESSION_COOKIE = "ams_dashboard_session";

function getDashboardPasskey() {
  return process.env.DASHBOARD_PASSKEY || "";
}

function getDashboardSecret() {
  return process.env.DASHBOARD_SESSION_SECRET || process.env.DASHBOARD_PASSKEY || "ams-dashboard-dev-secret";
}

export function createDashboardSessionToken(value = getDashboardPasskey()) {
  return createHmac("sha256", getDashboardSecret())
    .update(value)
    .digest("base64url");
}

export function setDashboardSessionCookie(response, value = getDashboardPasskey()) {
  if (!value) return response;

  response.cookies.set(DASHBOARD_SESSION_COOKIE, createDashboardSessionToken(value), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 6,
  });

  return response;
}

export function clearDashboardSessionCookie(response) {
  response.cookies.set(DASHBOARD_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}

export function verifyDashboardSession(cookieValue) {
  const passkey = getDashboardPasskey();

  if (!cookieValue || !passkey) return false;

  try {
    const expected = createDashboardSessionToken(passkey);
    const actual = Buffer.from(cookieValue);
    const expectedBuffer = Buffer.from(expected);

    if (actual.length !== expectedBuffer.length) return false;

    return timingSafeEqual(actual, expectedBuffer);
  } catch {
    return false;
  }
}
