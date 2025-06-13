"use client";

import React, { useEffect, useState, useMemo } from "react";
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

const LatestCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("newest");
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

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
    return [...cars].sort((a, b) => {
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
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
  }, [cars, sortOption]);

  return (
    <section id="cars" className="py-24 px-6 md:px-12">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-white">
        Latest Cars
      </h2>

      <div className="flex justify-center mb-12">
        <div className="relative">
          <button
            className="w-64 bg-gradient-to-br from-rose-900 via-rose-800 to-rose-950 text-white text-lg font-semibold rounded-lg p-3 shadow-md"
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
            Sort By: {sortOptions.find((opt) => opt.key === sortOption)?.label}
          </button>

          {isDropdownOpen && (
            <ul className="absolute w-64 mt-2 border border-rose-700 bg-rose-800 rounded-lg shadow-lg z-10">
              {sortOptions.map(({ key, label }) => (
                <li
                  key={key}
                  onClick={() => {
                    setSortOption(key);
                    setDropdownOpen(false);
                  }}
                  className={`p-2 cursor-pointer hover:bg-rose-100 hover:text-rose-700 rounded-md text-center ${
                    sortOption === key ? "font-bold text-white" : ""
                  }`}
                >
                  {label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : sortedCars.length === 0 ? (
        <p className="text-center text-lg text-zinc-200">No cars available.</p>
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
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
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
