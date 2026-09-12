"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { FaArrowDown, FaChevronRight } from "react-icons/fa";

const HeroSection = () => {
  const scrollTo = (id) => () => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      id="hero"
      aria-labelledby="hero-heading"
      className="relative flex min-h-screen items-end overflow-hidden px-6 pb-20 pt-40 text-left sm:items-center sm:pb-12 sm:text-center"
    >
      {/* Hero image */}
      <Image
        src="/hero.webp"
        alt="Ace Motor Sales forecourt in Heckmondwike, West Yorkshire"
        fill
        priority
        fetchPriority="high"
        decoding="async"
        quality={70}
        sizes="100vw"
        className="absolute inset-0 z-0 scale-105 object-cover"
      />

      {/* Scrim - strongest at the bottom/left where the text sits, with a
          deliberate subtle rose tint (not pure black) matching the site's
          rose/maroon palette used elsewhere (cards, buttons, chat). */}
      <div className="absolute inset-0 z-10 bg-linear-to-t from-rose-950/95 via-rose-950/70 to-rose-950/25 backdrop-blur-sm sm:bg-linear-to-br sm:from-rose-950/80 sm:via-rose-950/55 sm:to-rose-950/30" />

      {/* Content wrapper */}
      <div className="relative z-20 mx-auto w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-400/30 bg-rose-950/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-rose-200 backdrop-blur-sm sm:text-sm">
            Heckmondwike &middot; West Yorkshire
          </span>

          <h1
            id="hero-heading"
            className="mb-5 text-4xl font-extrabold leading-[1.05] tracking-tight text-white text-balance [text-shadow:0_2px_24px_rgba(0,0,0,0.6)] sm:mx-auto sm:max-w-3xl md:text-6xl lg:text-7xl"
          >
            Quality Used Cars, Without Compromise
          </h1>

          <p className="max-w-xl text-lg leading-relaxed text-white/85 [text-shadow:0_1px_12px_rgba(0,0,0,0.5)] sm:mx-auto sm:max-w-2xl md:text-xl">
            Carefully selected used vehicles, rigorously inspected and
            professionally prepared for the road ahead.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <motion.button
              type="button"
              onClick={scrollTo("cars")}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-br from-rose-700 via-rose-600 to-rose-800 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-rose-950/50 transition-shadow duration-300 ease-out hover:shadow-[0_0_30px_rgba(244,63,94,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
            >
              View Our Cars
              <FaChevronRight className="text-sm" />
            </motion.button>

            <motion.button
              type="button"
              onClick={scrollTo("contact")}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 px-7 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-colors duration-300 ease-out hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              Get in Touch
            </motion.button>
          </div>
        </motion.div>

        {/* Scroll cue */}
        <motion.button
          type="button"
          aria-label="Scroll to about section"
          onClick={scrollTo("about")}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.33, ease: "easeOut" }}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          className="mx-auto mt-14 hidden cursor-pointer justify-center text-rose-400/70 transition-colors duration-300 hover:text-rose-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40 sm:flex"
        >
          <FaArrowDown className="animate-bounce text-3xl" />
        </motion.button>
      </div>
    </header>
  );
};

export default HeroSection;
