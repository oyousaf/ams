"use client";

import { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";

const ScrollToTop = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 800);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    showButton && (
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className="fixed z-40 bottom-8 right-8 p-3 text-2xl text-white bg-rose-900 rounded-full shadow-lg 
        cursor-pointer hover:bg-rose-700 hover:tile-glow"
      >
        <FaArrowUp />
      </button>
    )
  );
};

export default ScrollToTop;
