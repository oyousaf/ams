"use client";

import { aboutTiles, gallery } from "../constants";
import ImageTile from "./ImageTile";
import { motion } from "framer-motion";

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
        viewport={{ once: true, amount: 0.25 }}
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.1 },
          },
        }}
      >
        {aboutTiles.map((tile, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            whileHover={{ y: -6 }}
            className="tile-glow flex flex-col items-center rounded-2xl border border-white/10 bg-gradient-to-br from-rose-900/80 to-rose-800/80 p-6 shadow-lg backdrop-blur-sm transition"
          >
            <tile.icon className="mb-4 text-4xl text-white drop-shadow-sm" />
            <h3 className="mb-2 text-xl font-semibold text-white">
              {tile.title}
            </h3>
            <p className="text-base leading-relaxed text-zinc-100">
              {tile.description}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Gallery */}
      <div className="mx-auto mt-20 max-w-7xl">
        <motion.div
          className="grid grid-cols-1 gap-4 md:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
            },
          }}
        >
          {gallery.map((src, index) => {
            const isWide = index === 1 || index === 4;
            const isFirst = index === 0;

            return (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className={`overflow-hidden rounded-xl shadow-md ${
                  isWide ? "md:col-span-2" : ""
                }`}
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
