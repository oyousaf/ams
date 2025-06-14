"use client";

import React, { useState, memo } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { databases } from "../lib/appwrite";
import ConfirmModal from "./ConfirmModal";

const FALLBACK_IMAGE = "/fallback.webp";

const formatNumber = (num) =>
  typeof num === "number" ? num.toLocaleString("en-UK") : num;

const CarListItem = ({ car, setCars }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCar, setEditedCar] = useState({ ...car });
  const [saving, setSaving] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const imageUrl = hasError ? FALLBACK_IMAGE : car.imageUrl;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedCar((prev) => ({
      ...prev,
      [name]: ["price", "mileage", "engineSize", "year"].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);

    try {
      const {
        title,
        description,
        price,
        mileage,
        engineSize,
        year,
        transmission,
        engineType,
        carType,
      } = editedCar;

      const result = await databases.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID,
        car.$id,
        {
          title,
          description,
          price,
          mileage,
          engineSize,
          year,
          transmission,
          engineType,
          carType,
        }
      );

      if (result?.$id) {
        setCars((prev) =>
          prev.map((c) => (c.$id === car.$id ? { ...c, ...editedCar } : c))
        );
        toast.success("Car updated!", { id: `toast-${car.$id}` });
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
      toast.success("Car deleted!", { id: `toast-delete-${car.$id}` });
      setConfirmOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete car.", { id: `toast-delete-${car.$id}` });
    }
  };

  return (
    <motion.li
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`border border-rose-200 rounded-md p-4 mb-3 flex flex-col sm:flex-row items-start bg-rose-900 text-gray-200 relative`}
    >
      {/* IMAGE */}
      <figure className="w-full sm:w-1/3 mr-0 sm:mr-4 mb-4 sm:mb-0">
        <img
          src={imageUrl}
          alt={car.title}
          className="rounded-md object-cover w-full h-auto"
          width={500}
          height={500}
          onError={() => setHasError(true)}
        />
        <figcaption className="sr-only">Image of {car.title}</figcaption>
      </figure>

      {/* DETAILS */}
      <div className="w-full sm:w-2/3 space-y-2 relative">
        {/* BUTTONS */}
        <div className="flex justify-end gap-3 sm:absolute sm:top-0 sm:right-0 z-10 mb-2 sm:mb-0">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="text-green-400 hover:text-green-600"
                title="Save"
              >
                💾
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedCar({ ...car });
                }}
                className="text-gray-300 hover:text-white"
                title="Cancel"
              >
                ❌
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-400 hover:text-blue-600"
              title="Edit"
            >
              ✏️
            </button>
          )}
          <button
            onClick={() => setConfirmOpen(true)}
            className="text-rose-400 hover:text-rose-600"
            title="Delete"
          >
            🗑️
          </button>
        </div>

        {/* TITLE */}
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

        {/* DESCRIPTION */}
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

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-white">
          {[
            ["Price", "price", "£"],
            ["Mileage", "mileage"],
            ["Engine Type", "engineType"],
            ["Engine Size", "engineSize", "L"],
            ["Transmission", "transmission"],
            ["Year", "year"],
            ["Type", "carType"],
          ].map(([label, key, unit = ""]) => (
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
                  {key === "price" || key === "mileage"
                    ? `${unit}${formatNumber(car[key])}`
                    : key === "engineSize"
                    ? `${car[key]}L`
                    : `${unit}${car[key]}`}
                </span>
              )}
            </p>
          ))}
        </div>
      </div>

      {/* CONFIRM DELETE */}
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

export default memo(CarListItem);
