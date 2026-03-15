"use client";

import React, { useState, useRef, forwardRef, memo } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import ConfirmModal from "./ConfirmModal";
import Toggle from "./Toggle";
import Image from "next/image";
import { FiEdit2, FiTrash2, FiSave, FiX } from "react-icons/fi";
import { resolveImage } from "@/lib/resolveImage";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";
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

const META_FIELDS = [
  { label: "Price", key: "price", unit: "£", pos: "prefix" },
  { label: "Mileage", key: "mileage" },
  { label: "Engine Type", key: "engineType" },
  { label: "Engine Size", key: "engineSize", unit: "L", pos: "suffix" },
  { label: "Transmission", key: "transmission" },
  { label: "Year", key: "year" },
  { label: "Type", key: "carType" },
];

const formatNumber = (v) =>
  typeof v === "number" ? v.toLocaleString("en-GB") : v;

const CarListItem = forwardRef(function CarListItem(
  { car, setCars, setModalOpen },
  ref,
) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const dragIndex = useRef(null);

  const [editedCar, setEditedCar] = useState({
    ...car,
    imageUrls: car.imageUrls || car.image_urls || [],
  });

  const images = editedCar.imageUrls || [];

  const mainImage = resolveImage(images[0]) || FALLBACK_IMAGE;

  function resetEdit() {
    setEditedCar({
      ...car,
      imageUrls: car.imageUrls || car.image_urls || [],
    });
    setIsEditing(false);
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setEditedCar((p) => ({
      ...p,
      [name]: NUMERIC_FIELDS.includes(name)
        ? value === ""
          ? ""
          : Number(value)
        : value,
    }));
  }

  function removeImage(i) {
    setEditedCar((p) => ({
      ...p,
      imageUrls: p.imageUrls.filter((_, idx) => idx !== i),
    }));
  }

  function reorderImages(from, to) {
    const arr = [...images];
    const moved = arr.splice(from, 1)[0];
    arr.splice(to, 0, moved);

    setEditedCar((p) => ({
      ...p,
      imageUrls: arr,
    }));
  }

  async function save() {
    if (saving) return;

    setSaving(true);

    try {
      const existing = images.filter(
        (img) => typeof img === "string" && img.startsWith("/images/"),
      );

      const blobs = images.filter(
        (img) => typeof img === "string" && img.startsWith("blob:"),
      );

      const form = new FormData();

      Object.entries({
        title: editedCar.title,
        description: editedCar.description,
        price: editedCar.price,
        engineType: editedCar.engineType,
        engineSize: editedCar.engineSize,
        transmission: editedCar.transmission,
        mileage: editedCar.mileage,
        year: editedCar.year,
        carType: editedCar.carType,
        isFeatured: !!editedCar.isFeatured,
        isSold: !!editedCar.isSold,
      }).forEach(([k, v]) => form.append(k, String(v ?? "")));

      form.append("image_urls", JSON.stringify(existing));

      for (const blobUrl of blobs) {
        const blob = await fetch(blobUrl).then((r) => r.blob());
        form.append("images", blob, `upload-${Date.now()}.jpg`);
      }

      const res = await fetch(`${API_BASE}/api/cars/${car.id}`, {
        method: "PUT",
        body: form,
      });

      const updated = await res.json();

      if (!res.ok) throw new Error(updated?.error || "Update failed");

      setCars((prev) => prev.map((c) => (c.id === car.id ? updated : c)));

      setEditedCar({
        ...updated,
        imageUrls: updated.imageUrls || updated.image_urls || [],
      });

      toast.success("Car updated");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    try {
      const res = await fetch(`${API_BASE}/api/cars/${car.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      setCars((p) => p.filter((c) => c.id !== car.id));

      toast.success("Car deleted");

      setConfirmOpen(false);
      setModalOpen?.(false);
    } catch (err) {
      toast.error(err.message || "Delete failed");
      setConfirmOpen(false);
      setModalOpen?.(false);
    }
  }

  return (
    <motion.li
      ref={ref}
      layout
      layoutId={car.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="rounded-xl border border-white/10 bg-rose-900/70 p-4"
    >
      <div className="flex flex-col sm:flex-row gap-4">
        {/* IMAGE */}
        <div className="relative sm:w-1/3 space-y-2">
          {car.isFeatured && (
            <span className="absolute top-2 left-2 z-10 rounded-full bg-yellow-400 px-2 py-1 text-xs font-bold text-rose-950">
              Featured
            </span>
          )}

          <Image
            src={mainImage}
            alt={car.title}
            width={500}
            height={300}
            unoptimized
            className={`rounded-lg object-cover w-full ${
              car.isSold ? "opacity-60" : ""
            }`}
          />

          {car.isSold && (
            <div className="absolute inset-0 grid place-items-center rounded-lg bg-black/50 text-3xl font-extrabold text-rose-300">
              SOLD
            </div>
          )}

          {isEditing && (
            <>
              <input
                id={`edit-images-${car.id}`}
                type="file"
                multiple
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  const previews = files.map((f) => URL.createObjectURL(f));

                  setEditedCar((p) => ({
                    ...p,
                    imageUrls: [...p.imageUrls, ...previews],
                  }));

                  e.target.value = "";
                }}
              />

              <label
                htmlFor={`edit-images-${car.id}`}
                className="flex h-9 cursor-pointer items-center justify-center rounded-lg border border-white/20 bg-rose-800/60 text-white text-sm hover:bg-rose-700/70"
              >
                Add images
              </label>

              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, i) => {
                  const src = resolveImage(img);

                  return (
                    <div
                      key={i}
                      draggable
                      onDragStart={() => (dragIndex.current = i)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => {
                        if (
                          dragIndex.current === null ||
                          dragIndex.current === i
                        )
                          return;

                        reorderImages(dragIndex.current, i);
                        dragIndex.current = null;
                      }}
                      className="relative w-20 h-14 rounded overflow-hidden border border-white/20 cursor-move"
                    >
                      <Image
                        src={src}
                        alt=""
                        fill
                        className="object-cover"
                        unoptimized
                      />

                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 text-white text-xs flex items-center justify-center"
                      >
                        remove
                      </button>

                      {i === 0 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[10px] text-center">
                          main
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* CONTENT */}
        <div
          className={`relative flex-1 space-y-3 ${isEditing ? "pt-10" : ""}`}
        >
          <div className="absolute top-0 right-0 flex gap-2 rounded-md bg-rose-950/70 backdrop-blur px-2 py-1 text-lg">
            {isEditing ? (
              <>
                <button type="button" onClick={save} disabled={saving}>
                  <FiSave />
                </button>

                <button type="button" onClick={resetEdit}>
                  <FiX />
                </button>
              </>
            ) : (
              <button type="button" onClick={() => setIsEditing(true)}>
                <FiEdit2 />
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setConfirmOpen(true);
                setModalOpen?.(true);
              }}
            >
              <FiTrash2 />
            </button>
          </div>

          {isEditing ? (
            <input
              name="title"
              value={editedCar.title || ""}
              onChange={handleChange}
              className="w-full rounded bg-rose-200 px-2 py-1 font-bold text-rose-900"
            />
          ) : (
            <h3 className="text-2xl font-bold text-white">{car.title}</h3>
          )}

          {isEditing ? (
            <textarea
              name="description"
              value={editedCar.description || ""}
              onChange={handleChange}
              rows={3}
              className="w-full rounded bg-rose-200 px-2 py-1 text-rose-900"
            />
          ) : (
            <p className="text-rose-200">{car.description}</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {META_FIELDS.map(({ label, key, unit, pos }) => (
              <div key={key}>
                {label}:{" "}
                {isEditing ? (
                  NUMERIC_FIELDS.includes(key) ? (
                    <input
                      name={key}
                      type="number"
                      value={
                        Number.isFinite(Number(editedCar[key]))
                          ? editedCar[key]
                          : ""
                      }
                      onChange={handleChange}
                      className="rounded bg-rose-200 px-2 py-1 text-rose-900"
                    />
                  ) : (
                    <select
                      name={key}
                      value={editedCar[key] || ""}
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
                    {pos === "prefix" && unit}
                    {key === "price" || key === "mileage"
                      ? formatNumber(car[key])
                      : car[key]}
                    {pos === "suffix" && unit}
                  </span>
                )}
              </div>
            ))}
          </div>

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
                <span className="text-sm text-rose-200">Featured</span>
              </div>

              <div className="flex items-center gap-2">
                <Toggle
                  checked={!!editedCar.isSold}
                  onChange={(v) => setEditedCar((p) => ({ ...p, isSold: v }))}
                  color="bg-red-500"
                />
                <span className="text-sm text-rose-200">Sold</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setModalOpen?.(false);
        }}
        onConfirm={remove}
        title={`Delete ${car.title}?`}
        message="This will permanently remove the car."
      />
    </motion.li>
  );
});

export default memo(CarListItem);
