import HeroSection from "./components/HeroSection";
import About from "./components/About";
import LatestCars from "./components/LatestCars";
import Reviews from "./components/Reviews";

import ScrollToTopWrapper from "./components/ScrollToTopWrapper";
import SnowWrapper from "./components/SnowWrapper";

export const metadata = {
  title: "Ace Motor Sales - Certified Used Cars with Nationwide Delivery",
  description:
    "Explore our selection of certified, pre-owned vehicles — thoroughly inspected for quality, reliability, and performance.",
};

export default function Home() {
  return (
    <main aria-label="Homepage of Ace Motor Sales">
      <h1 className="sr-only">
        Ace Motor Sales – Certified Used Cars with Nationwide Delivery across
        the UK.
      </h1>

      <section
        id="hero"
        aria-labelledby="hero-heading"
        className="scroll-mt-10"
      >
        <HeroSection />
      </section>

      <section
        id="about"
        aria-labelledby="about-heading"
        className="scroll-mt-10"
      >
        <About />
      </section>

      <section
        id="cars"
        aria-labelledby="cars-heading"
        className="scroll-mt-10"
      >
        <LatestCars />
      </section>

      <section
        id="reviews"
        aria-labelledby="reviews-heading"
        className="scroll-mt-10"
      >
        <Reviews />
      </section>

      <ScrollToTopWrapper />
      <SnowWrapper />
    </main>
  );
}
