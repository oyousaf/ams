"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { databases, storage, ID } from "../../lib/appwrite";
import { toast } from "sonner";
import { AiOutlineLoading } from "react-icons/ai";
import Toggle from "./Toggle";

/* ---------------------------------------------
   Motion
--------------------------------------------- */
const shakeVariant = {
  idle: { x: 0 },
  shake: { x: [-6, 6, -4, 4, 0], transition: { duration: 0.35 } },
};

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

/* ---------------------------------------------
   Component
--------------------------------------------- */
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
      isSold: false,
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

  /* ---------------------------------------------
     Cleanup previews
  --------------------------------------------- */
  useEffect(() => {
    return () => previews.forEach(URL.revokeObjectURL);
  }, [previews]);

  /* ---------------------------------------------
     Handlers
  --------------------------------------------- */
  const update = (e) =>
    setCar((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onImages = (e) => {
    const files = Array.from(e.target.files);
    previews.forEach(URL.revokeObjectURL);
    setCar((p) => ({ ...p, images: files }));
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const isValid = () => {
    const { title, description, price, engineSize, mileage, year, images } =
      car;
    return (
      title.trim() &&
      description.trim() &&
      price >= 0 &&
      engineSize >= 0 &&
      mileage >= 0 &&
      /^\d{4}$/.test(year) &&
      images.length > 0
    );
  };

  const reset = () => {
    previews.forEach(URL.revokeObjectURL);
    setCar(initial);
    setPreviews([]);
  };

  /* ---------------------------------------------
     Submit
  --------------------------------------------- */
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isValid()) {
      setShake(true);
      toast.error("Please complete all required fields");
      return;
    }

    setLoading(true);
    try {
      const fileIds = [];
      const urls = [];

      for (const file of car.images) {
        const uploaded = await storage.createFile(
          process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
          ID.unique(),
          file,
        );

        fileIds.push(uploaded.$id);
        urls.push(
          `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID}/files/${uploaded.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}&mode=admin`,
        );
      }

      const payload = {
        ...car,
        price: +car.price,
        engineSize: +car.engineSize,
        mileage: +car.mileage,
        year: +car.year,
        imageUrl: urls,
        imageFileIds: fileIds,
        createdAt: new Date().toISOString(),
      };

      delete payload.images;

      const doc = await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID,
        ID.unique(),
        payload,
      );

      toast.success("Car added");
      setCars((p) => [...p, doc]);
      fetchCars();
      setActiveTab("carList");
      reset();
    } catch {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------------------------
     Render
  --------------------------------------------- */
  return (
    <motion.div
      className="relative h-full flex flex-col"
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      <form onSubmit={onSubmit} className="flex-1 overflow-y-auto p-4 pb-32">
        <motion.div
          variants={shakeVariant}
          animate={shake ? "shake" : "idle"}
          onAnimationComplete={() => setShake(false)}
          className="max-w-3xl mx-auto space-y-5"
        >
          {/* Core fields */}
          <input
            name="title"
            value={car.title}
            onChange={update}
            placeholder="Title"
            className="w-full h-11 px-4 rounded-lg bg-rose-800"
          />

          <textarea
            name="description"
            value={car.description}
            onChange={update}
            placeholder="Description"
            rows={4}
            className="w-full px-4 py-3 rounded-lg bg-rose-800 resize-none"
          />

          <input
            name="price"
            type="number"
            value={car.price}
            onChange={update}
            placeholder="Price"
            className="w-full h-11 px-4 rounded-lg bg-rose-800"
          />

          {/* Specs */}
          <div className="grid grid-cols-2 gap-3">
            <select
              name="engineType"
              value={car.engineType}
              onChange={update}
              className="h-11 px-3 rounded-lg bg-rose-800"
            >
              {["Electric", "Hybrid", "Petrol", "Diesel"].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>

            <select
              name="transmission"
              value={car.transmission}
              onChange={update}
              className="h-11 px-3 rounded-lg bg-rose-800"
            >
              {["Automatic", "Manual"].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>

            <input
              name="engineSize"
              type="number"
              value={car.engineSize}
              onChange={update}
              placeholder="Engine size"
              className="h-11 px-3 rounded-lg bg-rose-800"
            />

            <input
              name="mileage"
              type="number"
              value={car.mileage}
              onChange={update}
              placeholder="Mileage"
              className="h-11 px-3 rounded-lg bg-rose-800"
            />

            <input
              name="year"
              type="number"
              value={car.year}
              onChange={update}
              placeholder="Year"
              className="h-11 px-3 rounded-lg bg-rose-800"
            />

            <select
              name="carType"
              value={car.carType}
              onChange={update}
              className="h-11 px-3 rounded-lg bg-rose-800"
            >
              {carTypes.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Featured */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <Toggle
              checked={car.isFeatured}
              onChange={(v) => setCar((p) => ({ ...p, isFeatured: v }))}
              color="bg-yellow-400"
            />
            <span className="text-yellow-300 font-semibold">Featured</span>
          </div>

          {/* Images */}
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
            className="flex h-11 cursor-pointer items-center justify-center rounded-lg border border-white/20
            bg-rose-800/60 text-white hover:bg-rose-700/70 transition"
          >
            Choose images
          </label>

          {previews.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pt-2">
              {previews.map((src, i) => (
                <div
                  key={i}
                  className="relative w-24 h-16 rounded-lg overflow-hidden"
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </form>

      {/* Sticky submit */}
      <div className="fixed bottom-0 left-0 right-0 bg-rose-950 border-t border-white/10 px-4 py-3">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={onSubmit}
            disabled={loading}
            className="w-full h-12 rounded-xl bg-rose-700 font-semibold flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <AiOutlineLoading className="animate-spin" />
                Uploading…
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
