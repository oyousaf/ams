"use client";

import React, { useState, useMemo, forwardRef, memo } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { databases } from "@/lib/appwrite";
import ConfirmModal from "./ConfirmModal";
import Toggle from "./Toggle";
import Image from "next/image";
import { FiEdit2, FiTrash2, FiSave, FiX } from "react-icons/fi";

const FALLBACK_IMAGE = "/fallback.webp";

const ENGINE_TYPES = ["Electric", "Diesel", "Hybrid", "Petrol"];
const TRANSMISSIONS = ["Automatic", "Manual"];
const CAR_TYPES = [
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

const NUMERIC_FIELDS = ["price", "mileage", "engineSize", "year"];

const formatNumber = (n) =>
  typeof n === "number" ? n.toLocaleString("en-GB") : n;

const hasMeaningfulChanges = (a, b) =>
  Object.keys(b).some((k) => a[k] !== b[k]);

const CarListItem = ({ car, setCars, setModalOpen }, ref) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCar, setEditedCar] = useState(car);
  const [saving, setSaving] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const imageUrl = useMemo(() => {
    const url = Array.isArray(car.imageUrl) ? car.imageUrl[0] : car.imageUrl;
    return !url || imgError ? FALLBACK_IMAGE : url;
  }, [car.imageUrl, imgError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedCar((p) => ({
      ...p,
      [name]: NUMERIC_FIELDS.includes(name) ? Number(value) : value,
    }));
  };

  const openConfirm = () => {
    setConfirmOpen(true);
    setModalOpen?.(true);
  };

  const closeConfirm = () => {
    setConfirmOpen(false);
    setModalOpen?.(false);
  };

  const save = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const updated = await databases.updateDocument({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        collectionId: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID,
        documentId: car.$id,
        data: editedCar,
      });

      if (updated?.$id && hasMeaningfulChanges(car, editedCar)) {
        setCars((prev) =>
          prev.map((c) => (c.$id === car.$id ? { ...c, ...editedCar } : c)),
        );
      }

      toast.success("Car updated");
      setIsEditing(false);
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    try {
      const { storage } = await import("@/lib/appwrite");
      for (const fileId of car.imageFileIds || []) {
        await storage.deleteFile({
          bucketId: process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
          fileId,
        });
      }

      await databases.deleteDocument({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        collectionId: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID,
        documentId: car.$id,
      });

      setCars((p) => p.filter((c) => c.$id !== car.$id));
      toast.success("Car deleted");
      closeConfirm();
    } catch {
      toast.error("Delete failed");
      closeConfirm();
    }
  };

  return (
    <motion.li
      ref={ref}
      layout
      layoutId={car.$id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="relative z-0 rounded-xl border border-white/10 bg-rose-900/70 p-4"
    >
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Image */}
        <div className="relative sm:w-1/3">
          {car.isFeatured && (
            <span className="absolute top-2 left-2 z-10 rounded-full bg-yellow-400 px-2 py-1 text-xs font-bold text-rose-950">
              Featured
            </span>
          )}

          <Image
            src={imageUrl}
            alt={car.title}
            width={500}
            height={300}
            onError={() => setImgError(true)}
            className={`rounded-lg object-cover w-full ${
              car.isSold ? "opacity-60" : ""
            }`}
            unoptimized={imageUrl.startsWith("blob:")}
          />

          {car.isSold && (
            <div className="absolute inset-0 grid place-items-center rounded-lg bg-black/50 text-3xl font-extrabold text-rose-300">
              SOLD
            </div>
          )}
        </div>

        {/* Content */}
        <div
          className={`relative flex-1 space-y-3 ${isEditing ? "pt-10" : ""}`}
        >
          {/* Actions */}
          <div className="absolute top-0 right-0 flex gap-2 rounded-md bg-rose-950/70 backdrop-blur px-2 py-1 text-lg">
            {isEditing ? (
              <>
                <button onClick={save} disabled={saving} aria-label="Save">
                  <FiSave />
                </button>
                <button
                  onClick={() => {
                    setEditedCar(car);
                    setIsEditing(false);
                  }}
                  aria-label="Cancel"
                >
                  <FiX />
                </button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} aria-label="Edit">
                <FiEdit2 />
              </button>
            )}
            <button onClick={openConfirm} aria-label="Delete">
              <FiTrash2 />
            </button>
          </div>

          {/* Title */}
          {isEditing ? (
            <input
              name="title"
              value={editedCar.title}
              onChange={handleChange}
              className="w-full rounded bg-rose-200 px-2 py-1 font-bold text-rose-900"
            />
          ) : (
            <h3 className="text-2xl font-bold text-white">{car.title}</h3>
          )}

          {/* Description */}
          {isEditing ? (
            <textarea
              name="description"
              value={editedCar.description}
              onChange={handleChange}
              rows={3}
              className="w-full rounded bg-rose-200 px-2 py-1 text-rose-900"
            />
          ) : (
            <p className="text-rose-200">{car.description}</p>
          )}

          {/* Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {[
              ["Price", "price", "£"],
              ["Mileage", "mileage"],
              ["Engine Type", "engineType"],
              ["Engine Size", "engineSize", "L"],
              ["Transmission", "transmission"],
              ["Year", "year"],
              ["Type", "carType"],
            ].map(([label, key, unit = ""]) => (
              <div key={key}>
                {label}:{" "}
                {isEditing ? (
                  NUMERIC_FIELDS.includes(key) ? (
                    <input
                      name={key}
                      type="number"
                      value={editedCar[key]}
                      onChange={handleChange}
                      className="rounded bg-rose-200 px-2 py-1 text-rose-900"
                    />
                  ) : (
                    <select
                      name={key}
                      value={editedCar[key]}
                      onChange={handleChange}
                      className="rounded bg-rose-200 px-2 py-1 text-rose-900"
                    >
                      {(key === "engineType"
                        ? ENGINE_TYPES
                        : key === "transmission"
                          ? TRANSMISSIONS
                          : CAR_TYPES
                      ).map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  )
                ) : (
                  <span className="font-semibold text-rose-300">
                    {unit}
                    {formatNumber(car[key])}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Toggles */}
          {isEditing && (
            <div className="mt-4 flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Toggle
                  checked={!!editedCar.isFeatured}
                  onChange={(v) =>
                    setEditedCar((p) => ({ ...p, isFeatured: v }))
                  }
                  color="bg-yellow-400"
                />
                <span className="font-semibold text-yellow-300 select-none">
                  Featured
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Toggle
                  checked={!!editedCar.isSold}
                  onChange={(v) => setEditedCar((p) => ({ ...p, isSold: v }))}
                  color="bg-red-500"
                />
                <span className="font-semibold text-red-400 select-none">
                  Sold
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={closeConfirm}
        onConfirm={remove}
        title={`Delete ${car.title}?`}
        message="This will permanently remove the car."
      />
    </motion.li>
  );
};

export default memo(forwardRef(CarListItem));
