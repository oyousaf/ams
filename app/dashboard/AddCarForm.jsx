"use client";
import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { databases, storage, ID } from "../lib/appwrite";
import { toast } from "sonner";
import Image from "next/image";
import LoadingSpinner from "./LoadingSpinner";

const shakeVariant = {
  idle: { x: 0 },
  shake: {
    x: [-8, 8, -6, 6, 0],
    transition: { duration: 0.4 },
  },
};

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
      images: [],
      year: "",
      carType: "Convertible",
    }),
    []
  );

  const [car, setCar] = useState(initial);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [shouldShake, setShouldShake] = useState(false);

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
    []
  );

  useEffect(
    () => () => previews.forEach((u) => URL.revokeObjectURL(u)),
    [previews]
  );

  const onChange = (e) => {
    const { name, value } = e.target;
    setCar((p) => ({ ...p, [name]: value }));
  };

  const onImages = (e) => {
    const files = Array.from(e.target.files);
    previews.forEach((u) => URL.revokeObjectURL(u));
    setCar((p) => ({ ...p, images: files }));
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const valid = () => {
    const { title, description, price, engineSize, mileage, year, images } =
      car;
    return (
      title.trim() &&
      description.trim() &&
      +price >= 0 &&
      +engineSize >= 0 &&
      +mileage >= 0 &&
      /^\d{4}$/.test(year) &&
      images.length > 0
    );
  };

  const reset = () => {
    previews.forEach((u) => URL.revokeObjectURL(u));
    setCar(initial);
    setPreviews([]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!valid()) {
      setShouldShake(true);
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const ids = [];
      const urls = [];
      for (const f of car.images) {
        const file = await storage.createFile(
          process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
          ID.unique(),
          f
        );
        ids.push(file.$id);
        urls.push(
          `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID}/files/${file.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}&mode=admin`
        );
      }
      const payload = {
        ...car,
        price: +car.price,
        engineSize: +car.engineSize,
        mileage: +car.mileage,
        year: +car.year,
        imageUrl: urls,
        imageFileIds: ids,
        createdAt: new Date().toISOString(),
      };
      delete payload.images;
      const doc = await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID,
        ID.unique(),
        payload
      );
      toast.success("Car added!");
      setCars((p) => [...p, doc]);
      fetchCars();
      setActiveTab("carList");
      reset();
    } catch {
      toast.error("Error uploading");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-4 relative">
      <div className="max-w-3xl mx-auto w-full mb-24">
        <form
          onSubmit={onSubmit}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <motion.div
            variants={shakeVariant}
            animate={shouldShake ? "shake" : "idle"}
            onAnimationComplete={() => setShouldShake(false)}
            className="space-y-4 overflow-y-auto"
          >
            {["title", "description", "price"].map((name) =>
              name === "description" ? (
                <textarea
                  key={name}
                  name={name}
                  value={car[name]}
                  onChange={onChange}
                  placeholder={name.charAt(0).toUpperCase() + name.slice(1)}
                  className="w-full px-3 py-2 rounded bg-rose-800"
                  required
                />
              ) : (
                <input
                  key={name}
                  name={name}
                  type={name === "price" ? "number" : "text"}
                  value={car[name]}
                  onChange={onChange}
                  placeholder={name.charAt(0).toUpperCase() + name.slice(1)}
                  className="w-full px-3 py-2 rounded bg-rose-800"
                  required
                />
              )
            )}

            <div className="grid grid-cols-2 gap-2">
              <select
                name="engineType"
                value={car.engineType}
                onChange={onChange}
                className="px-3 py-2 rounded bg-rose-800"
              >
                {["Electric", "Diesel", "Hybrid", "Petrol"].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <select
                name="transmission"
                value={car.transmission}
                onChange={onChange}
                className="px-3 py-2 rounded bg-rose-800"
              >
                {["Automatic", "Manual"].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <input
                name="engineSize"
                type="number"
                placeholder="Engine Size"
                value={car.engineSize}
                onChange={onChange}
                className="px-3 py-2 rounded bg-rose-800"
                required
              />
              <input
                name="mileage"
                type="number"
                placeholder="Mileage"
                value={car.mileage}
                onChange={onChange}
                className="px-3 py-2 rounded bg-rose-800"
                required
              />
              <input
                name="year"
                type="number"
                placeholder="Year"
                value={car.year}
                onChange={onChange}
                className="px-3 py-2 rounded bg-rose-800"
                required
              />
              <select
                name="carType"
                value={car.carType}
                onChange={onChange}
                className="px-3 py-2 rounded bg-rose-800"
              >
                {carTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={onImages}
              className="w-full pt-2"
            />
            {previews.length > 0 && (
              <div className="flex overflow-x-auto space-x-2 py-2">
                {previews.map((u, i) => (
                  <Image
                    key={i}
                    src={u}
                    width={80}
                    height={80}
                    alt={`Preview ${i}`}
                    className="rounded"
                  />
                ))}
              </div>
            )}
          </motion.div>
        </form>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-rose-950 px-4 py-3 z-50 shadow-inner">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={onSubmit}
            disabled={loading}
            className="w-full py-3 rounded bg-rose-700 text-white flex justify-center"
          >
            {loading ? (
              <LoadingSpinner />
            ) : (
              "Add Car"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
