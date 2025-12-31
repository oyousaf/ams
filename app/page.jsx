import HeroSection from "./components/HeroSection";
import About from "./components/About";
import LatestCars from "./components/LatestCars";
import Reviews from "./components/Reviews";

import ScrollToTopWrapper from "./components/ScrollToTopWrapper";
import SnowWrapper from "./components/SnowWrapper";

// ---------- Homepage Metadata ----------
export const metadata = {
  title: "Used Cars in Heckmondwike with Nationwide UK Delivery",
  description:
    "Trusted used car dealership in Heckmondwike, West Yorkshire. Quality pre-owned vehicles, fully inspected, with nationwide UK delivery available.",
  openGraph: {
    title: "Ace Motor Sales | Used Cars in Heckmondwike – UK Delivery",
    description:
      "Quality pre-owned vehicles from an independent Heckmondwike dealership, with UK-wide delivery.",
    url: "https://acemotorsales.uk",
    siteName: "Ace Motor Sales",
    images: [
      {
        url: "https://acemotorsales.uk/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Ace Motor Sales used car forecourt in Heckmondwike",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ace Motor Sales | Used Cars in Heckmondwike",
    description:
      "Quality pre-owned vehicles with UK-wide delivery from an independent Heckmondwike dealer.",
    images: ["https://acemotorsales.uk/hero.jpg"],
  },
};

export default function Home() {
  return (
    <main
      id="main-content"
      aria-label="Ace Motor Sales Homepage"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <HeroSection />

      <section id="about" className="scroll-mt-24">
        <About />
      </section>

      <section id="cars" className="scroll-mt-24">
        <LatestCars />
      </section>

      <section id="reviews" className="scroll-mt-24">
        <Reviews />
      </section>

      <ScrollToTopWrapper />
      <SnowWrapper />
    </main>
  );
}
