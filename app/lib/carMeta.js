// Shared, icon-free car helpers - safe to import from server components,
// metadata routes and client components alike.

export const SITE_URL = "https://acemotorsales.uk";
export const PHONE_E164 = "+447809107655";
export const PHONE_DISPLAY = "07809 107655";

// Key -> display name. Keys match the logo map in constants/index.js.
export const makeNames = {
  alfaromeo: "Alfa Romeo",
  astonmartin: "Aston Martin",
  audi: "Audi",
  bentley: "Bentley",
  bmw: "BMW",
  bugatti: "Bugatti",
  citroen: "Citroën",
  chevrolet: "Chevrolet",
  chrysler: "Chrysler",
  dacia: "Dacia",
  dsautomobiles: "DS Automobiles",
  ferrari: "Ferrari",
  fiat: "Fiat",
  ford: "Ford",
  honda: "Honda",
  hyundai: "Hyundai",
  jaguar: "Jaguar",
  jeep: "Jeep",
  kia: "Kia",
  lamborghini: "Lamborghini",
  landrover: "Land Rover",
  rangerover: "Land Rover",
  maserati: "Maserati",
  mazda: "Mazda",
  mclaren: "McLaren",
  mercedes: "Mercedes-Benz",
  mini: "MINI",
  mitsubishi: "Mitsubishi",
  nissan: "Nissan",
  opel: "Opel",
  peugeot: "Peugeot",
  porsche: "Porsche",
  renault: "Renault",
  rollsroyce: "Rolls-Royce",
  seat: "SEAT",
  skoda: "Škoda",
  smart: "smart",
  subaru: "Subaru",
  suzuki: "Suzuki",
  tesla: "Tesla",
  toyota: "Toyota",
  volkswagen: "Volkswagen",
  vw: "Volkswagen",
  volvo: "Volvo",
  vauxhall: "Vauxhall",
};

const makeKeys = Object.keys(makeNames);

export function detectMake(title) {
  const compact = title?.toLowerCase().replace(/\s+/g, "") || "";
  return makeKeys.find((key) => compact.includes(key)) ?? null;
}

export function slugify(text) {
  return (
    String(text ?? "")
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "car"
  );
}

// The id suffix keeps slugs unique even when two cars share a title.
export function carSlug(car) {
  return `${slugify(car.title)}-${slugify(String(car.id))}`;
}

export function carPath(car) {
  return `/cars/${carSlug(car)}`;
}

export function formatPrice(price) {
  const n = Number(price);
  return Number.isFinite(n) && n > 0 ? `£${n.toLocaleString("en-GB")}` : "POA";
}
