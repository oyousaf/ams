"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const ImageTile = ({
  src,
  alt,
  priority = false,
  isWide = false,
  isFirst = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      whileHover={{ scale: 1.05 }}
      viewport={{ once: true, amount: 0.2 }}
      className="relative w-full h-[300px] md:h-[400px] overflow-hidden rounded-lg"
    >
      <div className="absolute inset-0 bg-rose-800 opacity-50 transition-opacity duration-500 ease-in-out hover:opacity-0 rounded-lg z-10" />

      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        placeholder="blur"
        blurDataURL="/fallback.webp"
        loading={priority ? "eager" : "lazy"}
        sizes={
          isFirst
            ? "(max-width: 768px) 100vw, (min-width: 769px) 25vw" // ✅ first tile
            : isWide
            ? "(max-width: 768px) 100vw, (max-width: 1024px) 100vw, (min-width: 1025px) 50vw"
            : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (min-width: 1025px) 25vw"
        }
        className="object-cover rounded-lg"
      />
    </motion.div>
  );
};

export default ImageTile;
