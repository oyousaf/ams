"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GoHomeFill } from "react-icons/go";
import { IoIosReturnRight } from "react-icons/io";
import Link from "next/link";
import Image from "next/image";
import AddCarForm from "./AddCarForm";
import CarList from "./CarList";
import LoadingSpinner from "./LoadingSpinner";
import { databases } from "../lib/appwrite";
import { toast } from "sonner";

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
  const [dropdown, setDropdown] = useState(false);

  const SESSION_KEY = "dashboard_session";
  const SESSION_TS = "dashboard_session_timestamp";
  const EXPIRY = 7 * 86400000;
  const DEBOUNCE = 300;

  // Authentication check
  useEffect(() => {
    setHydrated(true);
    const p = sessionStorage.getItem(SESSION_KEY);
    const ts = +sessionStorage.getItem(SESSION_TS);
    if (
      p === process.env.NEXT_PUBLIC_DASHBOARD_PASSKEY &&
      ts + EXPIRY > Date.now()
    ) {
      setIsAuthenticated(true);
      document.body.style.overflow = "hidden";
    }
  }, []);

  const fetchCars = useCallback(async () => {
    setLoading(true);
    try {
      const res = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID
      );
      setCars(res.documents);
      setFilteredCars(res.documents);
    } catch (e) {
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
    let list = [...cars];
    if (debounced.trim()) {
      const q = debounced.toLowerCase();
      list = list.filter((c) =>
        [c.make, c.model, c.title, c.year]?.join(" ").toLowerCase().includes(q)
      );
    }
    const maps = {
      priceLow: (a, b) => a.price - b.price,
      priceHigh: (a, b) => b.price - a.price,
      mileage: (a, b) => a.mileage - b.mileage,
      engineLow: (a, b) => a.engineSize - b.engineSize,
      engineHigh: (a, b) => b.engineSize - a.engineSize,
      oldest: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    };
    list.sort(maps[sortOption] || maps.newest);
    setFilteredCars(list);
  }, [cars, debounced, sortOption]);

  const handlePass = (e) => {
    e.preventDefault();
    if (passkey === process.env.NEXT_PUBLIC_DASHBOARD_PASSKEY) {
      sessionStorage.setItem(SESSION_KEY, passkey);
      sessionStorage.setItem(SESSION_TS, Date.now().toString());
      setIsAuthenticated(true);
      document.body.style.overflow = "hidden";
      setError("");
    } else setError("Incorrect passkey");
  };

  if (!hydrated) return <LoadingSpinner />;
  if (!isAuthenticated)
    return (
      <form
        onSubmit={handlePass}
        className="min-h-screen flex flex-col justify-center items-center gap-4 p-4"
      >
        <input
          type="password"
          value={passkey}
          onChange={(e) => setPasskey(e.target.value)}
          placeholder="Enter Passkey"
          className="px-4 py-2 rounded"
          maxLength={5}
        />
        {error && <span className="text-red-500">{error}</span>}
        <button type="submit" className="bg-rose-700 p-2 rounded text-white">
          <IoIosReturnRight size={24} />
        </button>
      </form>
    );

  return (
    <div className="fixed inset-0 h-screen overflow-hidden bg-rose-950 text-white flex flex-col z-[9999]">
      {/* Header */}
      <header className="h-[80px] flex-shrink-0 flex justify-between items-center px-4 shadow-md">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link href="/" className="text-white hover:text-rose-400">
          <GoHomeFill size={28} />
        </Link>
      </header>

      {/* Tabs */}
      <nav className="flex-shrink-0 flex justify-center gap-4 p-2">
        {["carList", "addCar"].map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2 rounded-full font-medium ${
              activeTab === t
                ? "bg-rose-700 text-white"
                : "bg-rose-300 text-rose-900"
            }`}
          >
            {t === "carList" ? "Cars" : "Add Car"}
          </button>
        ))}
      </nav>

      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "carList" && (
          <div className="h-full flex flex-col overflow-y-auto p-4">
            <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="px-4 py-2 rounded bg-rose-800 w-full md:w-1/2"
              />
              <div className="relative w-64 z-[100]">
                <button
                  onClick={() => setDropdown(!dropdown)}
                  className="w-full text-left px-4 py-2 rounded bg-rose-800 "
                >
                  Sort: {sortOption}
                </button>
                {dropdown && (
                  <ul className="absolute bg-rose-800 w-full mt-2 rounded shadow-lg">
                    {[
                      "newest",
                      "oldest",
                      "priceLow",
                      "priceHigh",
                      "mileage",
                      "engineLow",
                      "engineHigh",
                    ].map((opt) => (
                      <li
                        key={opt}
                        onClick={() => {
                          setSortOption(opt);
                          setDropdown(false);
                        }}
                        className="px-4 py-2 hover:bg-rose-700 cursor-pointer"
                      >
                        {opt}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {loading ? (
              <LoadingSpinner />
            ) : (
              <CarList cars={filteredCars} setCars={setCars} fetchCars={fetchCars} />
            )}
          </div>
        )}

        {activeTab === "addCar" && (
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