import { normalizeCar } from "./normaliseCar";
import { carSlug, slugify } from "./carMeta";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_BASE_URL ||
  "https://api.acemotorsales.uk"
).replace(/\/$/, "");

// Stock is cached and tagged so pages can be served from the CDN. The
// dashboard's write routes (api/cars) call revalidateTag(CARS_TAG) after every
// change, so edits show up straight away; the time-based revalidate is only a
// safety net for changes made outside the dashboard.
export const CARS_TAG = "cars";
const REVALIDATE_SECONDS = 300;

export async function fetchCarsServer() {
  try {
    const res = await fetch(`${API_BASE}/api/cars`, {
      next: { revalidate: REVALIDATE_SECONDS, tags: [CARS_TAG] },
    });
    if (!res.ok) return [];

    const data = await res.json();
    const rows = Array.isArray(data) ? data : (data.cars ?? []);

    return rows.map(normalizeCar);
  } catch {
    return [];
  }
}

// Resolves a /cars/[slug] param. Matches the canonical slug first; if the
// title has since changed, falls back to the trailing id so old links still
// land on the car (the page then redirects to the canonical slug).
export async function fetchCarBySlug(slug) {
  const cars = await fetchCarsServer();
  const exact = cars.find((car) => carSlug(car) === slug);
  if (exact) return { car: exact, canonical: true };

  const byId = cars.find((car) => slug.endsWith(`-${slugify(String(car.id))}`));
  return byId ? { car: byId, canonical: false } : { car: null, canonical: false };
}
