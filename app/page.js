"use client";

import HeroSection from "./components/HeroSection";
import About from "./components/About";
import LatestCars from "./components/LatestCars";
import Reviews from "./components/Reviews";
import ScrollToTop from "./components/ScrollToTop";

import Snowfall from "react-snowfall";

const Home = () => {
  const isDecember = new Date().getMonth() === 11;

  return (
    <div>
      {isDecember && <Snowfall style={{ position: "fixed", zIndex: 40 }} />}
      <HeroSection />
      <About />
      <LatestCars />
      <Reviews />
      <ScrollToTop />
    </div>
  );
};

export default Home;
