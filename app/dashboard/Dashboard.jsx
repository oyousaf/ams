"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { GoHomeFill } from "react-icons/go";
import { IoIosReturnRight } from "react-icons/io";
import { toast } from "sonner";

import AddCarForm from "./AddCarForm";
import CarList from "./CarList";
import SortDropdownDashboard from "./SortDropdownDashboard";
import LoadingSpinner from "./LoadingSpinner";
import { databases } from "@/lib/appwrite";

/* ---------------------------------------------
   Constants
--------------------------------------------- */
const SESSION_KEY = "dashboard_session";
const SESSION_EXPIRY = "dashboard_session_expiry";
const DEBOUNCE_MS = 300;

const sortOptions = [
  { key: "newest", label: "Recently Added" },
  { key: "oldest", label: "Oldest" },
  { key: "priceLow", label: "Price ↑" },
  { key: "priceHigh", label: "Price ↓" },
  { key: "mileage", label: "Mileage" },
  { key: "engineLow", label: "Engine ↑" },
  { key: "engineHigh", label: "Engine ↓" },
  { key: "automatic", label: "Automatic" },
  { key: "manual", label: "Manual" },
  { key: "titleAsc", label: "A–Z" },
  { key: "titleDesc", label: "Z–A" },
];

const tabs = [
  { key: "carList", label: "Cars" },
  { key: "addCar", label: "Add Car" },
];

const getExpiryDate = (months = 6) => {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return d;
};

export default function Dashboard() {
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

  const [modalOpen, setModalOpen] = useState(false);

  /* Mount / hydration */
  useEffect(() => {
    setHydrated(true);

    const saved = sessionStorage.getItem(SESSION_KEY);
    const expiry = sessionStorage.getItem(SESSION_EXPIRY);

    if (
      saved === process.env.NEXT_PUBLIC_DASHBOARD_PASSKEY &&
      expiry &&
      new Date(expiry) > new Date()
    ) {
      setIsAuthenticated(true);
    } else {
      sessionStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(SESSION_EXPIRY);
    }
  }, []);

  /* Data */
  const fetchCars = useCallback(async () => {
    setLoading(true);
    try {
      const res = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID,
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

  /* Search debounce */
  useEffect(() => {
    const t = setTimeout(() => setDebounced(searchQuery), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [searchQuery]);

  /* Search + sort */
  useEffect(() => {
    const q = debounced.toLowerCase().trim();

    let list = cars.filter((c) =>
      [c.make, c.model, c.title, c.year].join(" ").toLowerCase().includes(q),
    );

    switch (sortOption) {
      case "priceLow":
        list.sort((a, b) => a.price - b.price);
        break;
      case "priceHigh":
        list.sort((a, b) => b.price - a.price);
        break;
      case "mileage":
        list.sort((a, b) => a.mileage - b.mileage);
        break;
      case "engineLow":
        list.sort((a, b) => a.engineSize - b.engineSize);
        break;
      case "engineHigh":
        list.sort((a, b) => b.engineSize - a.engineSize);
        break;
      case "oldest":
        list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "titleAsc":
        list.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "titleDesc":
        list.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "automatic":
      case "manual":
        list = list.filter((c) => c.transmission?.toLowerCase() === sortOption);
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredCars(list);
  }, [cars, debounced, sortOption]);

  /* Auth */
  const handlePass = (e) => {
    e.preventDefault();
    if (passkey === process.env.NEXT_PUBLIC_DASHBOARD_PASSKEY) {
      const expiry = getExpiryDate().toISOString();
      sessionStorage.setItem(SESSION_KEY, passkey);
      sessionStorage.setItem(SESSION_EXPIRY, expiry);
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect passkey");
    }
  };

  if (!hydrated || (isAuthenticated && loading && !cars.length)) {
    return (
      <div className="flex-1 grid place-items-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 grid place-items-center bg-rose-950 px-4">
        <motion.form
          onSubmit={handlePass}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex w-full max-w-sm flex-col items-center gap-4 text-white"
        >
          <Image src="/logo.png" alt="logo" width={200} height={100} priority />

          <input
            type="password"
            value={passkey}
            onChange={(e) => setPasskey(e.target.value)}
            placeholder="Passkey…"
            maxLength={5}
            className={`w-50 rounded bg-rose-800 px-4 py-2 text-center text-white placeholder:text-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-400 ${
              error ? "border border-red-500 shake" : ""
            }`}
          />

          {error && <span className="text-red-500">{error}</span>}

          <button
            type="submit"
            className="rounded-full bg-rose-700 p-3"
            aria-label="Submit passkey"
          >
            <IoIosReturnRight size={24} />
          </button>
        </motion.form>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col text-white">
      <header className="h-20 shrink-0 px-4 shadow-md">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Link href="/">
            <GoHomeFill size={28} className="hover:text-rose-400" />
          </Link>
        </div>
      </header>

      <nav className="flex justify-center gap-3 p-2 shrink-0">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 rounded-full font-bold transition ${
              activeTab === t.key
                ? "bg-rose-700 text-white"
                : "bg-rose-300 text-rose-900"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <div className="flex-1 min-h-0 flex flex-col">
        {activeTab === "carList" ? (
          <>
            <div className="p-4 shrink-0">
              <div className="mx-auto max-w-7xl rounded-xl bg-white/5 p-3 backdrop-blur">
                <div className="mx-auto flex w-full max-w-4xl flex-col md:flex-row gap-3">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search cars…"
                    className="h-11 w-full md:flex-1 px-4 rounded-lg bg-transparent text-white placeholder:text-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />

                  <div className="relative w-full md:w-64">
                    <SortDropdownDashboard
                      options={sortOptions}
                      selected={sortOption}
                      onSelect={setSortOption}
                      isOpen={dropdownOpen}
                      onToggle={setDropdownOpen}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`flex-1 min-h-0 px-4 pb-4 transition-opacity duration-200 ${
                modalOpen ? "opacity-40 pointer-events-none" : "opacity-100"
              }`}
            >
              {loading ? (
                <LoadingSpinner />
              ) : (
                <CarList
                  cars={filteredCars}
                  setCars={setCars}
                  fetchCars={fetchCars}
                  setModalOpen={setModalOpen}
                />
              )}
            </div>
          </>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key="addCar"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
              className="flex-1 overflow-y-auto"
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
}
