const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";
const FALLBACK = "/fallback.webp";

export function resolveImage(src) {
  if (!src) return FALLBACK;

  if (src.startsWith("blob:")) return src;

  if (src.startsWith("http")) return src;

  if (src.startsWith("/")) return `${API_BASE}${src}`;

  return FALLBACK;
}

export function resolveImages(input) {
  if (!input) return [FALLBACK];

  const arr = Array.isArray(input) ? input : [input];

  return arr.map((src) => resolveImage(src));
}
