import dynamic from "next/dynamic";
import HeroSection from "./components/HeroSection";
import About from "./components/About";
import LatestCars from "./components/LatestCars";

const Reviews = dynamic(() => import("./components/Reviews"), { ssr: false });
const ScrollToTop = dynamic(() => import("./components/ScrollToTop"), {
  ssr: false,
});
const Snow = dynamic(() => import("./components/Snow"), { ssr: false });

export const metadata = {
  title: "Ace Motor Sales | Certified Used Cars with Nationwide Delivery",
  description:
    "Explore our selection of certified, pre-owned vehicles — thoroughly inspected to ensure top quality, reliability, and performance.",
  keywords: [
    "Ace Motor Sales",
    "Heckmondwike car dealer",
    "used cars Heckmondwike",
    "West Yorkshire car dealer",
    "certified used vehicles UK",
    "affordable second-hand cars",
    "quality used vehicles West Yorkshire",
    "family cars for sale UK",
    "trusted local car dealership",
    "nationwide car delivery UK",
    "pre-owned cars with delivery",
  ],
};

export default function Home() {
  return (
    <main>
      <h1 className="sr-only">
        Explore our selection of certified, pre-owned vehicles — thoroughly
        inspected for quality, reliability, and performance.
      </h1>
      <HeroSection />
      <About />
      <LatestCars />
      <Reviews />
      <ScrollToTop />
      <Snow />
    </main>
  );
}
