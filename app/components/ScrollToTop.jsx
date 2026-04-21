"use client";

import { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function ScrollToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, y: 40, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.8 }}
          transition={{ duration: 0.25 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
          className={`
            fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full flex items-center justify-center  text-white
            surface-primary border border-white/10 backdrop-blur-md shadow-lg transition-all duration-300
            hover:scale-110 hover:shadow-[0_0_25px_rgba(244,63,94,0.45)]
          `}
        >
          <FaArrowUp size={25} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
