"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Dashboard from "./Dashboard";
import { IoIosReturnRight } from "react-icons/io";

const DashboardWrapper = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");

  const handlePasskeySubmit = (e) => {
    e.preventDefault();
    if (passkey === process.env.NEXT_PUBLIC_DASHBOARD_PASSKEY) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect passkey. Please try again.");
    }
  };

  useEffect(() => {
    // Disable scrolling when the dashboard or passkey form is shown
    if (isAuthenticated || passkey) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    // Cleanup when component unmounts or the state changes
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isAuthenticated, passkey]);

  return (
    <div className="h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-rose-900 rounded-lg shadow-lg w-auto max-w-7xl p-8 flex flex-col items-center"
      >
        {isAuthenticated ? (
          <Dashboard />
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
              <IoIosReturnRight className="text-bold" size={30} />
            </motion.button>
          </motion.form>
        )}
      </motion.div>
    </div>
  );
};

export default DashboardWrapper;
