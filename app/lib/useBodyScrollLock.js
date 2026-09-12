"use client";

import { useEffect } from "react";

// Locks background scroll while `active` is true. Plain `overflow: hidden`
// on the body doesn't reliably block touch scrolling on iOS Safari and lets
// the page content jump sideways when the scrollbar disappears - this pins
// the body in place (preserving scroll position) and pads for the lost
// scrollbar width, then restores everything exactly on release.
export function useBodyScrollLock(active) {
  useEffect(() => {
    if (!active) return;

    const { body } = document;
    const scrollY = window.scrollY;
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

    const original = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
    };

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";
    if (scrollBarWidth > 0) {
      body.style.paddingRight = `${scrollBarWidth}px`;
    }

    return () => {
      body.style.position = original.position;
      body.style.top = original.top;
      body.style.left = original.left;
      body.style.right = original.right;
      body.style.width = original.width;
      body.style.overflow = original.overflow;
      body.style.paddingRight = original.paddingRight;
      // Explicit "instant" - the site sets scroll-smooth globally for anchor
      // nav, which would otherwise animate this restore into a visible,
      // janky re-scroll instead of snapping back where the user was.
      window.scrollTo({ top: scrollY, left: 0, behavior: "instant" });
    };
  }, [active]);
}
