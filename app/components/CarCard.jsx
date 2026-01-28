"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { FaEye } from "react-icons/fa";
import Divider from "./Divider";
import { motion } from "framer-motion";

const PHONE_NUMBER = "+447809107655";

const CarCard = React.memo(({ car, logo, onOpen }) => {
  const fallbackImage = "/fallback.webp";
  const firstImage = car.imageUrl?.[0] || fallbackImage;

  const formattedPrice = useMemo(() => {
    if (!Number.isFinite(car.price)) return "POA";
    return car.price.toLocaleString("en-GB");
  }, [car.price]);

  return (
    <motion.article
      tabIndex={0}
      aria-labelledby={`car-title-${car.$id}`}
      aria-describedby={`car-desc-${car.$id}`}
      onClick={onOpen}
      onKeyDown={(e) => e.key === "Enter" && onOpen()}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="cursor-pointer rounded-xl p-4 flex flex-col bg-linear-to-br from-rose-900 via-rose-800 to-rose-950
        text-white shadow-md transition-shadow duration-300 hover:shadow-[0_0_20px_rgba(244,63,94,0.35)]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
    >
      {/* Image */}
      <div className="relative">
        {car.isFeatured && (
          <div className="absolute top-2 left-2 z-10">
            <span className="bg-yellow-400 text-rose-950 text-xs font-bold px-2 py-1 rounded shadow uppercase">
              Featured
            </span>
          </div>
        )}

        <Image
          src={firstImage}
          alt={car.title}
          width={500}
          height={192}
          className={`w-full rounded-md object-cover transition-opacity duration-300 ${
            car.isSold ? "opacity-60" : "opacity-100"
          }`}
          placeholder="blur"
          blurDataURL="/fallback.webp"
        />

        {car.isSold && (
          <div className="absolute inset-0 flex items-center justify-center bg-rose-950/60 text-rose-200 text-4xl font-extrabold tracking-widest rounded-md pointer-events-none">
            SOLD
          </div>
        )}
      </div>

      {logo && <div className="my-4 flex justify-center">{logo}</div>}

      <h3
        id={`car-title-${car.$id}`}
        className="mb-2 text-center text-2xl md:text-3xl font-bold uppercase"
      >
        {car.title}
      </h3>

      <Divider />

      <p
        id={`car-desc-${car.$id}`}
        className="mb-4 text-center text-base md:text-lg text-zinc-100 line-clamp-3"
      >
        {car.description}
      </p>

      <Divider />

      <div className="mt-auto text-center">
        {/* Price / Call */}
        <motion.a
          href={`tel:${PHONE_NUMBER}`}
          onClick={(e) => e.stopPropagation()}
          aria-label={`Call about ${car.title} priced at £${formattedPrice}`}
          className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full text-2xl md:text-3xl font-bold
            bg-rose-500/20 text-white transition-colors duration-300 hover:bg-rose-500/30 hover:text-rose-300
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          £{formattedPrice}
        </motion.a>

        {/* View button */}
        <motion.button
          type="button"
          aria-label={`View details for ${car.title}`}
          onClick={(e) => {
            e.stopPropagation();
            onOpen();
          }}
          className="
            mx-auto grid place-items-center rounded-full p-2
            cursor-pointer
            focus-visible:outline-none
            focus-visible:ring-2 focus-visible:ring-rose-300/50
          "
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaEye className="text-white text-2xl transition-colors duration-300 hover:text-rose-300" />
        </motion.button>
      </div>
    </motion.article>
  );
});

CarCard.displayName = "CarCard";
export default CarCard;
