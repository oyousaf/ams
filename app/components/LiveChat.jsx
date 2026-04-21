"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { FiMessageCircle } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function LiveChat() {
  const [ready, setReady] = useState(false);
  const [show, setShow] = useState(false);

  // Detect chat readiness
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.VisitorChat) {
        setReady(true);
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Match scroll behaviour
  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 600);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openChat = () => {
    window.VisitorChat?.open?.();
  };

  return (
    <>
      <Script
        src="https://cdn.visitor.chat/vc-loader.min.js"
        strategy="afterInteractive"
        id="vcLoaderScript"
      />

      <AnimatePresence>
        {show && (
          <motion.button
            initial={{ opacity: 0, y: 40, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.8 }}
            transition={{ duration: 0.25 }}
            onClick={openChat}
            aria-label="Open live chat"
            className={`
                fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full flex items-center justify-center text-white surface-primary
              border border-white/10 backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-110
              hover:shadow-[0_0_25px_rgba(244,63,94,0.45)] ${ready ? "animate-pulseRing" : ""}
            `} 
          >
            <FiMessageCircle size={25} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
