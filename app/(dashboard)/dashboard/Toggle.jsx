"use client";

import { motion } from "framer-motion";
import React from "react";

export default function Toggle({ checked, onChange, color = "bg-yellow-400" }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      className={`w-10 h-6 rounded-full cursor-pointer relative transition duration-300 ${
        checked ? color : "bg-gray-500"
      }`}
    >
      <motion.div
        className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow"
        initial={false}
        animate={{ x: checked ? 20 : 2 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
    </div>
  );
}
