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
      transition={{ duration: 0.45, ease: "easeOut" }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className="relative w-full overflow-hidden rounded-lg h-64 md:h-80
      "
    >
      {/* Overlay */}
      <motion.div
        className="absolute inset-0 z-10 rounded-lg bg-rose-800 pointer-events-none"
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
