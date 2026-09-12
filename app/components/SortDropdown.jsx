"use client";

import { useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useOutsideClick } from "@/lib/useOutsideClick";
import { useEscapeKey } from "@/lib/useEscapeKey";

const dropdownVariants = {
  hidden: { opacity: 0, y: -10, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.15 } },
};

const SortDropdown = ({ options, selected, onSelect, isOpen, onToggle }) => {
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useOutsideClick(dropdownRef, () => onToggle(false), isOpen);
  useEscapeKey(() => {
    onToggle(false);
    buttonRef.current?.focus();
  }, isOpen);

  return (
    <div className="relative" ref={dropdownRef}>
      <label htmlFor="sort-button" className="sr-only">
        Sort car listings
      </label>
      <button
        ref={buttonRef}
        id="sort-button"
        className="surface-primary w-64 rounded-full p-3 text-center text-base font-semibold text-white shadow-md transition-shadow hover:shadow-[0_0_20px_rgba(244,63,94,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
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
            className="surface-primary absolute z-50 mt-2 w-64 rounded-xl p-1.5"
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
                className={`cursor-pointer rounded-lg p-2 text-center transition-colors ${
                  selected === key
                    ? "bg-white/15 font-bold text-white"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
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
