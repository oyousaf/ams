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
        <h1 className="text-2xl md:text-3xl max-w-3xl mx-auto mb-6">
          Explore our selection of certified, pre-owned vehicles, each
          thoroughly inspected to ensure top quality, reliability, and
          performance.
        </h1>
      </div>

      {/* Scroll Button */}

      <FaArrowDown
        onClick={handleScrollToAbout}
        className="animate-bounce text-5xl z-20 mt-4 flex items-center justify-center text-rose-700 hover:text-rose-500 transition duration-300 cursor-pointer"
        aria-label="Scroll to About section"
      />
    </section>
  );
};

export default HeroSection;
