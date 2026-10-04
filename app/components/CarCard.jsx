"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaEye } from "react-icons/fa";
import Divider from "./Divider";
import { motion } from "motion/react";
import { resolveImages } from "@/lib/resolveImage";
import { PHONE_E164, formatPrice } from "@/lib/carMeta";

const FALLBACK_IMAGE = "/fallback.webp";

// A plain left-click opens the quick-view modal; anything else (new tab,
// middle-click, no JS, crawlers) follows the real link to the car's page.
const isPlainClick = (e) =>
  e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;

const CarCard = React.memo(function CarCard({ car, logo, onOpen }) {
  const firstImage = useMemo(() => {
    const images = resolveImages(car.imageUrls);
    return images[0] || FALLBACK_IMAGE;
  }, [car.imageUrls]);

  const price = formatPrice(car.price);

  return (
    <motion.article
      aria-labelledby={`car-title-${car.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -6,
        transition: { type: "spring", stiffness: 420, damping: 26 },
      }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="relative cursor-pointer rounded-xl p-4 flex flex-col text-white
        bg-linear-to-br from-rose-900 via-rose-800 to-rose-950
        shadow-md transition-shadow duration-300
        hover:shadow-[0_0_20px_rgba(244,63,94,0.35)]
        will-change-transform
        has-[.card-link:focus-visible]:ring-2 has-[.card-link:focus-visible]:ring-rose-300"
    >
      <div className="relative">
        {car.isFeatured && (
          <span
            className="absolute top-2 left-2 z-10 rounded-full px-3 py-1 text-xs font-semibold uppercase
            bg-amber-400 text-rose-900 backdrop-blur shadow-md"
          >
            Featured
          </span>
        )}

        <div className="relative h-48 w-full overflow-hidden rounded-md">
          <Image
            src={firstImage}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`object-cover transition-opacity ${
              car.isSold ? "opacity-60" : "opacity-100"
            }`}
          />
        </div>

        {car.isSold && (
          <div
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center
            bg-rose-950/60 text-rose-200 text-4xl font-extrabold
            tracking-widest rounded-md pointer-events-none"
          >
            SOLD
          </div>
        )}
      </div>

      {logo && (
        <div className="my-4 flex justify-center" aria-hidden="true">
          {logo}
        </div>
      )}

      <h3
        id={`car-title-${car.id}`}
        className="mb-2 text-center text-2xl md:text-3xl
        font-bold uppercase text-rose-200"
      >
        {/* Stretched link: its ::after covers the whole card, so the card
            stays one big click target without nesting interactive elements. */}
        <Link
          href={car.href}
          onClick={(e) => {
            if (!isPlainClick(e)) return;
            e.preventDefault();
            onOpen();
          }}
          className="card-link after:absolute after:inset-0 after:rounded-xl after:content-[''] focus-visible:outline-none"
        >
          {car.title}
          {car.isSold && <span className="sr-only"> (sold)</span>}
        </Link>
      </h3>

      <Divider />

      <p
        className="mb-4 text-center text-base md:text-lg
        text-zinc-200 line-clamp-3"
      >
        {car.description}
      </p>

      <Divider />

      <div className="mt-auto text-center">
        <motion.a
          href={`tel:${PHONE_E164}`}
          aria-label={`Call about the ${car.title}, priced at ${price}`}
          className="relative z-10 inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full
          text-2xl md:text-3xl font-bold
          bg-rose-500/20 text-rose-100 transition-colors
          hover:bg-rose-500/30 hover:text-rose-50
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {price}
        </motion.a>

        {/* Visual cue only - the whole card is the "view" action */}
        <span
          aria-hidden="true"
          className="mx-auto grid w-fit place-items-center rounded-full p-2 text-rose-300"
        >
          <FaEye className="text-2xl" />
        </span>
      </div>
    </motion.article>
  );
});

export default CarCard;
