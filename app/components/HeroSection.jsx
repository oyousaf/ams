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
    <>
      {/* SEO Fallback */}
      <h1 className="sr-only">
        Explore our selection of certified, pre-owned vehicles — thoroughly
        inspected for quality, reliability, and performance.
      </h1>

      <section
        id="hero"
        className="relative flex flex-col justify-center items-center h-screen px-6 py-12 text-center overflow-hidden"
        aria-label="Hero banner for Ace Motor Sales"
      >
        {/* Background image */}
        <Image
          src="/hero.jpg"
          alt="Hero background"
          fill
          priority
          placeholder="blur"
          blurDataURL="/fallback.webp"
          className="object-cover z-0"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-zinc-900/70 to-black/80 backdrop-blur-sm z-10" />

        {/* Content */}
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-20 text-white max-w-4xl mx-auto"
        >
          <h1 className="text-2xl md:text-4xl font-bold mb-6 leading-relaxed tracking-tight bg-rose-950/30 backdrop-blur-md rounded-xl px-4 py-2 shadow-md">
            Explore our selection of certified, pre-owned vehicles — thoroughly
            inspected for quality, reliability, and performance.
          </h1>
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
            className="animate-bounce text-5xl text-rose-600 hover:text-rose-400 cursor-pointer"
            aria-label="Scroll to About section"
          />
        </motion.div>
      </section>
    </>
  );
};

export default HeroSection;