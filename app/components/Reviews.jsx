"use client";

import { reviews } from "../constants";
import { FaQuoteLeft } from "react-icons/fa";
import { motion } from "framer-motion";

const Reviews = () => {
  return (
    <section
      aria-labelledby="reviews-heading"
      className="py-24 px-4 sm:px-6 md:px-8 lg:px-12"
    >
      <h2
        id="reviews-heading"
        className="mb-16 text-center text-4xl font-bold tracking-tight text-white md:text-5xl"
      >
        What Our Customers Say
      </h2>

      <div className="mx-auto max-w-5xl space-y-12">
        {reviews.map(({ name, feedback }, index) => (
          <motion.blockquote
            key={index}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.45,
              ease: "easeOut",
              delay: index * 0.08,
            }}
            className="
              relative rounded-2xl p-8 sm:p-10
              surface-primary
            "
          >
            <FaQuoteLeft className="absolute left-6 top-6 text-3xl text-rose-400/30" />

            <p className="mx-auto max-w-3xl text-center text-lg italic leading-relaxed text-white md:text-xl">
              “{feedback}”
            </p>

            <footer className="mt-6 text-center text-lg font-semibold text-rose-300 md:text-xl">
              — {name}
            </footer>
          </motion.blockquote>
        ))}
      </div>
    </section>
  );
};

export default Reviews;
