import Image from "next/image";
import { motion } from "framer-motion";

const ImageTile = ({ src, alt }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="relative w-full h-[300px] md:h-[400px] overflow-hidden rounded-lg"
    >
      <div className="absolute inset-0 bg-rose-800 opacity-50 transition-opacity duration-500 ease-in-out hover:opacity-0 rounded-lg z-10" />

      <Image
        src={src}
        alt={alt}
        layout="fill"
        objectFit="cover"
        className="rounded-lg"
      />
    </motion.div>
  );
};

export default ImageTile;
