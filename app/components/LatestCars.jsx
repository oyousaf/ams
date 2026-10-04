"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "motion/react";
import { FaChevronDown } from "react-icons/fa";
import { carLogos } from "../constants";
import CarCard from "./CarCard";
import { detectMake, carPath, PHONE_DISPLAY, PHONE_E164 } from "@/lib/carMeta";

// Embla + the dialog only download when someone actually opens a car.
const CarModal = dynamic(() => import("./CarModal"), { ssr: false });

const sortOptions = [
  { key: "newest", label: "Recently added" },
  { key: "oldest", label: "Oldest listings" },
  { key: "priceLow", label: "Price: low to high" },
  { key: "priceHigh", label: "Price: high to low" },
  { key: "mileage", label: "Lowest mileage" },
  { key: "engineLow", label: "Engine: smallest first" },
  { key: "engineHigh", label: "Engine: largest first" },
  { key: "automatic", label: "Automatic only" },
  { key: "manual", label: "Manual only" },
  { key: "titleAsc", label: "Name: A-Z" },
  { key: "titleDesc", label: "Name: Z-A" },
];

const safeNum = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const byNewest = (a, b) =>
  new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();

function enrichCar(car) {
  const make = detectMake(car.title);

  return {
    ...car,
    make,
    href: carPath(car),
    logo: make ? carLogos[make] : null,
  };
}

// Stock arrives from the server (cached + revalidated whenever the dashboard
// edits a car), so there's no client refetch - no double request, no reshuffle.
const LatestCars = ({ initialCars = [] }) => {
  const [sortOption, setSortOption] = useState("newest");
  const [selectedCar, setSelectedCar] = useState(null);

  const cars = useMemo(() => initialCars.map(enrichCar), [initialCars]);

  const sortedCars = useMemo(() => {
    let result = [...cars];

    switch (sortOption) {
      case "automatic":
      case "manual":
        result = result.filter(
          (car) => car.transmission?.toLowerCase() === sortOption,
        );
        result.sort(byNewest);
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
        result.sort((a, b) => byNewest(b, a));
        break;

      case "titleAsc":
        result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        break;

      case "titleDesc":
        result.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
        break;

      default:
        result.sort(byNewest);
    }

    return result.sort((a, b) => {
      if (a.isFeatured === b.isFeatured) return 0;
      return a.isFeatured ? -1 : 1;
    });
  }, [cars, sortOption]);

  return (
    <section
      id="cars"
      aria-labelledby="cars-heading"
      className="py-24 px-6 md:px-12"
    >
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-rose-400">
          Fresh On The Forecourt
        </span>
        <h2
          id="cars-heading"
          className="text-4xl font-bold tracking-tight text-white md:text-5xl"
        >
          Available Vehicles
        </h2>
      </div>

      {cars.length === 0 ? (
        <p className="mx-auto max-w-md text-center text-lg text-white/80">
          New stock is on its way. Call us on{" "}
          <a
            href={`tel:${PHONE_E164}`}
            className="font-semibold text-rose-300 underline underline-offset-4 hover:text-rose-200"
          >
            {PHONE_DISPLAY}
          </a>{" "}
          to hear about cars before they&apos;re listed.
        </p>
      ) : (
        <>
          {/* Native select: keyboard, screen-reader and mobile pickers for free */}
          <div className="mb-12 flex justify-center">
            <div className="surface-primary relative flex w-72 items-center rounded-full shadow-md transition-shadow focus-within:ring-2 focus-within:ring-rose-300 hover:shadow-[0_0_20px_rgba(244,63,94,0.35)]">
              <label
                htmlFor="sort-cars"
                className="shrink-0 pl-5 text-base font-semibold text-white/80"
              >
                Sort by
              </label>
              <select
                id="sort-cars"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full cursor-pointer appearance-none bg-transparent py-3 pl-2 pr-10 text-base font-semibold text-white focus:outline-none [&>option]:bg-neutral-900"
              >
                {sortOptions.map(({ key, label }) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
              <FaChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute right-4 text-sm text-white/80"
              />
            </div>
          </div>

          <p className="sr-only" aria-live="polite">
            Showing {sortedCars.length}{" "}
            {sortedCars.length === 1 ? "vehicle" : "vehicles"}
          </p>

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
        </>
      )}

      <AnimatePresence>
        {selectedCar && (
          <CarModal
            key={selectedCar.id}
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
