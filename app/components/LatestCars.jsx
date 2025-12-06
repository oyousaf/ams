"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { databases } from "../lib/appwrite";
import { carMakes, carLogos } from "../constants";
import CarCard from "./CarCard";
import CarModal from "./CarModal";
import SkeletonCarCard from "./SkeletonCarCard";
import SortDropdown from "./SortDropdown";

const sortOptions = [
  { key: "mileage", label: "Mileage" },
  { key: "priceLow", label: "Price ↑" },
  { key: "priceHigh", label: "Price ↓" },
  { key: "newest", label: "Recently Added" },
  { key: "oldest", label: "Oldest" },
  { key: "automatic", label: "Automatic" },
  { key: "manual", label: "Manual" },
  { key: "engineLow", label: "Engine ↑" },
  { key: "engineHigh", label: "Engine ↓" },
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
          const title = car.title.toLowerCase().replace(/\s+/g, "");

          const make = carMakes.find((m) =>
            title.includes(m.toLowerCase().replace(/\s+/g, ""))
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
    let filtered = [...cars];

    switch (sortOption) {
      case "automatic":
      case "manual":
        filtered = filtered.filter(
          (car) =>
            car.transmission && car.transmission.toLowerCase() === sortOption
        );
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "priceLow":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "priceHigh":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "mileage":
        filtered.sort((a, b) => a.mileage - b.mileage);
        break;
      case "engineLow":
        filtered.sort((a, b) => a.engineSize - b.engineSize);
        break;
      case "engineHigh":
        filtered.sort((a, b) => b.engineSize - a.engineSize);
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "titleAsc":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "titleDesc":
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Always prioritise featured
    return filtered.sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return 0;
    });
  }, [cars, sortOption]);

  return (
    <section aria-labelledby="cars-heading" className="py-24 px-6 md:px-12">
      <h2
        id="cars-heading"
        className="text-4xl md:text-5xl font-bold text-center mb-12 text-white tracking-tight"
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
          className="text-center text-red-500 bg-black/40 rounded-xl px-6 py-4 max-w-md mx-auto"
          aria-live="assertive"
        >
          {error}
        </p>
      ) : sortedCars.length === 0 ? (
        <p
          className="text-center text-lg text-zinc-200 bg-black/40 backdrop-blur-md rounded-xl px-6 py-8 max-w-md mx-auto"
          role="status"
          aria-live="polite"
        >
          No cars available at the moment. Please check back soon.
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

      {/* Car Modal */}
      <AnimatePresence>
        {selectedCar && (
          <CarModal
            car={selectedCar}
            logo={selectedCar.logo}
            onClose={() => setSelectedCar(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default LatestCars;
