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
      className="relative flex flex-col justify-center items-center min-h-screen px-6 py-12 text-center overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Fallback base */}
      <div className="absolute inset-0 bg-black/90 z-0" />

      {/* Hero image */}
      <Image
        src="/hero.webp"
        alt="Ace Motor Sales forecourt in West Yorkshire"
        fill
        priority
        quality={85}
        sizes="100vw"
        className="absolute inset-0 object-cover object-center z-0 scale-105 animate-heroZoom"
      />

      {/* Glass gradient overlay */}
      <div className="absolute inset-0 z-10 backdrop-blur-sm bg-gradient-to-br from-black/70 via-zinc-900/60 to-black/70" />

      {/* SEO assist */}
      <p className="sr-only">
        Used car dealership in Heckmondwike offering nationwide UK vehicle
        delivery.
      </p>

      {/* Content */}
      <motion.header
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-20 text-white max-w-4xl mx-auto"
      >
        <h1
          id="hero-heading"
          className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 tracking-tight bg-rose-950/30 backdrop-blur-md rounded-xl px-4 py-2 shadow-md"
        >
          Drive Away with Confidence
        </h1>

        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto bg-rose-950/20 backdrop-blur-sm rounded-lg px-4 py-3 shadow-md">
          Quality pre-owned cars with nationwide UK delivery — every vehicle
          carefully inspected for reliability and long-term performance.
        </p>
      </motion.header>

      {/* Down arrow */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.95 }}
        className="z-20 mt-10"
      >
        <FaArrowDown
          onClick={handleScrollToAbout}
          title="Scroll to about section"
          aria-label="Scroll to about section"
          className="animate-bounce text-5xl text-rose-600 hover:text-rose-400 cursor-pointer"
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;
