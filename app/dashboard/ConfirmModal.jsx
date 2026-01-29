"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { FaTimes } from "react-icons/fa";

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-2000 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-md rounded-2xl bg-rose-900/95 border border-rose-700/50
              shadow-2xl p-6 text-center text-white"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {/* Close */}
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="absolute top-4 right-4 text-rose-300 hover:text-white transition"
            >
              <FaTimes size={16} />
            </button>

            {/* Title */}
            <h2 className="text-xl font-bold mb-2">
              {title || "Confirm action"}
            </h2>

            {/* Message */}
            <p className="mb-6 text-sm leading-relaxed text-rose-200">
              {message || "This action cannot be undone."}
            </p>

            {/* Actions */}
            <div className="flex justify-center gap-4">
              <button
                onClick={onConfirm}
                className="
                  px-5 py-2 rounded-full bg-rose-700 text-white font-semibold hover:bg-rose-800 transition"
              >
                Confirm
              </button>

              <button
                onClick={onClose}
                className="px-5 py-2 rounded-full bg-white/80 text-rose-900 font-semibold hover:bg-white transition"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default ConfirmModal;
