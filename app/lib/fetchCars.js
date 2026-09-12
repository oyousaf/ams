import { normalizeCar } from "./normaliseCar";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_BASE_URL ||
  "https://api.acemotorsales.uk"
).replace(/\/$/, "");

// Server-side fetch used to seed the homepage's initial HTML with real
// inventory (for SEO/crawlers and first paint) - the client component still
// refetches on mount to pick up any changes made after the page was rendered.
export async function fetchCarsServer() {
  try {
    const res = await fetch(`${API_BASE}/api/cars`, { cache: "no-store" });
    if (!res.ok) return [];

    const data = await res.json();
    const rows = Array.isArray(data) ? data : (data.cars ?? []);

    return rows.map(normalizeCar);
  } catch {
    return [];
  }
}
