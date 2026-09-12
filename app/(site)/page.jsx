import HeroSection from "@/components/HeroSection";
import About from "@/components/About";
import LatestCars from "@/components/LatestCars";
import Reviews from "@/components/Reviews";

import ScrollToTop from "@/components/ScrollToTop";
import SnowWrapper from "@/components/SnowWrapper";
import LiveChat from "@/components/LiveChat";
import { fetchCarsServer } from "@/lib/fetchCars";

export const metadata = {
  title: "Used Cars in Heckmondwike | West Yorkshire Car Dealer",
  description:
    "Browse used cars for sale in Heckmondwike, West Yorkshire. Fully inspected vehicles with competitive prices and nationwide UK delivery available.",

  alternates: {
    canonical: "https://acemotorsales.uk",
  },

  openGraph: {
    title: "Used Cars in Heckmondwike | Ace Motor Sales",
    description:
      "Explore quality used cars in Heckmondwike with UK-wide delivery. Trusted independent dealer.",
    url: "https://acemotorsales.uk",
    siteName: "Ace Motor Sales",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "https://acemotorsales.uk/hero.webp",
        width: 968,
        height: 726,
        alt: "Used cars at Ace Motor Sales Heckmondwike",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Used Cars in Heckmondwike | Ace Motor Sales",
    description:
      "Quality used cars with UK delivery from a trusted Heckmondwike dealership.",
    images: ["https://acemotorsales.uk/hero.webp"],
  },
};

export default async function HomePage() {
  const initialCars = await fetchCarsServer();

  return (
    <>
      <HeroSection />

      <section
        id="about"
        aria-labelledby="about-heading"
        className="scroll-mt-24"
      >
        <About />
      </section>

      <section
        id="cars"
        aria-labelledby="cars-heading"
        className="scroll-mt-24"
      >
        <LatestCars initialCars={initialCars} />
      </section>

      <section
        id="reviews"
        aria-labelledby="reviews-heading"
        className="scroll-mt-24"
      >
        <Reviews />
      </section>

      <ScrollToTop />
      <SnowWrapper />
      <LiveChat />
    </>
  );
}
