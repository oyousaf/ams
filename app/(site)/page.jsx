import HeroSection from "@/components/HeroSection";
import About from "@/components/About";
import LatestCars from "@/components/LatestCars";
import Reviews from "@/components/Reviews";
import Faq from "@/components/Faq";

import ScrollToTop from "@/components/ScrollToTop";
import SnowWrapper from "@/components/SnowWrapper";
import LiveChat from "@/components/LiveChat";
import { fetchCarsServer } from "@/lib/fetchCars";

/* -------------------------------------------------
   SEO METADATA
   The share image comes from ./opengraph-image.jsx.
-------------------------------------------------- */

const TITLE = "Used Cars in Heckmondwike, West Yorkshire | Ace Motor Sales";

export const metadata = {
  // absolute: the root layout's "%s | Ace Motor Sales" template would
  // otherwise append the brand a second time.
  title: { absolute: TITLE },

  description:
    "Browse quality used cars for sale in Heckmondwike, West Yorkshire at Ace Motor Sales. Fully inspected vehicles, competitive prices and nationwide UK delivery.",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: TITLE,
    description:
      "Shop quality used cars from Ace Motor Sales in Heckmondwike, West Yorkshire. Fully inspected vehicles, competitive prices and nationwide UK delivery.",
    url: "/",
  },

  twitter: {
    title: TITLE,
    description:
      "Browse quality inspected used cars from Ace Motor Sales in Heckmondwike, with nationwide UK delivery available.",
  },
};

/* -------------------------------------------------
   HOME PAGE
-------------------------------------------------- */

export default async function HomePage() {
  const initialCars = await fetchCarsServer();

  return (
    <>
      <HeroSection />
      <About />
      <LatestCars initialCars={initialCars} />
      <Reviews />
      <Faq />

      <ScrollToTop />
      <SnowWrapper />
      <LiveChat />
    </>
  );
}
