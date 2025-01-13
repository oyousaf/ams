"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ToastContainer, toast } from "react-toastify";
import { GoHomeFill } from "react-icons/go";
import { IoIosReturnRight } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

import AddCarForm from "./AddCarForm";
import CarList from "./CarList";
import { databases, storage } from "../lib/appwrite";

import LoadingSpinner from "./LoadingSpinner";

/* eslint-disable react/display-name */
const Tabs = React.memo(({ activeTab, setActiveTab }) => {
  const tabs = useMemo(
    () => [
      { id: "carList", label: "Current Cars" },
      { id: "addCar", label: "Add Car" },
    ],
    []
  );
  /* eslint-enable react/display-name */

  return (
    <div className="flex justify-center mt-6 space-x-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-4 py-2 rounded-md transition-colors duration-200 ${
            activeTab === tab.id
              ? "bg-rose-600 text-white font-semibold shadow-md"
              : "bg-rose-200 text-gray-700 hover:bg-rose-300 hover:text-gray-900"
          }`}
          aria-pressed={activeTab === tab.id}
          aria-controls={`panel-${tab.id}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
});

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");
  const [cars, setCars] = useState([]);
  const [activeTab, setActiveTab] = useState("carList");
  const [loadingCars, setLoadingCars] = useState(true);

  const handlePasskeySubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (passkey === process.env.NEXT_PUBLIC_DASHBOARD_PASSKEY) {
        setIsAuthenticated(true);
        setError("");
      } else {
        setError("Incorrect passkey. Please try again.");
      }
    },
    [passkey]
  );

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

  const handleDeleteCar = useCallback(async (carId, carTitle, imageFileIds) => {
    if (!window.confirm(`Are you sure you want to delete ${carTitle}?`)) return;

    try {
      // Delete images from Appwrite storage first
      if (imageFileIds && imageFileIds.length > 0) {
        for (const imageFileId of imageFileIds) {
          await storage.deleteFile(
            process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
            imageFileId
          );
        }
      }

      // Now delete the car document from the database
      await databases.deleteDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID,
        carId
      );

      // Update the local state to reflect the deletion
      setCars((prevCars) => prevCars.filter((car) => car.$id !== carId));
      toast.success("Car deleted successfully!");
    } catch (error) {
      console.error("Error deleting car:", error);
      toast.error("Failed to delete car. Please try again.");
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCars();
    }
  }, [fetchCars, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [isAuthenticated]);

  return (
    <div className="h-screen flex items-center justify-center p-6">
      <ToastContainer />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-rose-900 rounded-lg shadow-lg w-auto max-w-7xl p-8 flex flex-col items-center"
      >
        {isAuthenticated ? (
          <div className="fixed inset-0 p-4 w-full flex flex-col justify-between bg-rose-800 text-gray-200 z-50">
            <div className="flex flex-col items-center">
              <h2 className="text-5xl font-bold text-gray-200 text-center mb-2">
                Dashboard
              </h2>
              <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
            <div className="flex-grow mt-6 overflow-auto scrollbar-none">
              <AnimatePresence mode="wait">
                {activeTab === "carList" && (
                  <motion.div
                    key="carList"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                    role="tabpanel"
                    id="panel-carList"
                  >
                    {loadingCars ? (
                      <LoadingSpinner />
                    ) : (
                      <CarList cars={cars} onDelete={handleDeleteCar} />
                    )}
                  </motion.div>
                )}
                {activeTab === "addCar" && (
                  <motion.div
                    key="addCar"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                    role="tabpanel"
                    id="panel-addCar"
                  >
                    <AddCarForm
                      setCars={setCars}
                      fetchCars={fetchCars}
                      setActiveTab={setActiveTab}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="flex justify-center mt-4">
              <Link href="/" aria-label="Go to Home">
                <motion.div
                  className="text-gray-200 hover:text-white"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9, rotate: -10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <GoHomeFill className="mr-2" size={40} />
                </motion.div>
              </Link>
            </div>
          </div>
        ) : (
          <motion.form
            onSubmit={handlePasskeySubmit}
            className="space-y-6 md:w-[50%] w-full flex flex-col items-center"
            name="passkey-form"
            id="passkey-form"
            autoComplete="off"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.input
              type="password"
              name="passkey"
              id="passkey"
              value={passkey}
              maxLength={5}
              onChange={(e) => setPasskey(e.target.value)}
              placeholder="Enter Passkey"
              className="w-auto px-4 py-2 border text-rose-800 border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-rose-600"
              autoComplete="current-password"
              animate={{ x: error ? [-10, 10, -10, 10, 0] : 0 }}
              transition={{ duration: 0.3 }}
            />
            {error && <p className="text-white text-sm text-center">{error}</p>}
            <motion.button
              type="submit"
              className="w-auto bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <IoIosReturnRight size={30} />
            </motion.button>
          </motion.form>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
