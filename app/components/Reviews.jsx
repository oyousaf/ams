"use client";

import { reviews } from "../constants/index";
import { FaQuoteLeft } from "react-icons/fa";
import { motion } from "framer-motion";

const Reviews = () => {
  return (
    <section
      id="reviews"
      aria-labelledby="reviews-heading"
      className="py-24 px-4 sm:px-6 md:px-8 lg:px-12"
    >
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-white">
        Reviews
      </h2>

      <div className="space-y-12 max-w-5xl mx-auto ">
        {reviews.map(({ name, feedback }, index) => (
          <motion.blockquote
            key={index}
            className="relative p-8 sm:p-10 rounded-2xl tile-glow bg-gradient-to-br from-rose-900 via-rose-800 to-rose-950 text-white shadow-md"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: index * 0.1,
              duration: 0.4,
              type: "spring",
              stiffness: 240,
              damping: 20,
            }}
            whileHover={{ scale: 1.03 }}
          >
            <FaQuoteLeft className="absolute top-4 left-4 text-3xl text-rose-400 opacity-30" />
            <p className="text-lg md:text-xl italic leading-relaxed text-center">
              “{feedback}”
            </p>
            <footer className="mt-6 text-center text-2xl font-semibold text-rose-300">
              — {name}
            </footer>
          </motion.blockquote>
        ))}
      </div>
    </section>
  );
};

export default Reviews;
