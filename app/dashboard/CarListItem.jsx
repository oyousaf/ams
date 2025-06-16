"use client";

import React, { useState, useMemo, forwardRef, memo } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { databases } from "../lib/appwrite";
import ConfirmModal from "./ConfirmModal";
import Toggle from "./Toggle";
import Image from "next/image";

const FALLBACK_IMAGE = "/fallback.webp";

const formatNumber = (num) =>
  typeof num === "number" ? num.toLocaleString("en-GB") : num;

const CarListItem = ({ car, setCars }, ref) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCar, setEditedCar] = useState({ ...car });
  const [saving, setSaving] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const imageUrl = useMemo(() => {
    const url = Array.isArray(car.imageUrl) ? car.imageUrl[0] : car.imageUrl;
    return hasError || !url ? FALLBACK_IMAGE : url;
  }, [car.imageUrl, hasError]);

  const carFields = useMemo(
    () => [
      { label: "Price", key: "price", unit: "£" },
      { label: "Mileage", key: "mileage" },
      { label: "Engine Type", key: "engineType" },
      { label: "Engine Size", key: "engineSize", unit: "L" },
      { label: "Transmission", key: "transmission" },
      { label: "Year", key: "year" },
      { label: "Type", key: "carType" },
    ],
    []
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedCar((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : ["price", "mileage", "engineSize", "year"].includes(name)
          ? Number(value)
          : value,
    }));
  };

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const updated = await databases.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID,
        car.$id,
        {
          ...editedCar,
          isFeatured: editedCar.isFeatured ?? false,
          isSold: editedCar.isSold ?? false,
        }
      );

      if (updated?.$id) {
        const hasChanges = JSON.stringify(editedCar) !== JSON.stringify(car);
        if (hasChanges) {
          setCars((prev) =>
            prev.map((c) => (c.$id === car.$id ? { ...c, ...editedCar } : c))
          );
        }
        toast.success("Car updated successfully!", { id: `toast-${car.$id}` });
        setIsEditing(false);
      } else {
        throw new Error("No valid response from Appwrite.");
      }
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Failed to update car.", { id: `toast-${car.$id}` });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const { storage } = await import("../lib/appwrite");
      for (const fileId of car.imageFileIds || []) {
        await storage.deleteFile(
          process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
          fileId
        );
      }

      await databases.deleteDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID,
        car.$id
      );

      setCars((prev) => prev.filter((c) => c.$id !== car.$id));
      toast.success("Car deleted successfully!", {
        id: `toast-delete-${car.$id}`,
      });
      setConfirmOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete car.", { id: `toast-delete-${car.$id}` });
    }
  };

  return (
    <motion.li
      ref={ref}
      layout
      layoutId={car.$id}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="border border-rose-200 rounded-md p-4 mb-3 flex flex-col sm:flex-row items-start bg-rose-900 text-gray-200 relative"
    >
      <figure className="w-full sm:w-1/3 mr-0 sm:mr-4 mb-4 sm:mb-0 relative">
        {car.isFeatured && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute top-2 left-2 bg-yellow-400 text-rose-950 text-xs font-bold px-2 py-1 rounded shadow z-10 uppercase"
          >
            Featured
          </motion.div>
        )}
        <Image
          src={imageUrl}
          alt={car.title || "Car image"}
          width={500}
          height={300}
          onError={() => setHasError(true)}
          className={`rounded-md object-cover w-full h-auto transition-opacity duration-300 ${
            car.isSold ? "opacity-60" : "opacity-100"
          }`}
          unoptimized={imageUrl.startsWith("blob:")}
          priority
        />
        {car.isSold && (
          <div className="absolute inset-0 flex items-center justify-center bg-rose-950/50 text-rose-300 text-4xl font-extrabold tracking-widest rounded-md">
            SOLD
          </div>
        )}
        <figcaption className="sr-only">Image of {car.title}</figcaption>
      </figure>

      <div className="w-full sm:w-2/3 space-y-2 relative">
        <div className="flex justify-end gap-3 sm:absolute sm:top-0 sm:right-0 z-10 mb-2 sm:mb-0 text-xl">
          {isEditing ? (
            <>
              <button onClick={handleSave} disabled={saving}>
                💾
              </button>
              <button
                onClick={() => {
                  setEditedCar({ ...car });
                  setIsEditing(false);
                }}
              >
                ❌
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)}>✏️</button>
          )}
          <button onClick={() => setConfirmOpen(true)}>🗑️</button>
        </div>

        {isEditing ? (
          <input
            name="title"
            value={editedCar.title}
            onChange={handleChange}
            className="w-full px-2 py-1 mt-10 sm:mt-12 bg-rose-200 text-rose-900 rounded font-semibold text-lg"
          />
        ) : (
          <h3 className="text-white text-2xl font-bold">{car.title}</h3>
        )}

        {isEditing ? (
          <textarea
            name="description"
            value={editedCar.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-2 py-1 bg-rose-200 text-rose-900 rounded"
          />
        ) : (
          <p className="text-gray-300 mb-2">{car.description}</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-white">
          {carFields.map(({ label, key, unit = "" }) => (
            <p key={key}>
              {label}:{" "}
              {isEditing ? (
                ["price", "mileage", "engineSize", "year"].includes(key) ? (
                  <input
                    name={key}
                    value={editedCar[key]}
                    type="number"
                    step={key === "engineSize" ? "0.1" : "1"}
                    onChange={handleChange}
                    className="px-2 py-1 rounded bg-rose-200 text-rose-900"
                  />
                ) : (
                  <select
                    name={key}
                    value={editedCar[key]}
                    onChange={handleChange}
                    className="px-2 py-1 rounded bg-rose-200 text-rose-900"
                  >
                    {key === "engineType" &&
                      ["Electric", "Diesel", "Hybrid", "Petrol"].map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    {key === "transmission" &&
                      ["Automatic", "Manual"].map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    {key === "carType" &&
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
                      ].map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                  </select>
                )
              ) : (
                <span className="font-semibold text-rose-300">
                  {["price", "mileage"].includes(key)
                    ? `${unit}${formatNumber(car[key])}`
                    : key === "engineSize"
                    ? `${car[key]}L`
                    : `${unit}${car[key]}`}
                </span>
              )}
            </p>
          ))}
        </div>

        {isEditing && (
          <div className="mt-4 flex flex-col sm:flex-row gap-4 text-xl text-white">
            <div className="flex items-center gap-2">
              <Toggle
                checked={!!editedCar.isFeatured}
                onChange={(val) =>
                  setEditedCar((prev) => ({ ...prev, isFeatured: val }))
                }
                color="bg-yellow-400"
              />
              <span className="text-yellow-300 font-semibold select-none">
                Featured
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Toggle
                checked={!!editedCar.isSold}
                onChange={(val) =>
                  setEditedCar((prev) => ({ ...prev, isSold: val }))
                }
                color="bg-red-500"
              />
              <span className="text-red-400 font-semibold select-none">
                Sold
              </span>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title={`Delete ${car.title}?`}
        message="This will permanently remove the car from your listings."
      />
    </motion.li>
  );
};

export default memo(forwardRef(CarListItem));
