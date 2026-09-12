"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { GoHomeFill } from "react-icons/go";
import { IoIosReturnRight } from "react-icons/io";
import { toast } from "sonner";

import AddCarForm from "./AddCarForm";
import CarList from "./CarList";
import SortDropdownDashboard from "./SortDropdownDashboard";
import LoadingSpinner from "./LoadingSpinner";
import { useHasMounted } from "@/lib/useHasMounted";
import { normalizeCar } from "@/lib/normaliseCar";

/* --------------------------------------------------
CONFIG
-------------------------------------------------- */

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
DASHBOARD
-------------------------------------------------- */

export default function Dashboard() {
  const hydrated = useHasMounted();
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
    const checkSession = async () => {
      try {
        const res = await fetch("/api/dashboard/session", {
          cache: "no-store",
        });

        const data = await res.json();
        setIsAuthenticated(Boolean(data?.authenticated));
      } catch {
        setIsAuthenticated(false);
      }
    };

    checkSession();
  }, []);

  /* --------------------------------------------------
FETCH CARS
-------------------------------------------------- */

  const fetchCars = useCallback(async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/cars", {
        cache: "no-store",
      });

      const data = await res.json();
      const rows = Array.isArray(data) ? data : data.cars ?? [];

      const mapped = rows.map(normalizeCar);

      setCars(mapped);
    } catch {
      toast.error("Failed to load cars");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // fetchCars sets loading state immediately (before its first await) so the
    // spinner shows without delay - the standard data-fetch-on-condition-change
    // pattern from the React docs, just flagged by the newer strict lint rule.
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

  const handlePass = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/dashboard/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ passkey }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.error || "Incorrect passkey");
        return;
      }

      setIsAuthenticated(true);
      setError("");
      setPasskey("");
    } catch {
      setError("Unable to sign in");
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

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={async () => {
                await fetch("/api/dashboard/logout", { method: "POST" });
                setIsAuthenticated(false);
              }}
              className="rounded-full bg-rose-700 px-3 py-1 text-sm font-semibold text-white"
            >
              Logout
            </button>

            <Link href="/">
              <GoHomeFill size={28} />
            </Link>
          </div>
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
