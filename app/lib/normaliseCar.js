function toArray(v) {
  if (!v) return [];

  if (Array.isArray(v)) return v;

  if (typeof v === "string") {
    try {
      const parsed = JSON.parse(v);
      if (Array.isArray(parsed)) return parsed;
    } catch {}

    return [v];
  }

  return [];
}

function toBool(v) {
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v === 1;

  if (typeof v === "string") {
    const val = v.toLowerCase();
    return val === "true" || val === "1";
  }

  return false;
}

export function normalizeCar(raw) {
  const imageUrls =
    toArray(raw.imageUrls) ||
    toArray(raw.image_urls) ||
    toArray(raw.imageUrl) ||
    toArray(raw.image_url);

  return {
    ...raw,

    imageUrls,

    engineType: raw.engineType ?? raw.engine_type ?? raw.engine,

    engineSize: raw.engineSize ?? raw.engine_size ?? raw.engine_capacity,

    carType: raw.carType ?? raw.car_type ?? raw.body_type,

    isFeatured: toBool(raw.isFeatured ?? raw.is_featured ?? raw.featured),

    isSold: toBool(raw.isSold ?? raw.is_sold ?? raw.sold),

    createdAt: raw.createdAt ?? raw.created_at ?? raw.created,
  };
}
