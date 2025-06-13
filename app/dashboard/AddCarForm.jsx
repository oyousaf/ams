"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { databases } from "../lib/appwrite";
import LoadingSpinner from "./LoadingSpinner";

const AddCarForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    mileage: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await databases.createDocument("carsDB", "carCollection", "unique()", {
        ...formData,
        price: parseFloat(formData.price),
        mileage: parseInt(formData.mileage),
      });

      toast.success("Car added successfully!");
      setFormData({
        title: "",
        description: "",
        price: "",
        mileage: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to add car. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gradient-to-br from-rose-800 via-rose-700 to-rose-900 p-6 rounded-xl text-white shadow-lg space-y-4 max-w-xl mx-auto mt-10"
    >
      <input
        type="text"
        name="title"
        placeholder="Car Title"
        value={formData.title}
        onChange={handleChange}
        className="w-full px-4 py-2 rounded text-black"
        required
      />
      <textarea
        name="description"
        placeholder="Car Description"
        value={formData.description}
        onChange={handleChange}
        className="w-full px-4 py-2 rounded text-black"
        required
      />
      <input
        type="number"
        name="price"
        placeholder="Price (£)"
        value={formData.price}
        onChange={handleChange}
        className="w-full px-4 py-2 rounded text-black"
        required
      />
      <input
        type="number"
        name="mileage"
        placeholder="Mileage"
        value={formData.mileage}
        onChange={handleChange}
        className="w-full px-4 py-2 rounded text-black"
        required
      />

      <button
        type="submit"
        className="w-full bg-rose-600 hover:bg-rose-700 transition py-2 rounded font-semibold"
        disabled={loading}
      >
        {loading ? <LoadingSpinner /> : "Add Car"}
      </button>
    </form>
  );
};

export default AddCarForm;
