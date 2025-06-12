"use client";

import { useState } from "react";
import { FaHandshake, FaCar, FaHistory, FaShieldAlt } from "react-icons/fa";
import { gallery } from "../constants";
import ImageTile from "./ImageTile";
import { motion } from "framer-motion";

const About = () => {
  const [currentYear] = useState(new Date().getFullYear());
  const establishedYear = 2022;
  const yearsEstablished = currentYear - establishedYear;

  const about = [
    {
      icon: FaCar,
      title: "Certified Quality",
      description:
        "Our hand-selected vehicles undergo multi-point inspections and come certified for long-term performance and peace of mind.",
    },
    {
      icon: FaHandshake,
      title: "Nationwide Convenience",
      description:
        "We deliver nationwide, offer remote signups, and tailor every step — from browsing to delivery — around your schedule.",
    },
    {
      icon: FaHistory,
      title: `Established ${yearsEstablished} Years`,
      description: `Trusted since ${establishedYear}, we’ve built a legacy on transparency, care, and standout service.`,
    },
    {
      icon: FaShieldAlt,
      title: "Flexible & Fair",
      description:
        "Reserve your next car with £99, explore flexible financing, and trade-in or sell your current vehicle with zero hassle.",
    },
  ];

  return (
    <section className="py-16 px-4 lg:px-8" id="about">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-white">
        About
      </h2>

      {/* Feature Tiles */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto text-center"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.12,
            },
          },
        }}
      >
        {about.map((tile, index) => (
          <motion.div
            key={index}
            whileHover={{
              scale: 1.05,
              rotateZ: 1,
            }}
            transition={{ type: "spring", stiffness: 600, damping: 20 }}
            className="tile-glow flex flex-col items-center bg-gradient-to-br from-rose-800 via-rose-700 to-rose-900 p-6 rounded-2xl shadow-inner border-2 border-transparent hover:border-rose-500/80 duration-200"
          >
            <tile.icon className="text-white text-5xl mb-4 drop-shadow-md" />
            <h3 className="text-2xl font-bold text-white mb-2">{tile.title}</h3>
            <p className="md:text-lg text-zinc-100 leading-relaxed">
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
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.12 },
            },
          }}
        >
          {gallery.map((src, index) => (
            <motion.div
              key={index}
              className={`flex justify-center ${
                index === 1 || index === 4 ? "md:col-span-2" : ""
              }`}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ type: "spring", stiffness: 180, damping: 18 }}
            >
              <ImageTile src={src} alt={`Image ${index + 1}`} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default About;
