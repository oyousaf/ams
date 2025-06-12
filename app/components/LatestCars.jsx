"use client";

import React, { useEffect, useState, useMemo } from "react";
import { databases } from "../lib/appwrite";
import { carMakes, carLogos } from "../constants";
import CarCard from "./CarCard";
import { motion } from "framer-motion";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import LoadingSpinner from "../dashboard/LoadingSpinner";

const LatestCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("newest");
  const [isDropdownOpen, setDropdownOpen] = useState(false);

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

  const getSortLabel = (key) => {
    const label = key.replace(/([a-z])([A-Z])/g, "$1 $2");
    return key.includes("Low") ? (
      <>
        {label.replace(" Low", "")} <FaArrowUp className="inline" />
      </>
    ) : key.includes("High") ? (
      <>
        {label.replace(" High", "")} <FaArrowDown className="inline" />
      </>
    ) : (
      label
    );
  };

  return (
    <section id="cars" className="py-24 px-6 md:px-12">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-white">
        Latest Cars
      </h2>

      <div className="flex justify-center mb-12">
        <div className="relative">
          <button
            className="w-64 border border-rose-700 bg-rose-800 text-white text-lg font-semibold rounded-lg p-3 shadow-md focus:outline-none focus:ring-2 focus:ring-rose-600"
            onClick={() => setDropdownOpen(!isDropdownOpen)}
          >
            Sort By: {getSortLabel(sortOption)}
          </button>
          {isDropdownOpen && (
            <ul className="absolute w-64 mt-2 border border-rose-700 bg-rose-800 rounded-lg shadow-lg z-10">
              {[
                "newest",
                "oldest",
                "engineLow",
                "engineHigh",
                "priceLow",
                "priceHigh",
                "mileage",
              ].map((option) => (
                <li
                  key={option}
                  onClick={() => {
                    setSortOption(option);
                    setDropdownOpen(false);
                  }}
                  className="p-2 cursor-pointer hover:bg-rose-100 hover:text-rose-700 rounded-md text-center"
                >
                  {getSortLabel(option)}
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
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {sortedCars.map((car) => {
            const make = carMakes.find((m) =>
              car.title.toLowerCase().includes(m.toLowerCase())
            );
            const logo = make ? carLogos[make] : null;

            return (
              <motion.div
                key={car.$id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
                viewport={{ once: true }}
              >
                <CarCard car={car} logo={logo} />
              </motion.div>
            );
          })}
        </ul>
      )}
    </section>
  );
};

export default LatestCars;
