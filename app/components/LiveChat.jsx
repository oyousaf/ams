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

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 700);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openChat = () => {
    window.VisitorChat?.open?.();
  };

  return (
    <Script
      src="https://cdn.visitor.chat/vc-loader.min.js"
      strategy="afterInteractive"
      id="vcLoaderScript"
    />
  );
}
