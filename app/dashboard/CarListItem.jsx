"use client";

import React, { useState, memo } from "react";
import { IoTrash } from "react-icons/io5";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { databases } from "../lib/appwrite";

const FALLBACK_IMAGE = "/fallback.webp";

const CarListItem = ({ car, setCars }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCar, setEditedCar] = useState({ ...car });
  const [saving, setSaving] = useState(false);
  const [hasError, setHasError] = useState(false);

  const carTypes = [
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
  ];

  const imageUrl = hasError ? FALLBACK_IMAGE : car.imageUrl;

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = ["price", "mileage", "engineSize", "year"].includes(
      name
    )
      ? Number(value)
      : value;
    setEditedCar((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);

    try {
      const result = await databases.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID,
        car.$id,
        {
          title: editedCar.title,
          description: editedCar.description,
          price: editedCar.price,
          engineType: editedCar.engineType,
          engineSize: editedCar.engineSize,
          transmission: editedCar.transmission,
          mileage: editedCar.mileage,
          year: editedCar.year,
          carType: editedCar.carType,
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
    if (!confirm(`Delete ${car.title}?`)) return;
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
      className={`border border-rose-200 rounded-md p-4 mb-3 flex flex-col sm:flex-row items-start bg-rose-900 text-gray-200 relative ${
        isEditing ? "animate-glow-pulse" : ""
      }`}
    >
      <figure className="w-full sm:w-1/3 mr-4 mb-4 sm:mb-0">
        <img
          src={imageUrl}
          alt={car.title}
          className="rounded-md object-cover"
          width={500}
          height={500}
          onError={() => setHasError(true)}
        />
        <figcaption className="sr-only">Image of {car.title}</figcaption>
      </figure>

      <div className="w-full sm:w-2/3 space-y-2">
        {isEditing ? (
          <input
            name="title"
            type="text"
            value={editedCar.title}
            onChange={handleChange}
            className="w-full px-2 py-1 bg-white text-rose-900 rounded font-semibold text-lg  glow-pulse"
          />
        ) : (
          <h3 className="font-bold text-white text-2xl ">{car.title}</h3>
        )}
        <p className="text-gray-300 mb-2">
          {isEditing ? (
            <textarea
              name="description"
              value={editedCar.description}
              onChange={handleChange}
              className="w-full px-2 py-1 rounded bg-rose-100 text-rose-900"
            />
          ) : (
            car.description
          )}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-white">
          {["price", "mileage", "engineSize", "year"].map((key) => (
            <p key={key}>
              {key.charAt(0).toUpperCase() + key.slice(1)}:{" "}
              {isEditing ? (
                <input
                  name={key}
                  type="number"
                  step={key === "engineSize" ? "0.1" : "1"}
                  value={editedCar[key]}
                  onChange={handleChange}
                  className="px-2 py-1 rounded bg-rose-100 text-rose-900"
                />
              ) : (
                <span className="font-semibold text-rose-300">
                  {key === "price"
                    ? `£${editedCar[key].toLocaleString()}`
                    : key === "engineSize"
                    ? `${editedCar[key]}L`
                    : editedCar[key]}
                </span>
              )}
            </p>
          ))}

          {["engineType", "transmission", "carType"].map((key) => (
            <p key={key}>
              {key.charAt(0).toUpperCase() + key.slice(1)}:{" "}
              {isEditing ? (
                <select
                  name={key}
                  value={editedCar[key]}
                  onChange={handleChange}
                  className="px-2 py-1 rounded bg-rose-100 text-rose-900"
                >
                  {(key === "engineType"
                    ? ["Electric", "Diesel", "Hybrid", "Petrol"]
                    : key === "transmission"
                    ? ["Automatic", "Manual"]
                    : carTypes
                  ).map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="font-semibold text-rose-300">
                  {editedCar[key]}
                </span>
              )}
            </p>
          ))}
        </div>
      </div>

      <div className="absolute top-4 right-4 flex gap-2">
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
            className="hover:text-blue-500"
            title="Edit"
          >
            ✏️
          </button>
        )}
        <button
          onClick={handleDelete}
          className="text-rose-400 hover:text-rose-600"
          title="Delete"
        >
          <IoTrash size={22} />
        </button>
      </div>
    </motion.li>
  );
};

export default memo(CarListItem);
