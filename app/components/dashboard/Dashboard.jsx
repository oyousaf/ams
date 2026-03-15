"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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

/* --------------------------------------------------
CONFIG
-------------------------------------------------- */

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

/* --------------------------------------------------
UTILS
-------------------------------------------------- */

function num(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function normaliseImages(c) {
  if (Array.isArray(c.image_urls)) return c.image_urls;

  if (Array.isArray(c.imageUrls)) return c.imageUrls;

  if (c.imageUrl) return [c.imageUrl];

  return [];
}

function mapCar(c) {
  return {
    id: c.id,
    title: c.title,
    description: c.description,
    price: num(c.price),

    engineType: c.engineType ?? c.engine_type,
    engineSize: num(c.engineSize ?? c.engine_size),

    transmission: c.transmission,
    mileage: num(c.mileage),
    year: num(c.year),

    carType: c.carType ?? c.car_type,

    createdAt: c.createdAt ?? c.created_at,

    isFeatured: c.isFeatured ?? c.is_featured ?? false,
    isSold: c.isSold ?? c.is_sold ?? false,

    image_urls: normaliseImages(c),
  };
}

const getExpiryDate = (months = 6) => {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return d;
};

/* --------------------------------------------------
DASHBOARD
-------------------------------------------------- */

export default function Dashboard() {
  const [hydrated, setHydrated] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");

  const [cars, setCars] = useState([]);
  const [activeTab, setActiveTab] = useState("carList");

  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [debounced, setDebounced] = useState("");

  const [sortOption, setSortOption] = useState("newest");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);

  /* --------------------------------------------------
SESSION CHECK
-------------------------------------------------- */

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

  /* --------------------------------------------------
FETCH CARS
-------------------------------------------------- */

  const fetchCars = useCallback(async () => {
    setLoading(true);

    try {
      const res = await fetch("https://api.acemotorsales.uk/api/cars", {
        cache: "no-store",
      });

      const data = await res.json();

      const mapped = data.map(mapCar);

      setCars(mapped);
    } catch {
      toast.error("Failed to load cars");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchCars();
  }, [isAuthenticated, fetchCars]);

  /* --------------------------------------------------
SEARCH DEBOUNCE
-------------------------------------------------- */

  useEffect(() => {
    const t = setTimeout(() => setDebounced(searchQuery), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [searchQuery]);

  /* --------------------------------------------------
DERIVED LIST
-------------------------------------------------- */

  const filteredCars = useMemo(() => {
    const q = debounced.toLowerCase().trim();

    let list = cars.filter((c) =>
      [c.title, c.year].join(" ").toLowerCase().includes(q),
    );

    list = [...list];

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

      default:
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return list;
  }, [cars, debounced, sortOption]);

  /* --------------------------------------------------
AUTH
-------------------------------------------------- */

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

  /* --------------------------------------------------
LOADING
-------------------------------------------------- */

  if (!hydrated || (isAuthenticated && loading && !cars.length)) {
    return (
      <div className="flex-1 grid place-items-center">
        <LoadingSpinner />
      </div>
    );
  }

  /* --------------------------------------------------
LOGIN
-------------------------------------------------- */

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 grid place-items-center bg-linear-to-br from-rose-950 to-rose-900 px-4">
        <motion.form
          onSubmit={handlePass}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-sm rounded-2xl bg-rose-900/70 p-6 backdrop-blur shadow-xl"
        >
          <div className="flex flex-col items-center gap-6 text-white">
            <Image
              src="/logo.png"
              alt="Ace Motor Sales"
              width={180}
              height={90}
            />

            <input
              type="password"
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
              placeholder="•••••"
              maxLength={5}
              className="w-full rounded-lg bg-rose-800 px-4 py-3 text-center"
            />

            {error && <span className="text-sm text-red-400">{error}</span>}

            <button className="rounded-full bg-rose-700 px-6 py-2">
              <IoIosReturnRight size={20} />
            </button>
          </div>
        </motion.form>
      </div>
    );
  }

  /* --------------------------------------------------
UI
-------------------------------------------------- */

  return (
    <div className="h-full w-full flex flex-col text-white">
      <header className="h-20 shrink-0 px-4 shadow-md">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>

          <Link href="/">
            <GoHomeFill size={28} />
          </Link>
        </div>
      </header>

      <nav className="flex justify-center gap-3 p-2 shrink-0">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={
              "px-4 py-2 rounded-full font-bold " +
              (activeTab === t.key
                ? "bg-rose-700 text-white"
                : "bg-rose-300 text-rose-900")
            }
          >
            {t.label}
          </button>
        ))}
      </nav>

      <div className="flex-1 min-h-0 flex flex-col">
        {activeTab === "carList" ? (
          <>
            <div className="p-4 shrink-0">
              <div className="mx-auto flex w-full max-w-4xl flex-col md:flex-row gap-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search cars…"
                  className="h-11 w-full md:flex-1 px-4 rounded-lg bg-rose-800"
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

            <div className="flex-1 min-h-0 px-4 pb-4">
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
              className="h-full"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
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
