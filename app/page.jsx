"use client";

import HeroSection from "./components/HeroSection";
import About from "./components/About";
//import LatestCars from "./components/LatestCars";
import Reviews from "./components/Reviews";
import ScrollToTop from "./components/ScrollToTop";
import Snow from "./components/Snow";

const Home = () => {
  return (
    <div>
      <HeroSection />
      <About />
      <Reviews />
      <ScrollToTop />
      <Snow />
    </div>
  );
};

export default Home;
