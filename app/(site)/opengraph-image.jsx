import { ImageResponse } from "next/og";
import { fetchCarsServer } from "@/lib/fetchCars";
import {
  OG_SIZE,
  OgFrame,
  Pill,
  Headline,
  Subline,
  ogOptions,
  loadLogo,
  loadHeroPhoto,
} from "@/lib/og";
import { PHONE_DISPLAY } from "@/lib/carMeta";

export const alt =
  "Ace Motor Sales - quality used cars in Heckmondwike, West Yorkshire";
export const size = OG_SIZE;
export const contentType = "image/png";

// Built on the current hero photo, with a live stock count that refreshes
// alongside the "cars" cache tag.
export default async function Image() {
  const cars = await fetchCarsServer();
  const inStock = cars.filter((car) => !car.isSold).length;

  return new ImageResponse(
    (
      <OgFrame
        photo={await loadHeroPhoto()}
        logo={await loadLogo()}
        footer={["4 Westgate, Heckmondwike", PHONE_DISPLAY]}
      >
        <Pill>
          {inStock > 0
            ? `${inStock} ${inStock === 1 ? "car" : "cars"} in stock now`
            : "New stock arriving weekly"}
        </Pill>
        <Headline>Quality Used Cars in Heckmondwike</Headline>
        <Subline>Inspected · Nationwide delivery · £99 reserves any car</Subline>
      </OgFrame>
    ),
    await ogOptions(),
  );
}
