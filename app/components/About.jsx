"use client";

import { aboutTiles, gallery } from "../constants";
import ImageTile from "./ImageTile";
import { motion } from "motion/react";

const About = () => {
  return (
    <section aria-labelledby="about-heading" className="py-24 px-4 lg:px-8">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-rose-400">
          Why Ace Motor Sales
        </span>
        <h2
          id="about-heading"
          className="text-4xl font-bold tracking-tight text-white md:text-5xl"
        >
          About Us
        </h2>
      </div>

      {/* Feature Tiles */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.12 },
          },
        }}
      >
        {aboutTiles.map((tile, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            whileHover={{ y: -4 }}
            className="flex flex-col items-center rounded-2xl border border-white/10 bg-white/4 p-6 backdrop-blur-sm transition-colors duration-200 hover:border-rose-500/50 hover:bg-white/6"
          >
            <div className="surface-primary mb-4 grid h-16 w-16 shrink-0 place-items-center rounded-full">
              <tile.icon className="text-2xl text-white" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-white">{tile.title}</h3>
            <p className="text-base leading-relaxed text-white/65">
              {tile.description}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Gallery */}
      <div className="mt-20 max-w-7xl mx-auto">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.12 },
            },
          }}
        >
          {gallery.map((src, index) => {
            const isWide = index === 1 || index === 4;
            const isFirst = index === 0;

            return (
              <motion.div
                key={index}
                className={`flex justify-center ${
                  isWide ? "md:col-span-2" : ""
                } overflow-hidden rounded-xl shadow-lg`}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ type: "spring", stiffness: 180, damping: 18 }}
              >
                <ImageTile
                  src={src}
                  alt={`Gallery image ${index + 1}`}
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
