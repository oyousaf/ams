// components/ConfirmModal.jsx

"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-red-900 rounded-2xl p-6 max-w-md w-full shadow-xl relative text-center text-white"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{
              duration: 0.3,
              type: "spring",
              damping: 20,
              stiffness: 300,
            }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 hover:text-rose-200 transition"
              aria-label="Close Modal"
            >
              <FaTimes size={18} />
            </button>
            <h2 className="text-xl font-bold mb-2">
              {title || "Are you sure?"}
            </h2>
            <p className="mb-6 text-rose-300 text-sm leading-relaxed">
              {message || "This action cannot be undone."}
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={onConfirm}
                className="px-4 py-2 rounded-full bg-rose-700 text-white hover:bg-rose-800 transition font-semibold"
              >
                Yes, Delete
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-full bg-gray-300 text-rose-900 hover:bg-gray-400 transition font-semibold"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
