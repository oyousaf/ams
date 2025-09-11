"use client";

import Image from "next/image";
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
      className="relative isolation-auto flex flex-col justify-center items-center min-h-screen px-6 py-12 text-center overflow-hidden"
      aria-label="Hero banner for Ace Motor Sales"
    >
      {/* Background fallback color */}
      <div className="absolute inset-0 z-0 bg-black/90" />

      {/* Background image */}
      <Image
        src="/hero.webp"
        alt="Forecourt"
        fill
        priority
        placeholder="blur"
        blurDataURL="/fallback.webp"
        className="object-cover z-0"
      />

      {/* Glassmorphic gradient overlay */}
      <div className="absolute inset-0 z-10 backdrop-blur-sm bg-gradient-to-br from-black/70 via-zinc-900/60 to-black/70" />

      {/* Content */}
      <motion.header
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-20 text-white max-w-4xl mx-auto"
      >
        <h2
          id="hero-heading"
          className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 tracking-tight bg-rose-950/30 backdrop-blur-md rounded-xl px-4 py-2 shadow-md"
        >
          Drive Away with Confidence
        </h2>
        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto bg-rose-950/20 backdrop-blur-sm rounded-lg px-4 py-3 shadow-md">
          Browse certified pre-owned cars for sale in the UK — professionally
          inspected for quality, reliability, and long-lasting performance.
        </p>

        {/* Hidden duplicate for SEO */}
        <p className="sr-only">
          Explore our selection of certified, pre-owned vehicles — thoroughly
          inspected for quality, reliability, and performance.
        </p>
      </motion.header>

      {/* Down arrow */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.95 }}
        className="z-20 mt-10"
      >
        <FaArrowDown
          onClick={handleScrollToAbout}
          title="Scroll down to learn more"
          className="animate-bounce text-5xl text-rose-600 hover:text-rose-400 cursor-pointer"
          aria-label="Scroll to About section"
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;
