"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { FiMessageCircle } from "react-icons/fi";

export default function LiveChat() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof window !== "undefined" && window.VisitorChat) {
        setReady(true);
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const openChat = () => {
    if (typeof window !== "undefined" && window.VisitorChat) {
      window.VisitorChat.open();
    }
  };

  return (
    <>
      {/* Visitor.chat loader */}
      <Script
        src="https://cdn.visitor.chat/vc-loader.min.js"
        strategy="afterInteractive"
        id="vcLoaderScript"
      />

      {/* Chat bubble */}
      <button
        onClick={openChat}
        aria-label="Open live chat"
        className={`
          fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full flex items-center justify-center text-white surface-primary
          border border-white/10 backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-110
          hover:shadow-[0_0_25px_rgba(244,63,94,0.45)]
          ${ready ? "animate-pulseRing" : ""}
        `}
      >
        <FiMessageCircle size={26} />
      </button>
    </>
  );
}
