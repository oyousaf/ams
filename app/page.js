"use client";

import HeroSection from "./components/HeroSection";
import InstagramPosts from "./components/InstagramPosts";
import ScrollToTopBtn from "./components/ScrollToTopBtn";
import Reviews from "./components/Reviews";
import CarComparison from "./components/CarComparison";
import About from "./components/About";

const Home = () => {
  return (
    <div>
      <HeroSection />
      <About />
      <InstagramPosts />
      <Reviews />
      <ScrollToTopBtn />
    </div>
  );
};

export default Home;
