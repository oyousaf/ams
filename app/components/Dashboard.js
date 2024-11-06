"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { ToastContainer, toast } from "react-toastify";
import { GoHomeFill } from "react-icons/go";
import Link from "next/link";
import AddCarForm from "./AddCarForm";
import CarList from "./CarList";
import { databases } from "../lib/appwrite";
import { SiPorsche } from "react-icons/si";

const LoadingIndicator = () => (
  <div className="flex justify-center items-center h-48">
    <SiPorsche className="text-4xl animate-spin" />
  </div>
);

const Tabs = ({ activeTab, setActiveTab }) => {
  const tabs = useMemo(
    () => [
      { id: "carList", label: "Current Cars" },
      { id: "addCar", label: "Add Car" },
    ],
    []
  );

  return (
    <div className="flex justify-center mt-6 space-x-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-4 py-2 rounded-md ${
            activeTab === tab.id
              ? "bg-rose-600 text-white font-semibold shadow-md"
              : "bg-rose-200 text-gray-700 hover:bg-rose-300 hover:text-gray-900 transition-colors duration-200"
          }`}
          aria-pressed={activeTab === tab.id}
          aria-controls={`panel-${tab.id}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

const Dashboard = () => {
  const [cars, setCars] = useState([]);
  const [activeTab, setActiveTab] = useState("carList");
  const [loadingCars, setLoadingCars] = useState(true);

  // Function to fetch cars from Appwrite
  const fetchCars = useCallback(async () => {
    setLoadingCars(true);
    try {
      const response = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID
      );
      setCars(response.documents);
    } catch (error) {
      console.error("Error fetching cars:", error);
      toast.error(
        "Could not load cars. Please check your connection and try again."
      );
    } finally {
      setLoadingCars(false);
    }
  }, []);

  // Function to handle car deletion
  const handleDeleteCar = useCallback(async (carId) => {
    try {
      await databases.deleteDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID,
        carId
      );
      setCars((prevCars) => prevCars.filter((car) => car.$id !== carId));
      toast.success("Car deleted successfully!");
    } catch (error) {
      console.error("Error deleting car:", error);
      toast.error("Failed to delete car. Please try again.");
    }
  }, []);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  return (
    <div className="p-4 w-full flex flex-col justify-between">
      <ToastContainer />
      <div className="flex flex-col items-center">
        <h2 className="text-5xl font-bold text-gray-200 text-center mb-4">
          Dashboard
        </h2>
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {activeTab === "carList" && (
        <div id="panel-carList" className="mt-6" role="tabpanel">
          {loadingCars ? (
            <LoadingIndicator />
          ) : (
            <CarList cars={cars} onDelete={handleDeleteCar} />
          )}
        </div>
      )}

      {activeTab === "addCar" && (
        <div id="panel-addCar" className="mt-6" role="tabpanel">
          <AddCarForm setCars={setCars} fetchCars={fetchCars} />
        </div>
      )}

      <div className="flex justify-center mt-4">
        <Link
          href="/"
          className="text-gray-200 hover:text-white"
          aria-label="Go to Home"
        >
          <GoHomeFill className="mr-2" size={40} />
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
