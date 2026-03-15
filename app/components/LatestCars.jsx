"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { carMakes, carLogos } from "../constants";
import CarCard from "./CarCard";
import CarModal from "./CarModal";
import SkeletonCarCard from "./SkeletonCarCard";
import SortDropdown from "./SortDropdown";
import { normalizeCar } from "@/lib/normaliseCar";

const API = process.env.NEXT_PUBLIC_API_URL;

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

const safeNum = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

function enrichCar(car) {
  const title = car.title?.toLowerCase().replace(/\s+/g, "") || "";

  const make = carMakes.find((m) =>
    title.includes(m.toLowerCase().replace(/\s+/g, "")),
  );

  return {
    ...car,
    make,
    logo: make ? carLogos[make] : null,
  };
}

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
        setLoading(true);
        setError(null);

        const res = await fetch(`${API}/api/cars`, {
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Failed to fetch cars");

        const data = await res.json();

        const rows = Array.isArray(data) ? data : (data.cars ?? []);

        const normalized = rows.map((row) => enrichCar(normalizeCar(row)));

        setCars(normalized);
      } catch (err) {
        console.error(err);
        setError("Unable to load vehicles. Please try again shortly.");
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const sortedCars = useMemo(() => {
    let result = [...cars];

    switch (sortOption) {
      case "automatic":
      case "manual":
        result = result.filter(
          (car) => car.transmission?.toLowerCase() === sortOption,
        );
        result.sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime(),
        );
        break;

      case "priceLow":
        result.sort((a, b) => safeNum(a.price) - safeNum(b.price));
        break;

      case "priceHigh":
        result.sort((a, b) => safeNum(b.price) - safeNum(a.price));
        break;

      case "mileage":
        result.sort((a, b) => safeNum(a.mileage) - safeNum(b.mileage));
        break;

      case "engineLow":
        result.sort((a, b) => safeNum(a.engineSize) - safeNum(b.engineSize));
        break;

      case "engineHigh":
        result.sort((a, b) => safeNum(b.engineSize) - safeNum(a.engineSize));
        break;

      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.createdAt || 0).getTime() -
            new Date(b.createdAt || 0).getTime(),
        );
        break;

      case "titleAsc":
        result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        break;

      case "titleDesc":
        result.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
        break;

      default:
        result.sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime(),
        );
    }

    return result.sort((a, b) => {
      if (a.isFeatured === b.isFeatured) return 0;
      return a.isFeatured ? -1 : 1;
    });
  }, [cars, sortOption]);

  return (
    <section aria-labelledby="cars-heading" className="py-24 px-6 md:px-12">
      <h2
        id="cars-heading"
        className="mb-12 text-center text-4xl font-bold tracking-tight text-white md:text-5xl"
      >
        Available Vehicles
      </h2>

      <div className="mb-12 flex justify-center">
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
          aria-live="polite"
          className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCarCard key={i} />
          ))}
        </div>
      ) : error ? (
        <p className="mx-auto max-w-md text-center text-red-400">{error}</p>
      ) : (
        <motion.ul
          layout
          className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence>
            {sortedCars.map((car) => (
              <motion.li
                key={car.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
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
