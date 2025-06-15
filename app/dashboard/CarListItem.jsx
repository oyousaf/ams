"use client";

import React, { useState, forwardRef, memo } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { databases } from "../lib/appwrite";
import ConfirmModal from "./ConfirmModal";
import Toggle from "./Toggle";

const FALLBACK_IMAGE = "/fallback.webp";

const formatNumber = (num) =>
  typeof num === "number" ? num.toLocaleString("en-GB") : num;

const CarListItem = ({ car, setCars }, ref) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCar, setEditedCar] = useState({ ...car });
  const [saving, setSaving] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const imageUrl = hasError ? FALLBACK_IMAGE : car.imageUrl;

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
          title: editedCar.title,
          description: editedCar.description,
          price: editedCar.price,
          mileage: editedCar.mileage,
          engineSize: editedCar.engineSize,
          year: editedCar.year,
          transmission: editedCar.transmission,
          engineType: editedCar.engineType,
          carType: editedCar.carType,
          isFeatured: editedCar.isFeatured ?? false,
          isSold: editedCar.isSold ?? false,
        }
      );

      if (updated?.$id) {
        setCars((prev) =>
          prev.map((c) => (c.$id === car.$id ? { ...c, ...editedCar } : c))
        );
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

  const carFields = [
    ["Price", "price", "£"],
    ["Mileage", "mileage"],
    ["Engine Type", "engineType"],
    ["Engine Size", "engineSize", "L"],
    ["Transmission", "transmission"],
    ["Year", "year"],
    ["Type", "carType"],
  ];

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
        {/* Badges in top left */}
        <div className="absolute top-2 left-2 flex flex-col gap-2 z-10 uppercase">
          {car.isFeatured && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-yellow-400 text-rose-950 text-xs font-bold px-2 py-1 rounded shadow"
            >
              Featured
            </motion.div>
          )}
        </div>

        {/* Main image */}
        <img
          src={imageUrl}
          alt={car.title}
          className={`rounded-md object-cover w-full h-auto transition-opacity duration-300 ${
            car.isSold ? "opacity-60" : "opacity-100"
          }`}
          width={500}
          height={500}
          onError={() => setHasError(true)}
        />

        {/* SOLD overlay */}
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
              <button onClick={handleSave} disabled={saving} title="Save">
                💾
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedCar({ ...car });
                }}
                title="Cancel"
              >
                ❌
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} title="Edit">
              ✏️
            </button>
          )}
          <button onClick={() => setConfirmOpen(true)} title="Delete">
            🗑️
          </button>
        </div>

        {isEditing ? (
          <input
            name="title"
            type="text"
            value={editedCar.title}
            onChange={handleChange}
            className="w-full px-2 py-1 mt-10 sm:mt-12 bg-rose-200 text-rose-900 rounded font-semibold text-lg focus:glow-pulse"
          />
        ) : (
          <h3 className="font-bold text-white text-2xl">{car.title}</h3>
        )}

        {isEditing ? (
          <textarea
            name="description"
            value={editedCar.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-2 py-1 bg-rose-200 text-rose-900 rounded focus:glow-pulse"
            placeholder="Car description..."
          />
        ) : (
          <p className="text-gray-300 mb-2">{car.description}</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-white">
          {carFields.map(([label, key, unit = ""]) => (
            <p key={key}>
              {label}:{" "}
              {isEditing &&
              ["price", "mileage", "engineSize", "year"].includes(key) ? (
                <input
                  name={key}
                  value={editedCar[key]}
                  type="number"
                  step={key === "engineSize" ? "0.1" : "1"}
                  onChange={handleChange}
                  className="px-2 py-1 rounded bg-rose-200 text-rose-900 focus:glow-pulse"
                />
              ) : isEditing &&
                ["engineType", "transmission", "carType"].includes(key) ? (
                <select
                  name={key}
                  value={editedCar[key]}
                  onChange={handleChange}
                  className="px-2 py-1 rounded bg-rose-200 text-rose-900 focus:glow-pulse"
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
