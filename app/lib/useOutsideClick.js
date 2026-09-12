"use client";

import { useEffect } from "react";

// Calls onOutside when a pointerdown occurs outside `ref.current`. Only
// listens while `active` is true, so nothing is attached when the
// menu/modal/panel it guards is closed.
export function useOutsideClick(ref, onOutside, active = true) {
  useEffect(() => {
    if (!active) return;

    const handlePointerDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onOutside(e);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [ref, onOutside, active]);
}
