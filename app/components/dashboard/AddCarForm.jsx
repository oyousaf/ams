"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { toast } from "sonner";
import { AiOutlineLoading } from "react-icons/ai";
import Toggle from "./Toggle";

const shakeVariant = {
  idle: { x: 0 },
  shake: {
    x: [-6, 6, -4, 4, 0],
    transition: { duration: 0.35 },
  },
};

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35 },
  },
};

const MAX_IMAGES = 15;

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";
const endpoint = API_BASE ? `${API_BASE}/api/cars` : "/api/cars";

function numOrEmpty(value) {
  if (value === "" || value === null || value === undefined) return "";
  const n = Number(value);
  return Number.isFinite(n) ? n : "";
}

export default function AddCarForm({ setCars, fetchCars, setActiveTab }) {
  const initial = useMemo(
    () => ({
      title: "",
      description: "",
      price: "",
      engineType: "Electric",
      engineSize: "",
      transmission: "Automatic",
      mileage: "",
      year: "",
      carType: "Convertible",
      images: [],
      isFeatured: false,
    }),
    [],
  );

  const [car, setCar] = useState(initial);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const carTypes = useMemo(
    () =>
      [
        "Convertible",
        "Coupe",
        "Crossover",
        "Estate",
        "Hatchback",
        "Minivan",
        "Pickup",
        "Saloon",
        "Sports",
        "SUV",
        "Truck",
        "Van",
      ].sort(),
    [],
  );

  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [previews]);

  function update(e) {
    const { name, value } = e.target;

    setCar((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function onImages(e) {
    if (!e.target.files?.length) return;

    const selected = Array.from(e.target.files);

    setCar((prev) => {
      const existing = new Set(
        prev.images.map((f) => `${f.name}-${f.size}-${f.lastModified}`),
      );

      const unique = selected.filter(
        (f) => !existing.has(`${f.name}-${f.size}-${f.lastModified}`),
      );

      const combined = [...prev.images, ...unique].slice(0, MAX_IMAGES);

      return {
        ...prev,
        images: combined,
      };
    });

    setPreviews((prev) => {
      const existing = new Set(prev.map((p) => p.key));

      const next = selected
        .map((file) => ({
          key: `${file.name}-${file.size}-${file.lastModified}`,
          url: URL.createObjectURL(file),
        }))
        .filter((p) => !existing.has(p.key));

      return [...prev, ...next].slice(0, MAX_IMAGES);
    });

    e.target.value = "";
  }

  function removeImage(index) {
    setCar((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));

    setPreviews((prev) => {
      const target = prev[index];
      if (target?.url) URL.revokeObjectURL(target.url);
      return prev.filter((_, i) => i !== index);
    });
  }

  function isValid() {
    const title = car.title.trim();
    const description = car.description.trim();
    const price = Number(car.price);
    const engineSize = Number(car.engineSize);
    const mileage = Number(car.mileage);
    const year = String(car.year).trim();

    if (!title) return false;
    if (!description) return false;
    if (!Number.isFinite(price) || price < 0) return false;
    if (!Number.isFinite(engineSize) || engineSize < 0) return false;
    if (!Number.isFinite(mileage) || mileage < 0) return false;
    if (!/^\d{4}$/.test(year)) return false;
    if (car.images.length < 1) return false;

    return true;
  }

  function reset() {
    previews.forEach((p) => URL.revokeObjectURL(p.url));
    setCar(initial);
    setPreviews([]);
  }

  async function onSubmit(e) {
    if (e?.preventDefault) e.preventDefault();

    if (!isValid()) {
      setShake(true);
      toast.error("Please complete all required fields");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("title", car.title.trim());
      formData.append("description", car.description.trim());
      formData.append("price", Number(car.price));
      formData.append("engineType", car.engineType);
      formData.append("engineSize", Number(car.engineSize));
      formData.append("transmission", car.transmission);
      formData.append("mileage", Number(car.mileage));
      formData.append("year", Number(car.year));
      formData.append("carType", car.carType);

      formData.append("isFeatured", String(car.isFeatured));

      car.images.forEach((file) => {
        formData.append("images", file);
      });

      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "Upload failed");
      }

      toast.success("Car added");

      if (typeof setCars === "function") {
        setCars((prev) => [data, ...prev]);
      }

      if (typeof fetchCars === "function") {
        fetchCars();
      }

      if (typeof setActiveTab === "function") {
        setActiveTab("carList");
      }

      reset();
    } catch (err) {
      toast.error(err?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      className="relative h-full flex flex-col"
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      <form onSubmit={onSubmit} className="flex-1 p-4 pb-32">
        <motion.div
          variants={shakeVariant}
          animate={shake ? "shake" : "idle"}
          onAnimationComplete={() => setShake(false)}
          className="max-w-3xl mx-auto space-y-5"
        >
          <input
            name="title"
            value={car.title}
            onChange={update}
            placeholder="Title"
            className="w-full h-11 px-4 rounded-lg bg-rose-800 text-white placeholder:text-white/60 outline-none"
          />

          <textarea
            name="description"
            value={car.description}
            onChange={update}
            placeholder="Description"
            rows={4}
            className="w-full px-4 py-3 rounded-lg bg-rose-800 text-white placeholder:text-white/60 resize-none outline-none"
          />

          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={numOrEmpty(car.price)}
            onChange={update}
            placeholder="Price"
            className="w-full h-11 px-4 rounded-lg bg-rose-800 text-white"
          />

          <div className="grid grid-cols-2 gap-3">
            <select
              name="engineType"
              value={car.engineType}
              onChange={update}
              className="h-11 px-3 rounded-lg bg-rose-800 text-white"
            >
              {["Electric", "Hybrid", "Petrol", "Diesel"].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>

            <select
              name="transmission"
              value={car.transmission}
              onChange={update}
              className="h-11 px-3 rounded-lg bg-rose-800 text-white"
            >
              {["Automatic", "Manual"].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>

            <input
              name="engineSize"
              type="number"
              value={numOrEmpty(car.engineSize)}
              onChange={update}
              placeholder="Engine size"
              className="h-11 px-3 rounded-lg bg-rose-800 text-white"
            />

            <input
              name="mileage"
              type="number"
              value={numOrEmpty(car.mileage)}
              onChange={update}
              placeholder="Mileage"
              className="h-11 px-3 rounded-lg bg-rose-800 text-white"
            />

            <input
              name="year"
              type="number"
              value={numOrEmpty(car.year)}
              onChange={update}
              placeholder="Year"
              className="h-11 px-3 rounded-lg bg-rose-800 text-white"
            />

            <select
              name="carType"
              value={car.carType}
              onChange={update}
              className="h-11 px-3 rounded-lg bg-rose-800 text-white"
            >
              {carTypes.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-center gap-6 pt-2 flex-wrap">
            <div className="flex items-center gap-3">
              <Toggle
                checked={car.isFeatured}
                onChange={(v) => setCar((p) => ({ ...p, isFeatured: v }))}
                color="bg-yellow-400"
              />
              <span className="text-yellow-300 font-semibold">Featured</span>
            </div>
          </div>

          <input
            id="car-images"
            type="file"
            multiple
            accept="image/*"
            onChange={onImages}
            className="sr-only"
          />

          <label
            htmlFor="car-images"
            className="flex h-11 cursor-pointer items-center justify-center rounded-lg border border-white/20 bg-rose-800/60 text-white"
          >
            Add images ({car.images.length}/{MAX_IMAGES})
          </label>

          {previews.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pt-2">
              {previews.map((preview, i) => (
                <div
                  key={preview.key}
                  className="relative w-24 h-16 rounded-lg overflow-hidden group shrink-0 border border-white/10"
                >
                  <Image
                    src={preview.url}
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized
                  />

                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 text-white text-sm flex items-center justify-center"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </form>

      <div className="fixed bottom-0 left-0 right-0 bg-rose-950 border-t border-white/10 px-4 py-3">
        <div className="max-w-3xl mx-auto">
          <button
            type="button"
            onClick={onSubmit}
            disabled={loading}
            className="w-full h-12 rounded-xl bg-rose-700 font-semibold flex items-center justify-center gap-2 text-white disabled:opacity-60"
          >
            {loading ? (
              <>
                <AiOutlineLoading className="animate-spin" />
                Uploading...
              </>
            ) : (
              "Add Car"
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
