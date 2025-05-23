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
      title: "Quality Vehicles",
      description:
      "Drive with confidence in our certified pre-owned vehicles, each meticulously inspected to ensure top-tier quality, durability, and reliability.",
    },
    {
      icon: FaHandshake,
      title: "Customer Satisfaction",
      description:
        "Enjoy a seamless experience with our exceptional service, including nationwide door-to-door delivery for your convenience.",
    },
    {
      icon: FaHistory,
      title: `Established ${yearsEstablished} Years`,
      description: `Since ${establishedYear}, we’ve built a trusted reputation for dependability and outstanding customer care.`,
    },
    {
      icon: FaShieldAlt,
      title: "Flexibility",
      description:
        "Benefit from flexible warranty options, accessible financing, and the convenience of reserving any vehicle for just £99. We also offer part-exchange and car selling services for your ease.",
    },
  ];

  return (
    <section className="py-16" id="about">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
        About
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto text-center px-4 lg:px-8">
        {about.map((tile, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-rose-700 p-6 rounded-lg shadow-lg"
          >
            <tile.icon className="text-rose-950 text-5xl mb-4" />
            <h3 className="text-2xl font-bold mb-2">{tile.title}</h3>
            <p className="text-center md:text-lg text-white mt-2">
              {tile.description}
            </p>
          </div>
        ))}
      </div>

      {/* Gallery */}
      <div className="mt-16 px-4 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0.5 } },
          }}
          initial="hidden"
          animate="visible"
        >
          {/* Images */}
          {gallery.map((src, index) => (
            <motion.div
              key={index}
              className={`flex justify-center ${
                index === 1 || index === 4 ? "md:col-span-2" : ""
              }`}
              variants={{
                hidden: { opacity: 0, x: index % 2 === 0 ? -100 : 100 },
                visible: { opacity: 1, x: 0 },
              }}
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
