"use client";

import React, { useState } from "react";
import { databases, storage, ID } from "../lib/appwrite";
import { ToastContainer, toast } from "react-toastify";
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
  ].sort();

  const [imagePreviews, setImagePreviews] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddCar = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Basic validation checks
    if (
      !newCar.title ||
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
      setError(
        "Please fill in all required fields correctly, including at least one image and a valid year (1900-2099)."
      );
      setLoading(false);
      return;
    }

    // Upload images to Appwrite storage using file IDs
    let imageUrls = [];
    let imageFileIds = [];
    try {
      for (const image of newCar.images) {
        const file = await storage.createFile(
          process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
          ID.unique(),
          image
        );

        // Store the file ID for future deletion
        imageFileIds.push(file.$id);

        const imageUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID}/files/${file.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}&mode=admin`;
        imageUrls.push(imageUrl);
      }
    } catch (uploadError) {
      console.error("Error uploading images:", uploadError);
      toast.error("Error uploading images. Please try again.");
      setLoading(false);
      return;
    }

    // Create car document in Appwrite database
    try {
      const carData = await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID,
        ID.unique(),
        {
          title: newCar.title,
          description: newCar.description,
          price: parseFloat(newCar.price),
          engineType: newCar.engineType,
          engineSize: parseFloat(newCar.engineSize),
          transmission: newCar.transmission,
          mileage: parseFloat(newCar.mileage),
          imageUrl: imageUrls,
          imageFileIds: imageFileIds,
          createdAt: new Date().toISOString(),
          year: parseInt(newCar.year),
          carType: newCar.carType,
        }
      );

      toast.success("Car added successfully!");

      // Fetch and Set
      fetchCars();
      setCars((prevCars) => [...prevCars, carData]);
      setActiveTab("carList");

      // Reset the form after successful submission
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
    } catch (insertError) {
      console.error("Error adding car:", insertError);
      toast.error("Error adding car. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewCar({ ...newCar, images: files });

    // Generate image previews
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previewUrls);
  };

  return (
    <div className="w-full flex flex-col items-center py-8">
      <ToastContainer />
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
            onChange={(e) => setNewCar({ ...newCar, title: e.target.value })}
            placeholder="Title"
            required
            className="w-full border border-rose-300 text-rose-800 rounded-md px-3 py-2"
            autoComplete="on"
          />

          <textarea
            id="description"
            name="description"
            value={newCar.description}
            onChange={(e) =>
              setNewCar({ ...newCar, description: e.target.value })
            }
            placeholder="Description"
            required
            className="w-full border border-rose-300 text-rose-800 rounded-md px-3 py-2"
            autoComplete="on"
          />

          <input
            id="price"
            name="price"
            type="text"
            value={newCar.price}
            onChange={(e) => setNewCar({ ...newCar, price: e.target.value })}
            placeholder="Price"
            required
            className="w-full border border-rose-300 text-rose-800 rounded-md px-3 py-2"
            autoComplete="on"
          />

          <div className="flex space-x-4 w-full">
            <select
              id="engineType"
              name="engineType"
              value={newCar.engineType}
              onChange={(e) =>
                setNewCar({ ...newCar, engineType: e.target.value })
              }
              className="w-full border border-rose-300 text-rose-800 rounded-md px-3 py-2"
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
              onChange={(e) =>
                setNewCar({ ...newCar, transmission: e.target.value })
              }
              className="w-full border border-rose-300 text-rose-800 rounded-md px-3 py-2"
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
              onChange={(e) =>
                setNewCar({ ...newCar, engineSize: e.target.value })
              }
              placeholder="Engine Size"
              required
              className="w-full border border-rose-300 text-rose-800 rounded-md px-3 py-2"
            />

            <input
              id="mileage"
              name="mileage"
              type="text"
              value={newCar.mileage}
              onChange={(e) =>
                setNewCar({ ...newCar, mileage: e.target.value })
              }
              placeholder="Mileage"
              required
              className="w-full border border-rose-300 text-rose-800 rounded-md px-3 py-2"
            />
          </div>

          <div className="flex space-x-4 w-full">
            <input
              id="year"
              name="year"
              type="text"
              value={newCar.year}
              onChange={(e) => setNewCar({ ...newCar, year: e.target.value })}
              placeholder="Year"
              required
              className="w-full border border-rose-300 text-rose-800 rounded-md px-3 py-2"
            />

            <select
              id="carType"
              name="carType"
              value={newCar.carType}
              onChange={(e) =>
                setNewCar({ ...newCar, carType: e.target.value })
              }
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
            id="images"
            name="images"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
            className="w-full border border-rose-300 text-rose-200 rounded-md px-3 py-2"
            multiple
          />

          {imagePreviews.length > 0 && (
            <div className="flex space-x-4 mt-4">
              {imagePreviews.map((preview, index) => (
                <Image
                  key={index}
                  src={preview}
                  alt={`Preview ${index}`}
                  className="object-cover rounded-md"
                  width={96}
                  height={96}
                />
              ))}
            </div>
          )}

          {error && <p className="text-red-600">{error}</p>}

          <button
            type="submit"
            className={`w-full bg-rose-600 text-white px-4 py-2 rounded-md mt-4 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? (
              <AiOutlineLoading className="animate-spin inline-block" />
            ) : (
              "Add Car"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCarForm;
