"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import { databases } from "../lib/appwrite";
import { carMakes, carLogos } from "../constants";
import CarCard from "./CarCard";
import CarModal from "./CarModal";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSpinner from "../dashboard/LoadingSpinner";

const sortOptions = [
  { key: "mileage", label: "Mileage" },
  { key: "newest", label: "Newest" },
  { key: "oldest", label: "Oldest" },
  { key: "engineLow", label: "Engine ↑" },
  { key: "engineHigh", label: "Engine ↓" },
  { key: "priceLow", label: "Price ↑" },
  { key: "priceHigh", label: "Price ↓" },
];

const dropdownVariants = {
  hidden: { opacity: 0, y: -10, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.15 } },
};

const LatestCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("newest");
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const sortListRef = useRef(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID
        );
        setCars(res.documents);
      } catch (err) {
        setError("Error fetching cars. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const sortedCars = useMemo(() => {
    return [...cars]
      .sort((a, b) => {
        switch (sortOption) {
          case "priceLow":
            return a.price - b.price;
          case "priceHigh":
            return b.price - a.price;
          case "mileage":
            return a.mileage - b.mileage;
          case "engineLow":
            return a.engineSize - b.engineSize;
          case "engineHigh":
            return b.engineSize - a.engineSize;
          case "oldest":
            return new Date(a.createdAt) - new Date(b.createdAt);
          default:
            return new Date(b.createdAt) - new Date(a.createdAt); // newest
        }
      })
      .sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)); // Featured pinned
  }, [cars, sortOption]);

  return (
    <section
      id="cars"
      role="region"
      aria-labelledby="latest-cars-heading"
      className="py-24 px-6 md:px-12"
    >
      <h2
        id="latest-cars-heading"
        className="text-4xl md:text-5xl font-bold text-center mb-12 text-white"
      >
        Latest Cars
      </h2>

      {/* Sort Dropdown */}
      <div className="flex justify-center mb-12">
        <div className="relative">
          <button
            className="w-64 bg-gradient-to-br from-rose-900 via-rose-800 to-rose-950 text-white text-lg font-semibold rounded-lg p-3 shadow-md text-center"
            onClick={() => setDropdownOpen((prev) => !prev)}
            aria-haspopup="listbox"
            aria-expanded={isDropdownOpen}
            aria-controls="sort-options"
          >
            Sort By: {sortOptions.find((opt) => opt.key === sortOption)?.label}
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.ul
                id="sort-options"
                role="listbox"
                aria-activedescendant={`option-${sortOption}`}
                ref={sortListRef}
                className="absolute w-64 mt-2 border border-rose-700 bg-rose-800 rounded-lg shadow-lg z-10"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={dropdownVariants}
              >
                {sortOptions.map(({ key, label }) => (
                  <li
                    id={`option-${key}`}
                    key={key}
                    role="option"
                    aria-selected={sortOption === key}
                    onClick={() => {
                      setSortOption(key);
                      setDropdownOpen(false);
                    }}
                    className={`p-2 cursor-pointer hover:bg-rose-100 hover:text-rose-700 rounded-md text-center ${
                      sortOption === key
                        ? "font-bold text-white bg-rose-700 bg-opacity-50 glow-pulse"
                        : ""
                    }`}
                  >
                    {label}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Car Grid or Status */}
      {loading ? (
        <div
          role="status"
          className="flex justify-center items-center h-48"
          aria-live="polite"
        >
          <LoadingSpinner />
        </div>
      ) : error ? (
        <p
          role="alert"
          className="text-center text-red-500"
          aria-live="assertive"
        >
          {error}
        </p>
      ) : sortedCars.length === 0 ? (
        <p
          className="text-center text-lg text-zinc-200"
          role="status"
          aria-live="polite"
        >
          No cars available.
        </p>
      ) : (
        <motion.ul
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
        >
          <AnimatePresence mode="popLayout">
            {sortedCars.map((car) => {
              const make = carMakes.find((m) =>
                car.title.toLowerCase().includes(m.toLowerCase())
              );
              const logo = make ? carLogos[make] : null;

              return (
                <motion.li
                  key={car.$id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  aria-label={`Car listing: ${car.title}`}
                >
                  <CarCard
                    car={car}
                    logo={logo}
                    onOpen={() => setSelectedCar({ ...car, logo })}
                  />
                </motion.li>
              );
            })}
          </AnimatePresence>
        </motion.ul>
      )}

      {/* Modal */}
      {selectedCar && (
        <CarModal
          car={selectedCar}
          logo={selectedCar.logo}
          onClose={() => setSelectedCar(null)}
        />
      )}
    </section>
  );
};

export default LatestCars;
