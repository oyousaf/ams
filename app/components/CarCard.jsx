"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { FaSearch } from "react-icons/fa";
import Divider from "./Divider";
import { motion } from "framer-motion";

const CarCard = React.memo(({ car, logo, onOpen }) => {
  const fallbackImage = "/fallback.webp";
  const firstImage = car.imageUrl?.[0] || fallbackImage;

  const formattedPrice = useMemo(
    () => car.price.toLocaleString("en-GB"),
    [car.price]
  );

  return (
    <motion.div
      onClick={onOpen}
      onKeyDown={(e) => e.key === "Enter" && onOpen()}
      tabIndex={0}
      role="button"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 0 20px rgba(244, 63, 94, 0.4)",
      }}
      transition={{ duration: 0.3 }}
      className="cursor-pointer rounded-xl p-4 flex flex-col tile-glow bg-gradient-to-br from-rose-900 via-rose-800 to-rose-950 text-white shadow-md focus:outline-none focus:ring-2 focus:ring-rose-400"
    >
      <div className="relative">
        {/* FEATURED Badge */}
        {car.isFeatured && (
          <div className="absolute top-2 left-2 z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-yellow-400 text-rose-950 text-xs font-bold px-2 py-1 rounded shadow uppercase"
            >
              Featured
            </motion.div>
          </div>
        )}

        {/* Image with optional dimming */}
        <Image
          src={firstImage}
          alt={car.title}
          width={500}
          height={192}
          style={{ height: "auto", width: "100%" }}
          className={`w-full object-cover rounded-md transition-opacity duration-300 ${
            car.isSold ? "opacity-60" : "opacity-100"
          }`}
          blurDataURL="/fallback.webp"
          placeholder="blur"
        />

        {/* SOLD Overlay */}
        {car.isSold && (
          <div className="absolute inset-0 flex items-center justify-center bg-rose-950/50 text-rose-300 text-4xl font-extrabold tracking-widest rounded-md pointer-events-none">
            SOLD
          </div>
        )}
      </div>

      {logo && <div className="w-full my-4 flex justify-center">{logo}</div>}

      <h3 className="font-bold text-white text-2xl md:text-3xl mb-2 text-center uppercase">
        {car.title}
      </h3>

      <Divider />

      <p className="text-zinc-100 mb-4 text-center text-base md:text-lg line-clamp-3">
        {car.description}
      </p>

      <Divider />

      <div className="text-center mt-auto">
        <p className="md:text-3xl text-2xl font-bold text-white hover:text-rose-300 mb-4">
          £{formattedPrice}
        </p>
        <FaSearch
          size={24}
          className="mx-auto text-white hover:text-rose-300 transition"
        />
      </div>
    </motion.div>
  );
});

CarCard.displayName = "CarCard";
export default CarCard;
