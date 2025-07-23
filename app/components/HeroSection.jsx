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
      id="hero"
      className="relative isolation-auto flex flex-col justify-center items-center min-h-screen px-6 py-12 text-center overflow-hidden"
      aria-label="Hero banner for Ace Motor Sales"
    >
      {/* Background fallback color */}
      <div className="absolute inset-0 z-0 bg-black/90" />

      {/* Background image */}
      <Image
        src="/hero.webp"
        alt="Showroom background with premium used cars"
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
        <h2 className="text-2xl md:text-4xl font-bold mb-6 leading-relaxed tracking-tight bg-rose-950/30 backdrop-blur-md rounded-xl px-4 py-2 shadow-md">
          Explore our selection of certified, pre-owned vehicles — thoroughly
          inspected for quality, reliability, and performance.
        </h2>

        {/* Hidden duplicate for SEO (if h1 is in page.tsx) */}
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
