import React, { useEffect, useState, useMemo, useCallback } from "react";
import { databases } from "../lib/appwrite";
import { carLogos, carMakes } from "../constants";
import CarCard from "./CarCard";
import { motion } from "framer-motion";
import LoadingSpinner from "../dashboard/LoadingSpinner";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const LatestCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("newest");
  const [isDropdownOpen, setDropdownOpen] = useState(false);

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
        case "mileage":
          return a.mileage - b.mileage;
        case "engineL":
          return a.engineSize - b.engineSize;
        case "engineH":
          return b.engineSize - a.engineSize;
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "newest":
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
  }, [cars, sortOption]);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const handleSortChange = (value) => {
    setSortOption(value);
    setDropdownOpen(false);
  };

  return (
    <section className="p-8" id="cars">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
        Latest Cars
      </h2>

      <motion.div
        className="relative flex items-center justify-center mb-4 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <button
          className="w-64 text-center border border-rose-700 bg-rose-800 text-white md:text-xl font-bold rounded-lg p-3 shadow-md focus:outline-none focus:ring-2 focus:ring-rose-600"
          onClick={toggleDropdown}
        >
          Sort By:{" "}
          <span className="capitalize">
            {sortOption.replace(/([a-z])([A-Z])/g, "$1 $2")}
          </span>
        </button>
        {isDropdownOpen && (
          <ul className="absolute w-64 mt-2 border border-rose-700 bg-rose-800 rounded-lg shadow-lg z-10">
            <li
              onClick={() => handleSortChange("newest")}
              className="p-2 cursor-pointer hover:bg-rose-100 hover:text-rose-700 rounded-md flex items-center"
            >
              Newest
            </li>
            <li
              onClick={() => handleSortChange("oldest")}
              className="p-2 cursor-pointer hover:bg-rose-100 hover:text-rose-700 rounded-md flex items-center"
            >
              Oldest
            </li>
            <li
              onClick={() => handleSortChange("engineL")}
              className="p-2 cursor-pointer hover:bg-rose-100 hover:text-rose-700 rounded-md flex items-center"
            >
              Engine: Ascending{" "}
              <FaArrowUp className="ml-auto transition-transform duration-300 transform hover:scale-125 hover:text-rose-700" />
            </li>
            <li
              onClick={() => handleSortChange("engineH")}
              className="p-2 cursor-pointer hover:bg-rose-100 hover:text-rose-700 rounded-md flex items-center"
            >
              Engine: Descending{" "}
              <FaArrowDown className="ml-auto transition-transform duration-300 transform hover:scale-125 hover:text-rose-700" />
            </li>
            <li
              onClick={() => handleSortChange("priceLow")}
              className="p-2 cursor-pointer hover:bg-rose-100 hover:text-rose-700 rounded-md flex items-center"
            >
              Price: Ascending{" "}
              <FaArrowUp className="ml-auto transition-transform duration-300 transform hover:scale-125 hover:text-rose-700" />
            </li>
            <li
              onClick={() => handleSortChange("priceHigh")}
              className="p-2 cursor-pointer hover:bg-rose-100 hover:text-rose-700 rounded-md flex items-center"
            >
              Price: Descending{" "}
              <FaArrowDown className="ml-auto transition-transform duration-300 transform hover:scale-125 hover:text-rose-700" />
            </li>
            <li
              onClick={() => handleSortChange("mileage")}
              className="p-2 cursor-pointer hover:bg-rose-100 hover:text-rose-700 rounded-md flex items-center"
            >
              Mileage
            </li>
          </ul>
        )}
      </motion.div>

      {loading && (
        <motion.div
          className="flex justify-center items-center h-48"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <LoadingSpinner />
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
