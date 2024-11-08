import React, { useEffect, useState, useMemo, useCallback } from "react";
import { databases } from "../lib/appwrite";
import { carLogos, carMakes } from "../constants";
import CarCard from "./CarCard";
import { SiPorsche } from "react-icons/si";
import { motion } from "framer-motion";

const LatestCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("newest");

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID
        );
        setCars(response.documents);
      } catch (error) {
        setError("Error fetching cars. Please try again later.");
        console.error("Error fetching cars:", error);
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
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "newest":
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
  }, [cars, sortOption]);

  const handleSortChange = useCallback((e) => {
    setSortOption(e.target.value);
  }, []);

  return (
    <section className="p-8" id="cars">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
        Latest Cars
      </h2>

      <motion.div
        className="flex items-center justify-center mb-4 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <label htmlFor="sort" className="mr-2 text-lg md:text-2xl">
          Sort By:
        </label>
        <select
          id="sort"
          value={sortOption}
          onChange={handleSortChange}
          className="border border-rose-700 bg-rose-800 md:text-xl font-bold rounded-lg p-2 shadow-md focus:outline-none focus:ring-2 focus:ring-rose-600"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="priceLow">Price: Low to High</option>
          <option value="priceHigh">Price: High to Low</option>
        </select>
      </motion.div>

      {loading && (
        <motion.div
          className="flex justify-center items-center h-48"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <SiPorsche className="text-4xl animate-spin" />
        </motion.div>
      )}

      {error && (
        <motion.p
          className="text-center text-red-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {error}
        </motion.p>
      )}

      {!loading && cars.length === 0 && (
        <motion.p
          className="text-center text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          No cars available at the moment.
        </motion.p>
      )}

      {/* Cars grid with lazy loading and hover effect */}
      {!loading && cars.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 transition-all duration-300">
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
                viewport={{ once: true, amount: 0.3 }}
              >
                <CarCard car={car} logo={logo} />
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default LatestCars;
