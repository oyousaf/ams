import HeroSection from "@/components/HeroSection";
import About from "@/components/About";
import LatestCars from "@/components/LatestCars";
import Reviews from "@/components/Reviews";

import ScrollToTopWrapper from "@/components/ScrollToTopWrapper";
import SnowWrapper from "@/components/SnowWrapper";

// ---------- Homepage Metadata ----------
export const metadata = {
  title: "Used Cars in Heckmondwike with Nationwide UK Delivery",
  description:
    "Trusted used car dealership in Heckmondwike, West Yorkshire. Quality pre-owned vehicles, fully inspected, with nationwide UK delivery.",

  alternates: {
    canonical: "https://acemotorsales.uk",
  },

  openGraph: {
    title: "Ace Motor Sales | Used Cars in Heckmondwike – UK Delivery",
    description:
      "Quality pre-owned vehicles from an independent Heckmondwike dealership, with UK-wide delivery.",
    url: "https://acemotorsales.uk",
    siteName: "Ace Motor Sales",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "https://acemotorsales.uk/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Ace Motor Sales used car forecourt in Heckmondwike",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Ace Motor Sales | Used Cars in Heckmondwike",
    description:
      "Quality pre-owned vehicles with UK-wide delivery from an independent Heckmondwike dealer.",
    images: ["https://acemotorsales.uk/hero.jpg"],
  },
};

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <HeroSection />

      {/* About */}
      <section
        id="about"
        aria-labelledby="about-heading"
        className="scroll-mt-24"
      >
        <About />
      </section>
    </>
  );
}
