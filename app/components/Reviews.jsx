"use client";

import { useState } from "react";
import { reviews } from "../constants";
import { FaQuoteLeft, FaStar } from "react-icons/fa";
import { motion } from "motion/react";

// Review copy is written as multi-line template literals in constants/index.js,
// whose continuation lines carry source-code indentation. Trim each line so
// that indentation doesn't render as stray leading whitespace mid-sentence.
const normalizeFeedback = (text) =>
  text
    .split("\n")
    .map((line) => line.trim())
    .join("\n");

// Long reviews get clamped; anything under this length is short enough to
// always show in full, so it never grows a "Read more" toggle it doesn't need.
const TRUNCATE_THRESHOLD = 220;

const StarRow = () => (
  <div className="mb-4 flex justify-center gap-1" aria-hidden="true">
    {Array.from({ length: 5 }).map((_, i) => (
      <FaStar key={i} className="text-sm text-amber-400" />
    ))}
  </div>
);

function ReviewCard({ name, feedback, delay }) {
  const [expanded, setExpanded] = useState(false);
  const text = normalizeFeedback(feedback);
  const canTruncate = text.length > TRUNCATE_THRESHOLD;

  return (
    <motion.blockquote
      layout
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45, ease: "easeOut", delay }}
      className="relative flex h-full flex-col rounded-2xl p-8 surface-primary"
    >
      <FaQuoteLeft className="mb-4 text-2xl text-rose-300/40" aria-hidden="true" />

      <StarRow />

      <motion.p
        layout
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className={`flex-1 whitespace-pre-line text-center text-base leading-relaxed text-white/90 md:text-lg ${
          canTruncate && !expanded ? "line-clamp-5" : ""
        }`}
      >
        &ldquo;{text}&rdquo;
      </motion.p>

      {canTruncate && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="mx-auto mt-3 text-sm font-semibold text-rose-300 transition-colors duration-200 hover:text-rose-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 rounded"
        >
          {expanded ? "Read less" : "Read more"}
        </button>
      )}

      <footer className="mt-6 text-center text-base font-semibold text-rose-200 md:text-lg">
        &mdash; {name}
      </footer>
    </motion.blockquote>
  );
}

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

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map(({ name, feedback }, index) => (
          <ReviewCard
            key={index}
            name={name}
            feedback={feedback}
            delay={(index % 3) * 0.08}
          />
        ))}
      </div>
    </section>
  );
};

export default Reviews;
