"use client";

import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SortDropdownDashboard({
  options,
  selected,
  onSelect,
  isOpen,
  onToggle,
}) {
  const rootRef = useRef(null);

  /* Close on outside click / ESC */
  useEffect(() => {
    if (!isOpen) return;

    const onClick = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        onToggle(false);
      }
    };

    const onEsc = (e) => {
      if (e.key === "Escape") onToggle(false);
    };

    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onEsc);

    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [isOpen, onToggle]);

  return (
    /* 🔒 Own stacking context, higher than everything by default */
    <div
      ref={rootRef}
      className="
        relative
        z-[100]
        isolate
        w-full
      "
    >
      {/* Trigger */}
      <button
        type="button"
        onClick={() => onToggle((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="
          h-11 w-full rounded-lg
          bg-transparent text-white font-semibold
          border border-white/10
          hover:border-rose-400/40
          transition
        "
      >
        Sort by: {options.find((o) => o.key === selected)?.label}
      </button>

      {/* Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="
              absolute left-0 top-[calc(100%+8px)]
              w-full
              z-[110]
              rounded-xl
              bg-rose-900/95 backdrop-blur
              border border-rose-700/50
              shadow-xl
              p-1
            "
          >
            {options.map(({ key, label }) => (
              <li
                key={key}
                role="option"
                aria-selected={selected === key}
                onClick={() => {
                  onSelect(key);
                  onToggle(false);
                }}
                className={`
                  cursor-pointer rounded-lg px-3 py-2 text-center transition
                  ${
                    selected === key
                      ? "bg-rose-700/60 text-white font-semibold"
                      : "text-rose-100 hover:bg-rose-700/30"
                  }
                `}
              >
                {label}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
