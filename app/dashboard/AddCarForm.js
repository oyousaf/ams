"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { databases, storage, ID } from "../lib/appwrite";
import { toast } from "react-toastify";
import { AiOutlineLoading } from "react-icons/ai";
import Image from "next/image";

const AddCarForm = ({ setCars, fetchCars, setActiveTab }) => {
  const [newCar, setNewCar] = useState({
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
  });

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

  const [imagePreviews, setImagePreviews] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Clean up object URLs on unmount or when images change
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewCar((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleImageChange = useCallback((e) => {
    const files = Array.from(e.target.files);

    // Revoke old previews URLs
    imagePreviews.forEach((url) => URL.revokeObjectURL(url));

    setNewCar((prev) => ({ ...prev, images: files }));
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  }, [imagePreviews]);

  const validateFields = useCallback(() => {
    if (
      !newCar.title.trim() ||
      !newCar.price ||
      isNaN(newCar.price) ||
      !newCar.engineSize ||
      isNaN(newCar.engineSize) ||
      !newCar.mileage ||
      isNaN(newCar.mileage) ||
      !newCar.year ||
      !/^(19|20)\d{2}$/.test(newCar.year) ||
      newCar.images.length === 0
    ) {
      return false;
    }
    return true;
  }, [newCar]);

  const resetForm = useCallback(() => {
    // Revoke previews before clearing
    imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    setNewCar({
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
    });
    setImagePreviews([]);
    setError("");
  }, [imagePreviews]);

  const handleAddCar = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");

      if (!validateFields()) {
        const validationError =
          "Something's not quite right mg. Please check all relevant fields and try again.";
        setError(validationError);
        toast.error(validationError);
        return;
      }

      setLoading(true);
      try {
        // Upload images
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

        const carData = await databases.createDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID,
          ID.unique(),
          {
            title: newCar.title.trim(),
            description: newCar.description.trim(),
            price: parseFloat(newCar.price),
            engineType: newCar.engineType,
            engineSize: parseFloat(newCar.engineSize),
            transmission: newCar.transmission,
            mileage: parseFloat(newCar.mileage),
            imageUrl: imageUrls,
            imageFileIds: imageFileIds,
            createdAt: new Date().toISOString(),
            year: parseInt(newCar.year, 10),
            carType: newCar.carType,
          }
        );

        toast.success("Car added successfully!");
        setCars((prev) => [...prev, carData]);
        fetchCars();
        setActiveTab("carList");
        resetForm();
      } catch (error) {
        console.error("Error adding car:", error);
        toast.error("Failed to add car. Please try again.");
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
          id="addCar"
          name="addCar"
          onSubmit={handleAddCar}
          className="space-y-4 flex flex-col items-center"
        >
          <input
            id="title"
            name="title"
            type="text"
            value={newCar.title}
            onChange={handleInputChange}
            placeholder="Title"
            required
            className="w-full border border-rose-300 text-rose-800 rounded-md px-3 py-2"
            autoComplete="on"
            aria-label="Car title"
          />
          <textarea
            id="description"
            name="description"
            value={newCar.description}
            onChange={handleInputChange}
            placeholder="Description"
            required
            className="w-full border border-rose-300 text-rose-800 rounded-md px-3 py-2"
            autoComplete="on"
            aria-label="Car description"
          />
          <input
            id="price"
            name="price"
            type="text"
            value={newCar.price}
            onChange={handleInputChange}
            placeholder="Price"
            required
            className="w-full border border-rose-300 text-rose-800 rounded-md px-3 py-2"
            autoComplete="on"
            aria-label="Price"
          />
          <div className="flex space-x-4 w-full">
            <select
              id="engineType"
              name="engineType"
              value={newCar.engineType}
              onChange={handleInputChange}
              className="w-full border border-rose-300 text-rose-800 rounded-md px-3 py-2"
              aria-label="Engine type"
            >
              <option value="Electric">Electric</option>
              <option value="Diesel">Diesel</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Petrol">Petrol</option>
            </select>
            <select
              id="transmission"
              name="transmission"
              value={newCar.transmission}
              onChange={handleInputChange}
              className="w-full border border-rose-300 text-rose-800 rounded-md px-3 py-2"
              aria-label="Transmission type"
            >
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
            </select>
          </div>
          <div className="flex space-x-4 w-full">
            <input
              id="engineSize"
              name="engineSize"
              type="text"
              value={newCar.engineSize}
              onChange={handleInputChange}
              placeholder="Engine Size"
              required
              className="w-full border border-rose-300 text-rose-800 rounded-md px-3 py-2"
              aria-label="Engine size"
            />
            <input
              id="mileage"
              name="mileage"
              type="text"
              value={newCar.mileage}
              onChange={handleInputChange}
              placeholder="Mileage"
              required
              className="w-full border border-rose-300 text-rose-800 rounded-md px-3 py-2"
              aria-label="Mileage"
            />
          </div>
          <div className="flex space-x-4 w-full">
            <input
              id="year"
              name="year"
              type="text"
              value={newCar.year}
              onChange={handleInputChange}
              placeholder="Year"
              required
              className="w-full border border-rose-300 text-rose-800 rounded-md px-3 py-2"
              aria-label="Year"
            />
            <select
              id="carType"
              name="carType"
              value={newCar.carType}
              onChange={handleInputChange}
              className="w-full border border-rose-300 text-rose-800 rounded-md px-3 py-2"
              aria-label="Car type"
            >
              {carTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <input
            id="images"
            name="images"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
            className="w-full border border-rose-300 text-rose-200 rounded-md px-3 py-2"
            multiple
            aria-label="Upload car images"
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
            aria-busy={loading}
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
