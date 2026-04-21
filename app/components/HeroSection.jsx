"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FaArrowDown } from "react-icons/fa";

const HeroSection = () => {
  const handleScrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      id="hero"
      aria-labelledby="hero-heading"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-12 text-center"
    >
      {/* Dark base */}
      <div className="absolute inset-0 z-0 bg-black/90" />

      {/* Hero image */}
      <Image
        src="/hero.webp"
        alt="Ace Motor Sales forecourt in Heckmondwike, West Yorkshire"
        fill
        priority
        fetchPriority="high"
        decoding="async"
        quality={85}
        sizes="100vw"
        className="absolute inset-0 z-0 scale-105 object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 z-10 bg-linear-to-br from-black/70 via-zinc-900/60 to-black/70 backdrop-blur-sm" />

      {/* Content wrapper */}
      <div className="relative z-20 w-full max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="mx-auto max-w-4xl text-white"
        >
          <h1
            id="hero-heading"
            className="mb-6 rounded-xl bg-rose-950/50 px-4 py-3 text-4xl font-extrabold leading-tight tracking-tight shadow-md backdrop-blur-md md:text-6xl"
          >
            Quality Without Compromise
          </h1>

          <p className="mx-auto mb-8 max-w-3xl rounded-lg bg-rose-950/30 px-3 py-2 text-lg text-white/90 shadow-md backdrop-blur md:text-xl">
            Carefully selected used vehicles, rigorously inspected and
            professionally prepared for the road ahead.
          </p>
        </motion.div>

        {/* Scroll cue */}
        <motion.button
          type="button"
          aria-label="Scroll to about section"
          onClick={handleScrollToAbout}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.33,
            ease: "easeOut",
          }}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          className="mx-auto mt-10 flex justify-center cursor-pointer text-rose-500/80 hover:text-rose-400
          transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40"
        >
          <FaArrowDown className="animate-bounce text-5xl" />
        </motion.button>
      </div>
    </header>
  );
};

export default HeroSection;
