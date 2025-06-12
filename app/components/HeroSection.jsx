"use client";

import { motion } from "framer-motion";
import { FaArrowDown } from "react-icons/fa";

const HeroSection = () => {
  const handleScrollToAbout = () => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative flex flex-col justify-center items-center h-screen px-6 py-12 text-center bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: "url('/hero.jpg')" }}
      aria-label="Hero banner for Ace Motor Sales"
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-zinc-900/70 to-black/80 backdrop-blur-sm" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 text-white max-w-4xl mx-auto"
      >
        <h1 className="text-2xl md:text-4xl font-bold mb-6 leading-relaxed tracking-tight">
          Explore our selection of certified, pre-owned vehicles — thoroughly
          inspected for quality, reliability, and performance.
        </h1>
      </motion.div>

      {/* Down arrow */}
      <motion.div
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="z-20 mt-10"
      >
        <FaArrowDown
          onClick={handleScrollToAbout}
          className="animate-bounce text-5xl text-rose-600 hover:text-rose-400 cursor-pointer"
          aria-label="Scroll to About section"
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;
