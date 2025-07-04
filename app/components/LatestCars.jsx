"use client";

import React, { useEffect, useState, useMemo } from "react";
import { databases } from "../lib/appwrite";
import { carMakes, carLogos } from "../constants";
import CarCard from "./CarCard";
import CarModal from "./CarModal";
import SkeletonCarCard from "./SkeletonCarCard";
import SortDropdown from "./SortDropdown";
import { motion, AnimatePresence } from "framer-motion";

const sortOptions = [
  { key: "mileage", label: "Mileage" },
  { key: "newest", label: "Newest Added" },
  { key: "oldest", label: "Oldest" },
  { key: "engineLow", label: "Engine ↑" },
  { key: "engineHigh", label: "Engine ↓" },
  { key: "priceLow", label: "Price ↑" },
  { key: "priceHigh", label: "Price ↓" },
  { key: "titleAsc", label: "A-Z" },
  { key: "titleDesc", label: "Z-A" },
];

const LatestCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("newest");
  const [selectedCar, setSelectedCar] = useState(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID
        );

        const processed = res.documents.map((car) => {
          const make = carMakes.find((m) =>
            car.title.toLowerCase().includes(m.toLowerCase())
          );
          return {
            ...car,
            make,
            logo: make ? carLogos[make] : null,
          };
        });

        setCars(processed);
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
      if (b.isFeatured && !a.isFeatured) return 1;
      if (a.isFeatured && !b.isFeatured) return -1;

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
        case "titleAsc":
          return a.title.localeCompare(b.title);
        case "titleDesc":
          return b.title.localeCompare(a.title);
        default:
          return new Date(b.createdAt) - new Date(a.createdAt); // newest
      }
    });
  }, [cars, sortOption]);

  const debounceToggle = (() => {
    let timeout;
    return (callback) => {
      clearTimeout(timeout);
      timeout = setTimeout(callback, 150);
    };
  })();

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

      <div className="flex justify-center mb-12">
        <SortDropdown
          options={sortOptions}
          selected={sortOption}
          onSelect={(key) => {
            setSortOption(key);
            setDropdownOpen(false);
          }}
          isOpen={isDropdownOpen}
          onToggle={setDropdownOpen}
        />
      </div>

      {loading ? (
        <div
          role="status"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
          aria-live="polite"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCarCard key={i} />
          ))}
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
            {sortedCars.map((car) => (
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
                  logo={car.logo}
                  onOpen={() => setSelectedCar(car)}
                />
              </motion.li>
            ))}
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
