import { ImageResponse } from "next/og";
import { fetchCarBySlug } from "@/lib/fetchCars";
import { resolveImages } from "@/lib/resolveImage";
import {
  OG_SIZE,
  OgFrame,
  Pill,
  Headline,
  Subline,
  ogOptions,
  loadLogo,
  loadHeroPhoto,
  remotePhotoDataUrl,
} from "@/lib/og";
import { SITE_URL, PHONE_DISPLAY, formatPrice } from "@/lib/carMeta";

export const alt = "Used car for sale at Ace Motor Sales, Heckmondwike";
export const size = OG_SIZE;
export const contentType = "image/png";

// Per-car share card: the car's own first photo, price, title and key facts.
export default async function Image({ params }) {
  const { slug } = await params;
  const { car } = await fetchCarBySlug(slug);

  const first = car ? resolveImages(car.imageUrls)[0] : null;
  const photoUrl = first?.startsWith("http") ? first : first && `${SITE_URL}${first}`;
  const photo =
    (photoUrl && (await remotePhotoDataUrl(photoUrl))) || (await loadHeroPhoto());

  const facts = car
    ? [
        car.year || null,
        car.mileage ? `${Number(car.mileage).toLocaleString("en-GB")} miles` : null,
        car.transmission,
        car.engineType,
      ].filter(Boolean)
    : [];

  return new ImageResponse(
    (
      <OgFrame
        photo={photo}
        logo={await loadLogo()}
        footer={["Heckmondwike · Nationwide delivery", PHONE_DISPLAY]}
      >
        {car ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <Pill>{car.isSold ? "Sold" : formatPrice(car.price)}</Pill>
            <Headline size={car.title.length > 24 ? 56 : 68} uppercase>
              {car.title}
            </Headline>
            {facts.length > 0 && <Subline>{facts.join(" · ")}</Subline>}
          </div>
        ) : (
          <Headline>Quality Used Cars in Heckmondwike</Headline>
        )}
      </OgFrame>
    ),
    await ogOptions(),
  );
}
