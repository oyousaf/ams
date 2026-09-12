"use client";

import { reviews } from "../constants";
import { FaQuoteLeft, FaStar } from "react-icons/fa";
import { motion } from "motion/react";

const StarRow = () => (
  <div className="mb-4 flex justify-center gap-1" aria-hidden="true">
    {Array.from({ length: 5 }).map((_, i) => (
      <FaStar key={i} className="text-sm text-amber-400" />
    ))}
  </div>
);

const Reviews = () => {
  return (
    <section
      aria-labelledby="reviews-heading"
      className="py-24 px-4 sm:px-6 md:px-8 lg:px-12"
    >
      <div className="mx-auto mb-16 max-w-2xl text-center">
        <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-rose-400">
          Trusted Locally
        </span>
        <h2
          id="reviews-heading"
          className="text-4xl font-bold tracking-tight text-white md:text-5xl"
        >
          What Our Customers Say
        </h2>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-6 lg:grid-cols-2">
        {reviews.map(({ name, feedback }, index) => (
          <motion.blockquote
            key={index}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.45,
              ease: "easeOut",
              delay: (index % 2) * 0.08,
            }}
            className="relative flex h-full flex-col rounded-2xl p-8 surface-primary"
          >
            <FaQuoteLeft
              className="mb-4 text-2xl text-rose-300/40"
              aria-hidden="true"
            />

            <StarRow />

            <p className="flex-1 whitespace-pre-line text-center text-base leading-relaxed text-white/90 md:text-lg">
              &ldquo;{feedback}&rdquo;
            </p>

            <footer className="mt-6 text-center text-base font-semibold text-rose-200 md:text-lg">
              &mdash; {name}
            </footer>
          </motion.blockquote>
        ))}
      </div>
    </section>
  );
};

export default Reviews;
