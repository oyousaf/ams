"use client";

import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const dropdownVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.12 } },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
  exit: { opacity: 0, y: -8, scale: 0.96, transition: { duration: 0.1 } },
};

const SortDropdown = ({ options, selected, onSelect, isOpen, onToggle }) => {
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onToggle(false);
      }
    };

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onToggle(false);
        buttonRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onToggle]);

  return (
    <div className="relative" ref={dropdownRef}>
      <label htmlFor="sort-button" className="sr-only">
        Sort car listings
      </label>
      <button
        ref={buttonRef}
        id="sort-button"
        className="w-64 bg-gradient-to-br from-rose-900 via-rose-800 to-rose-950 text-white text-lg font-semibold rounded-lg p-3 shadow-md text-center"
        onClick={() => onToggle((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls="sort-options"
      >
        Sort By: {options.find((opt) => opt.key === selected)?.label}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            id="sort-options"
            role="listbox"
            aria-activedescendant={`option-${selected}`}
            className="absolute w-64 mt-2 border border-rose-700 bg-rose-800 rounded-lg shadow-lg z-50"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={dropdownVariants}
          >
            {options.map(({ key, label }) => (
              <li
                id={`option-${key}`}
                key={key}
                role="option"
                aria-selected={selected === key}
                onClick={() => onSelect(key)}
                className={`p-2 cursor-pointer hover:bg-rose-100 hover:text-rose-700 rounded-md text-center ${
                  selected === key
                    ? "font-bold text-white bg-rose-700 bg-opacity-50 glow-pulse"
                    : ""
                }`}
              >
                {label}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SortDropdown;
