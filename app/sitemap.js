import { fetchCarsServer } from "@/lib/fetchCars";
import { SITE_URL, carPath } from "@/lib/carMeta";

const toDate = (value) => {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
};

// Google ignores changeFrequency/priority; an honest lastModified is what counts.
export default async function sitemap() {
  const cars = await fetchCarsServer();

  const carEntries = cars.map((car) => ({
    url: `${SITE_URL}${carPath(car)}`,
    lastModified: toDate(car.updatedAt ?? car.updated_at ?? car.createdAt),
  }));

  const newestStock = carEntries
    .map((entry) => entry.lastModified)
    .filter(Boolean)
    .sort((a, b) => b - a)[0];

  return [
    { url: SITE_URL, lastModified: newestStock },
    { url: `${SITE_URL}/privacy` },
    ...carEntries,
  ];
}
