"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { GoHomeFill } from "react-icons/go";
import { IoIosReturnRight } from "react-icons/io";
import { toast } from "sonner";
import AddCarForm from "./AddCarForm";
import CarList from "./CarList";
import SortDropdown from "../components/SortDropdown";
import LoadingSpinner from "./LoadingSpinner";
import { databases } from "../lib/appwrite";


const Dashboard = () => {
  const [hydrated, setHydrated] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [activeTab, setActiveTab] = useState("carList");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const SESSION_KEY = "dashboard_session";
  const SESSION_TS = "dashboard_session_timestamp";
  const EXPIRY = 7 * 86400000;
  const DEBOUNCE = 300;

  const sortOptions = [
    { key: "newest", label: "Newest Added" },
    { key: "oldest", label: "Oldest" },
    { key: "priceLow", label: "Price ↑" },
    { key: "priceHigh", label: "Price ↓" },
    { key: "mileage", label: "Mileage" },
    { key: "engineLow", label: "Engine ↑" },
    { key: "engineHigh", label: "Engine ↓" },
  ];

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  useEffect(() => {
    setHydrated(true);
    const p = sessionStorage.getItem(SESSION_KEY);
    const ts = +sessionStorage.getItem(SESSION_TS);
    if (
      p === process.env.NEXT_PUBLIC_DASHBOARD_PASSKEY &&
      ts + EXPIRY > Date.now()
    ) {
      setIsAuthenticated(true);
    }
  }, [EXPIRY]);

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
      toast.error("Failed to load cars");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchCars();
  }, [isAuthenticated, fetchCars]);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(searchQuery), DEBOUNCE);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const q = debounced.toLowerCase().trim();
    const maps = {
      priceLow: (a, b) => a.price - b.price,
      priceHigh: (a, b) => b.price - a.price,
      mileage: (a, b) => a.mileage - b.mileage,
      engineLow: (a, b) => a.engineSize - b.engineSize,
      engineHigh: (a, b) => b.engineSize - a.engineSize,
      oldest: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    };
    const list = cars
      .filter((c) =>
        [c.make, c.model, c.title, c.year].join(" ").toLowerCase().includes(q)
      )
      .sort(maps[sortOption] || maps.newest);
    setFilteredCars(list);
  }, [cars, debounced, sortOption]);

  const handlePass = (e) => {
    e.preventDefault();
    if (passkey === process.env.NEXT_PUBLIC_DASHBOARD_PASSKEY) {
      sessionStorage.setItem(SESSION_KEY, passkey);
      sessionStorage.setItem(SESSION_TS, Date.now().toString());
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect passkey");
    }
  };

  if (!hydrated || (isAuthenticated && loading && cars.length === 0)) {
    return (
      <div className="fixed inset-0 bg-rose-950 flex items-center justify-center z-[100]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-rose-950 z-[100] flex items-center justify-center px-4">
        <motion.form
          onSubmit={handlePass}
          className="flex flex-col gap-4 items-center text-white w-full max-w-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Image
            src="/logo.png"
            alt="logo"
            width={200}
            height={100}
            className="mb-2"
            style={{ width: "auto", height: "auto" }}
            priority
          />
          <input
            type="password"
            value={passkey}
            onChange={(e) => setPasskey(e.target.value)}
            placeholder="Passkey..."
            maxLength={5}
            className={`px-4 py-2 rounded text-rose-700 text-center focus:glow-pulse ${
              error ? "shake border border-red-500" : ""
            }`}
          />
          {error && <span className="text-red-500">{error}</span>}
          <button
            type="submit"
            className="bg-rose-700 p-2 rounded"
            aria-label="Submit passkey"
          >
            <IoIosReturnRight size={24} />
          </button>
        </motion.form>
      </div>
    );
  }

  const tabs = [
    { key: "carList", label: "Cars" },
    { key: "addCar", label: "Add Car" },
  ];

  return (
    <div className="fixed inset-0 h-screen overflow-hidden bg-rose-950 text-white flex flex-col z-[100]">
      <header className="h-[80px] flex-shrink-0 px-4 shadow-md">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center h-full">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Link
            href="/"
            className="text-white hover:text-rose-400"
            aria-label="Go to homepage"
          >
            <GoHomeFill size={28} />
          </Link>
        </div>
      </header>

      <nav className="flex-shrink-0 flex justify-center gap-4 p-2 text-2xl">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2 rounded-full font-extrabold ${
              activeTab === key
                ? "bg-rose-700 text-white glow-pulse"
                : "bg-rose-300 text-rose-900"
            }`}
            aria-label={`Switch to ${label} tab`}
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="flex-1 overflow-hidden">
        {activeTab === "carList" ? (
          <div className="h-full flex flex-col overflow-y-auto p-4 max-w-7xl mx-auto w-full">
            <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="px-4 py-2 rounded bg-rose-800 w-full md:w-1/2"
              />
              <div className="w-64 mx-auto">
                <SortDropdown
                  options={sortOptions}
                  selected={sortOption}
                  onSelect={(key) => {
                    setSortOption(key);
                    setDropdownOpen(false);
                  }}
                  isOpen={dropdownOpen}
                  onToggle={() => setDropdownOpen((prev) => !prev)}
                />
              </div>
            </div>

            {loading ? (
              <LoadingSpinner />
            ) : (
              <CarList
                cars={filteredCars}
                setCars={setCars}
                fetchCars={fetchCars}
              />
            )}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key="addCar"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <AddCarForm
                setCars={setCars}
                fetchCars={fetchCars}
                setActiveTab={setActiveTab}
              />
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
