"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { databases, storage, ID } from "../lib/appwrite";
import { toast } from "sonner";
import { AiOutlineLoading } from "react-icons/ai";
import Image from "next/image";

const AddCarForm = ({ setCars, fetchCars, setActiveTab }) => {
  const initialState = {
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
  };

  const [newCar, setNewCar] = useState(initialState);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewCar((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleImageChange = useCallback(
    (e) => {
      const files = Array.from(e.target.files);
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
      setNewCar((prev) => ({ ...prev, images: files }));
      setImagePreviews(files.map((file) => URL.createObjectURL(file)));
    },
    [imagePreviews]
  );

  const validateFields = useCallback(() => {
    const { title, price, engineSize, mileage, year, images } = newCar;
    return (
      title.trim() &&
      !isNaN(price) &&
      !isNaN(engineSize) &&
      !isNaN(mileage) &&
      /^(19|20)\d{2}$/.test(year) &&
      images.length > 0
    );
  }, [newCar]);

  const resetForm = useCallback(() => {
    imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    setNewCar(initialState);
    setImagePreviews([]);
    setError("");
  }, [imagePreviews]);

  const handleAddCar = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");
      toast.dismiss("add-car-toast");

      if (!validateFields()) {
        const msg = "Please check all required fields.";
        setError(msg);
        toast.error(msg, { id: "add-car-toast" });
        return;
      }

      setLoading(true);
      try {
        const imageFileIds = [];
        const imageUrls = [];

        for (const image of newCar.images) {
          const file = await storage.createFile(
            process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
            ID.unique(),
            image
          );
          imageFileIds.push(file.$id);
          imageUrls.push(
            `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID}/files/${file.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}&mode=admin`
          );
        }

        const { images, ...carPayload } = newCar;

        const carData = await databases.createDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID,
          ID.unique(),
          {
            ...carPayload,
            price: parseFloat(newCar.price),
            engineSize: parseFloat(newCar.engineSize),
            mileage: parseFloat(newCar.mileage),
            year: parseInt(newCar.year, 10),
            imageUrl: imageUrls,
            imageFileIds,
            createdAt: new Date().toISOString(),
          }
        );

        toast.success("Car added successfully!", { id: "add-car-toast" });
        setCars((prev) => [...prev, carData]);
        fetchCars();
        setActiveTab("carList");
        resetForm();
      } catch (err) {
        console.error("Error adding car:", err);
        toast.error("Failed to add car. Please try again.", {
          id: "add-car-toast",
        });
      } finally {
        setLoading(false);
      }
    },
    [newCar, setCars, fetchCars, setActiveTab, validateFields, resetForm]
  );

  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-full max-w-xl p-6 bg-rose-900 shadow-lg rounded-lg border border-rose-200">
        <form
          onSubmit={handleAddCar}
          className="space-y-4 flex flex-col items-center"
        >
          <input
            name="title"
            value={newCar.title}
            onChange={handleInputChange}
            placeholder="Title"
            required
            className="w-full border border-rose-300 text-rose-800 rounded-md px-3 py-2"
          />
          <textarea
            name="description"
            value={newCar.description}
            onChange={handleInputChange}
            placeholder="Description"
            required
            className="w-full border border-rose-300 text-rose-800 rounded-md px-3 py-2"
          />
          <input
            name="price"
            value={newCar.price}
            onChange={handleInputChange}
            placeholder="Price"
            required
            className="w-full border border-rose-300 text-rose-800 rounded-md px-3 py-2"
          />
          <div className="flex space-x-4 w-full">
            <select
              name="engineType"
              value={newCar.engineType}
              onChange={handleInputChange}
              className="w-full border border-rose-300 text-rose-800 rounded-md px-3 py-2"
            >
              {["Electric", "Diesel", "Hybrid", "Petrol"].map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <select
              name="transmission"
              value={newCar.transmission}
              onChange={handleInputChange}
              className="w-full border border-rose-300 text-rose-800 rounded-md px-3 py-2"
            >
              {["Automatic", "Manual"].map((trans) => (
                <option key={trans} value={trans}>
                  {trans}
                </option>
              ))}
            </select>
          </div>
          <div className="flex space-x-4 w-full">
            <input
              name="engineSize"
              value={newCar.engineSize}
              onChange={handleInputChange}
              placeholder="Engine Size"
              required
              className="w-full border border-rose-300 text-rose-800 rounded-md px-3 py-2"
            />
            <input
              name="mileage"
              value={newCar.mileage}
              onChange={handleInputChange}
              placeholder="Mileage"
              required
              className="w-full border border-rose-300 text-rose-800 rounded-md px-3 py-2"
            />
          </div>
          <div className="flex space-x-4 w-full">
            <input
              name="year"
              value={newCar.year}
              onChange={handleInputChange}
              placeholder="Year"
              required
              className="w-full border border-rose-300 text-rose-800 rounded-md px-3 py-2"
            />
            <select
              name="carType"
              value={newCar.carType}
              onChange={handleInputChange}
              className="w-full border border-rose-300 text-rose-800 rounded-md px-3 py-2"
            >
              {carTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            multiple
            required
            className="w-full border border-rose-300 text-rose-200 rounded-md px-3 py-2"
          />
          {imagePreviews.length > 0 && (
            <div className="flex space-x-4 mt-4">
              {imagePreviews.map((preview, idx) => (
                <Image
                  key={idx}
                  src={preview}
                  alt={`Preview ${idx + 1}`}
                  className="object-cover rounded-md"
                  width={96}
                  height={96}
                  unoptimized
                />
              ))}
            </div>
          )}
          {error && <p className="text-red-600 mt-2">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-800 hover:bg-rose-700 text-white rounded-md py-2 mt-4 flex justify-center items-center"
          >
            {loading ? (
              <AiOutlineLoading className="animate-spin" size={22} />
            ) : (
              "Add Car"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default React.memo(AddCarForm);
