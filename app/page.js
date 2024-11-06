"use client";

import HeroSection from "./components/HeroSection";
import LatestCars from "./components/LatestCars";
import ScrollToTop from "./components/ScrollToTop";
import Reviews from "./components/Reviews";
import CarComparison from "./components/CarComparison";
import About from "./components/About";

const Home = () => {
  return (
    <div>
      <HeroSection />
      <About />
      <LatestCars />
      <Reviews />
      <ScrollToTop />
    </div>
  );
};

export default Home;
