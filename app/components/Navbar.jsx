"use client";

import { useState, useEffect, useRef } from "react";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";
import Image from "next/image";
import { navLinks, socialLinks } from "../constants";
import logo from "public/logo.png";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { usePathname } from "next/navigation";

const springNav = { type: "spring", stiffness: 600, damping: 28 };
const springIcon = { type: "spring", stiffness: 500, damping: 30 };
const springMorph = { type: "spring", stiffness: 420, damping: 34 };

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const panelRef = useRef(null);
  const pathname = usePathname();

  const toggleMenu = () => setMenuOpen((p) => !p);
  const closeMenu = () => setMenuOpen(false);

  const handleScroll = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth" });
    closeMenu();
  };

  /* Scroll lock */
  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "");
  }, [menuOpen]);

  /* Route change close */
  useEffect(() => closeMenu(), [pathname]);

  /* Escape close */
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => e.key === "Escape" && closeMenu();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  /* Focus trap */
  useEffect(() => {
    if (!menuOpen || !panelRef.current) return;

    const focusables = panelRef.current.querySelectorAll(
      'button, a, [tabindex]:not([tabindex="-1"])',
    );
    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    first.focus();

    const trap = (e) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", trap);
    return () => document.removeEventListener("keydown", trap);
  }, [menuOpen]);

  return (
    <LayoutGroup>
      {/* ================= FLOATING NAV ================= */}
      <nav
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-7xl
          rounded-2xl bg-black border border-white/10 backdrop-blur-xl shadow-xl
          text-white"
      >
        <div className="flex items-center justify-between px-4 py-3 sm:px-6">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={springIcon}
            className="cursor-pointer"
            onClick={() => handleScroll("hero")}
          >
            <Image
              src={logo}
              alt="Ace Motor Sales"
              priority
              draggable={false}
              className="w-32 sm:w-40 md:w-44"
            />
          </motion.div>

          {/* Desktop nav */}
          <ul className="hidden items-center gap-6 md:flex lg:gap-10">
            {navLinks.map(({ id, href, name }, i) => (
              <motion.li
                key={id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2 }}
                transition={{ ...springNav, delay: i * 0.08 }}
              >
                <button
                  onClick={() => handleScroll(href)}
                  className="relative text-lg md:text-xl font-bold uppercase tracking-wide cursor-pointer
                    text-white/90 hover:text-white after:absolute after:left-0 after:-bottom-1
                    after:h-0.5 after:w-0 after:bg-rose-600 after:transition-all hover:after:w-full"
                >
                  {name}
                </button>
              </motion.li>
            ))}
          </ul>

          {/* Desktop socials */}
          <div className="hidden items-center gap-5 md:flex">
            {socialLinks.map(({ id, href, icon, name }) => (
              <motion.a
                key={id}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                whileHover={{ y: -3 }}
                transition={springIcon}
                className="hover:text-rose-600"
              >
                {icon}
              </motion.a>
            ))}
          </div>

          {/* Mobile toggle */}
          <motion.button
            layoutId="mobile-menu-anchor"
            onClick={toggleMenu}
            className="md:hidden"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? (
              <RiCloseLine className="text-5xl text-rose-600" />
            ) : (
              <RiMenu3Line className="text-5xl text-rose-600" />
            )}
          </motion.button>
        </div>
      </nav>

      {/* ================= MOBILE MENU ================= */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
            />

            {/* Morphing panel */}
            <motion.div
              layoutId="mobile-menu-anchor"
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              className="fixed inset-0 z-50 md:hidden flex items-center justify-center px-4"
              transition={springMorph}
            >
              <div
                className="relative w-full max-w-md rounded-3xl bg-zinc-900/95 border border-white/10
                  shadow-2xl px-6 pt-10 pb-12"
              >
                {/* Close */}
                <button
                  onClick={closeMenu}
                  aria-label="Close menu"
                  className="absolute right-4 top-4 h-10 w-10 rounded-full grid place-items-center
                    bg-rose-600/20 hover:bg-rose-600/30
                  "
                >
                  <RiCloseLine className="text-2xl text-rose-600" />
                </button>

                {/* Links */}
                <ul className="mt-6 space-y-8 text-center">
                  {navLinks.map(({ id, href, name }) => (
                    <motion.li
                      key={id}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 24 }}
                      transition={springNav}
                      whileHover={{ y: -2 }}
                    >
                      <button
                        onClick={() => handleScroll(href)}
                        className="text-4xl font-bold uppercase text-white/90 hover:text-rose-600 transition"
                      >
                        {name}
                      </button>
                    </motion.li>
                  ))}
                </ul>

                {/* Socials */}
                <div className="mt-25 flex justify-center gap-6">
                  {socialLinks.map(({ id, href, icon, name }) => (
                    <motion.a
                      key={id}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={name}
                      className="text-white hover:text-rose-600 transition"
                      whileHover={{ scale: 1.12 }}
                      whileTap={{ scale: 0.95 }}
                      transition={springIcon}
                    >
                      {icon}
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}
