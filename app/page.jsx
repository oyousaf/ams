"use client";

import HeroSection from "./components/HeroSection";
import About from "./components/About";
import LatestCars from "./components/LatestCars";
import Reviews from "./components/Reviews";
import ScrollToTop from "./components/ScrollToTop";
import Snow from "./components/Snow";

const Home = () => {
  return (
    <div>
      {/* SEO Fallback for accessibility */}
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
    </div>
  );
};

export default Home;
