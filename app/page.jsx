import dynamic from "next/dynamic";
import HeroSection from "./components/HeroSection";
import About from "./components/About";
import LatestCars from "./components/LatestCars";
import Reviews from "./components/Reviews";

const ScrollToTop = dynamic(() => import("./components/ScrollToTop"), {
  ssr: false,
});
const Snow = dynamic(() => import("./components/Snow"), { ssr: false });

export const metadata = {
  title: "Ace Motor Sales - Certified Used Cars with Nationwide Delivery",
  description:
    "Explore our selection of certified, pre-owned vehicles — thoroughly inspected for quality, reliability, and performance.",
};

export default function Home() {
  return (
    <main aria-label="Homepage of Ace Motor Sales">
      <h1 className="sr-only">
        Explore our selection of certified, pre-owned vehicles — thoroughly
        inspected for quality, reliability, and performance.
      </h1>

      <HeroSection />

      <section aria-labelledby="about-heading">
        <About />
      </section>

      <section aria-labelledby="latest-heading">
        <LatestCars />
      </section>

      <section aria-labelledby="reviews-heading">
        <Reviews />
      </section>

      <ScrollToTop />
      <Snow />
    </main>
  );
}
