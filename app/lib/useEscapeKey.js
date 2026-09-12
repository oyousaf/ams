"use client";

import { useEffect } from "react";

// Calls onEscape when Escape is pressed. Only listens while `active` is
// true, so nothing is attached when the menu/modal/panel it guards is closed.
export function useEscapeKey(onEscape, active = true) {
  useEffect(() => {
    if (!active) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onEscape(e);
    };

    document.addEventListener("keydown", handleKeyDown, true);
    return () =>
      document.removeEventListener("keydown", handleKeyDown, true);
  }, [onEscape, active]);
}
