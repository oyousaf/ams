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
      <Image
        src={firstImage}
        alt={car.title}
        width={500}
        height={192}
        style={{ height: "auto", width: "100%" }}
        className="w-full object-cover rounded-md"
        priority
      />

      {logo && <div className="w-full my-4 flex justify-center">{logo}</div>}

      <h3 className="font-bold text-white text-2xl md:text-3xl mb-2 text-center">
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
