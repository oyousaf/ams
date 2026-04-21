"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const ImageTile = ({ src, alt, isWide = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className="relative w-full h-64 md:h-80 overflow-hidden rounded-lg"
    >
      {/* Overlay */}
      <motion.div
        className="absolute inset-0 z-10 rounded-lg bg-rose-800"
        initial={{ opacity: 0.5 }}
        whileHover={{ opacity: 0 }}
        whileTap={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      />

      {/* Image */}
      <Image
        src={src}
        alt={alt}
        fill
        sizes={
          isWide
            ? "(max-width: 768px) 100vw, 50vw"
            : "(max-width: 768px) 100vw, 25vw"
        }
        quality={70}
        className="object-cover rounded-lg"
        draggable={false}
      />
    </motion.div>
  );
};

export default ImageTile;
