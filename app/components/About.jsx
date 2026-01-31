"use client";

import { aboutTiles, gallery } from "@/constants";
import ImageTile from "./ImageTile";
import { motion } from "framer-motion";

/* ---------------------------------------------
   Motion
--------------------------------------------- */
const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

/* ---------------------------------------------
   Component
--------------------------------------------- */
const About = () => {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="py-24 px-4 lg:px-8"
    >
      <h2
        id="about-heading"
        className="mb-14 text-center text-4xl font-bold tracking-tight text-white md:text-5xl"
      >
        What Sets Us Apart
      </h2>

      {/* Feature Tiles */}
      <motion.div
        className="mx-auto grid max-w-7xl grid-cols-1 gap-8 text-center sm:grid-cols-2 lg:grid-cols-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={container}
      >
        {aboutTiles.map((tile, index) => (
          <motion.div
            key={index}
            variants={item}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 420, damping: 26 }}
            className="tile-glow group flex flex-col items-center rounded-2xl p-6 surface-primary"
          >
            <tile.icon className="mb-4 text-4xl text-rose-400" />
            <h3 className="mb-2 text-xl font-semibold text-rose-200 group-hover:text-rose-100">
              {tile.title}
            </h3>
            <p className="text-base leading-relaxed text-zinc-300">
              {tile.description}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Gallery */}
      <div className="mx-auto mt-20 max-w-7xl">
        <motion.div
          className="grid grid-cols-1 gap-4 md:grid-cols-4"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={container}
        >
          {gallery.map((src, index) => {
            const isWide = index === 1 || index === 4;
            const isFirst = index === 0;

            return (
              <motion.div
                key={index}
                variants={item}
                className={isWide ? "md:col-span-2" : ""}
              >
                <ImageTile
                  src={src}
                  alt={`Ace Motor Sales gallery image ${index + 1}`}
                  priority={isFirst}
                  isWide={isWide}
                  isFirst={isFirst}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default About;
