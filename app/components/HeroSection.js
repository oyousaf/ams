"use client";

import { FaArrowDown } from "react-icons/fa";

const HeroSection = () => {
  // Function to handle smooth scroll to the About section
  const handleScrollToAbout = () => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative flex flex-col justify-center items-center h-screen p-8 text-center bg-cover bg-center"
      style={{ backgroundImage: "url('/hero.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative z-10 text-white">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
          Ace Motor Sales
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto mb-6">
          Explore our selection of certified, pre-owned vehicles, each
          thoroughly inspected to ensure top quality, reliability, and
          performance.
        </p>
      </div>

      {/* Scroll Button */}
      <button
        onClick={handleScrollToAbout}
        className="z-20 mt-4 flex items-center justify-center bg-rose-900 text-white hover:bg-rose-700 p-4 rounded-full transition duration-200 cursor-pointer"
        aria-label="Scroll to About section"
      >
        <FaArrowDown className="animate-bounce text-3xl" />
      </button>
    </section>
  );
};

export default HeroSection;
