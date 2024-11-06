import React, { useEffect, useState, useMemo, useCallback } from "react";
import { databases } from "../lib/appwrite";
import { carLogos, carMakes } from "../constants";
import CarCard from "./CarCard";
import { SiPorsche } from "react-icons/si";

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
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">Latest Cars</h2>
      <div className="flex items-center justify-center mb-4 mt-8">
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
      </div>

      {loading && (
        <div className="flex justify-center items-center h-48">
          <SiPorsche className="text-4xl animate-spin" />
        </div>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && cars.length === 0 && (
        <p className="text-center text-xl">No cars available at the moment.</p>
      )}
      {!loading && cars.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 transition-all duration-300">
          {sortedCars.map((car) => {
            const make = carMakes.find((m) =>
              car.title.toLowerCase().includes(m.toLowerCase())
            );
            const logo = make ? carLogos[make] : null;

            return <CarCard key={car.$id} car={car} logo={logo} />;
          })}
        </div>
      )}
    </section>
  );
};

export default LatestCars;
