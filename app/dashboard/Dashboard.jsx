"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";
import { GoHomeFill } from "react-icons/go";
import { IoIosReturnRight } from "react-icons/io";
import Link from "next/link";
import Image from "next/image";

import AddCarForm from "./AddCarForm";
import CarList from "./CarList";
import LoadingSpinner from "./LoadingSpinner";
import { databases } from "../lib/appwrite";

const SESSION_KEY = "dashboard_session";
const SESSION_TIMESTAMP_KEY = "dashboard_session_timestamp";
const SESSION_EXPIRY_DAYS = 7;
const DEBOUNCE_DELAY = 300;

const sortOptions = [
  { key: "newest", label: "Newest" },
  { key: "oldest", label: "Oldest" },
  { key: "priceLow", label: "Price ↑" },
  { key: "priceHigh", label: "Price ↓" },
  { key: "mileage", label: "Mileage" },
  { key: "engineLow", label: "Engine ↑" },
  { key: "engineHigh", label: "Engine ↓" },
];

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [activeTab, setActiveTab] = useState("carList");
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    setHydrated(true);
    const savedPasskey = sessionStorage.getItem(SESSION_KEY);
    const savedTimestamp = sessionStorage.getItem(SESSION_TIMESTAMP_KEY);
    const isValid =
      savedPasskey === process.env.NEXT_PUBLIC_DASHBOARD_PASSKEY &&
      savedTimestamp &&
      Date.now() - parseInt(savedTimestamp, 10) <=
        SESSION_EXPIRY_DAYS * 86400000;
    if (isValid) {
      setIsAuthenticated(true);
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    }
  }, []);

  const handlePasskeySubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (passkey === process.env.NEXT_PUBLIC_DASHBOARD_PASSKEY) {
        sessionStorage.setItem(SESSION_KEY, passkey);
        sessionStorage.setItem(SESSION_TIMESTAMP_KEY, Date.now().toString());
        setIsAuthenticated(true);
        setError("");
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
      } else {
        setError("Incorrect passkey. Please try again.");
      }
    },
    [passkey]
  );

  const fetchCars = useCallback(async () => {
    setLoading(true);
    try {
      const res = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID
      );
      setCars(res.documents);
      setFilteredCars(res.documents);
    } catch {
      toast.error("Failed to load cars.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchCars();
  }, [isAuthenticated, fetchCars]);

  useEffect(() => {
    const timeout = setTimeout(
      () => setDebouncedQuery(searchQuery),
      DEBOUNCE_DELAY
    );
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  useEffect(() => {
    let filtered = [...cars];
    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase();
      filtered = filtered.filter((car) =>
        [car.make, car.model, car.title, car.year]
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }

    switch (sortOption) {
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
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredCars(filtered);
  }, [cars, debouncedQuery, sortOption]);

  const renderSearchAndSort = () => (
    <div className="flex flex-col items-center gap-4 mt-6">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full max-w-md px-4 py-2 rounded-xl border border-rose-300 bg-rose-900 placeholder:text-rose-400 shadow-md"
        placeholder="Search..."
      />
      <div className="relative w-64">
        <button
          onClick={() => setDropdownOpen(!isDropdownOpen)}
          className="w-full px-4 py-2 rounded-lg text-white bg-gradient-to-br from-rose-900 via-rose-800 to-rose-950 shadow font-semibold"
        >
          Sort By: {sortOptions.find((opt) => opt.key === sortOption)?.label}
        </button>

        <AnimatePresence>
          {isDropdownOpen && (
            <motion.ul
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute w-full mt-2 border border-rose-700 bg-rose-800 rounded-lg shadow-lg z-10"
            >
              {sortOptions.map(({ key, label }) => (
                <li
                  key={key}
                  onClick={() => {
                    setSortOption(key);
                    setDropdownOpen(false);
                  }}
                  className={`p-2 cursor-pointer text-center rounded-md transition 
                    hover:bg-rose-100 hover:text-rose-700
                    ${
                      sortOption === key
                        ? "bg-rose-700 text-white font-bold"
                        : "text-white"
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
  );

  return (
    <div className="fixed inset-0 h-screen w-screen bg-rose-950 text-white p-4 z-[9999] overflow-hidden">
      <Toaster richColors position="top-right" />
      {!hydrated ? (
        <LoadingSpinner />
      ) : isAuthenticated ? (
        <div className="max-w-7xl mx-auto">
          <header className="relative flex justify-center items-center h-[80px] mb-6">
            <Link href="/" className="absolute right-0 top-1">
              <GoHomeFill
                size={36}
                className="hover:text-rose-300 transition"
              />
            </Link>
            <Image src="/logo.png" alt="Logo" width={120} height={80} />
          </header>

          <div className="flex flex-col items-center gap-4 mb-8">
            <h1 className="text-4xl font-bold tracking-wide">Dashboard</h1>
            <div className="flex justify-center gap-4">
              {["carList", "addCar"].map((tab, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-full shadow transition text-sm md:text-base relative ${
                    activeTab === tab
                      ? "bg-rose-700 text-white glow-pulse"
                      : "bg-rose-300 text-rose-900 hover:bg-rose-400"
                  }`}
                >
                  {tab === "carList" ? "Current Cars" : "Add Car"}
                </button>
              ))}
            </div>
            {activeTab === "carList" && renderSearchAndSort()}
          </div>

          {activeTab === "carList" && (
            <motion.div
              key={debouncedQuery + sortOption}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              className="mt-4"
            >
              {loading ? (
                <LoadingSpinner />
              ) : (
                <CarList
                  cars={filteredCars}
                  setCars={setCars}
                  fetchCars={fetchCars}
                />
              )}
            </motion.div>
          )}

          {activeTab === "addCar" && (
            <motion.div
              key="addCar"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <AddCarForm
                setCars={setCars}
                fetchCars={fetchCars}
                setActiveTab={setActiveTab}
              />
            </motion.div>
          )}
        </div>
      ) : (
        <form
          onSubmit={handlePasskeySubmit}
          className="flex flex-col items-center justify-center min-h-screen gap-4"
        >
          <input
            type="password"
            value={passkey}
            maxLength={5}
            onChange={(e) => setPasskey(e.target.value)}
            className="px-4 py-2 rounded bg-white text-rose-800"
            placeholder="Enter Passkey"
          />
          {error && <p className="text-rose-300">{error}</p>}
          <button
            type="submit"
            className="px-6 py-2 bg-rose-700 rounded text-white hover:bg-rose-800 transition"
          >
            <IoIosReturnRight size={28} />
          </button>
        </form>
      )}
    </div>
  );
};

export default Dashboard;
