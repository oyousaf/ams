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
      whileTap={{ scale: 0.98 }}
      className="relative w-full h-75 md:h-100 overflow-hidden rounded-lg"
    >
      {/* Overlay */}
      <div className="absolute inset-0 z-10 rounded-lg bg-rose-800 opacity-50 transition-opacity duration-500 ease-in-out hover:opacity-0 pointer-events-none" />

      {/* Image */}
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
            ? "(max-width: 768px) 100vw, 25vw"
            : isWide
              ? "(max-width: 768px) 100vw, 50vw"
              : "(max-width: 768px) 100vw, 25vw"
        }
        className="object-cover rounded-lg"
        draggable={false}
      />
    </motion.div>
  );
};

export default ImageTile;
