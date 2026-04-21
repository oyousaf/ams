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

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  exit: { transition: { staggerChildren: 0.06, staggerDirection: -1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 28, scale: 0.96 },
};

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
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-7xl rounded-2xl bg-black border border-white/10 backdrop-blur-xl shadow-xl text-white">
        <div className="flex items-center justify-between px-4 py-3 sm:px-6">
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

          <ul className="hidden items-center gap-6 md:flex lg:gap-10">
            {navLinks.map(({ id, href, name }) => (
              <li key={id}>
                <motion.button
                  onClick={() => handleScroll(href)}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="relative text-lg md:text-xl font-bold cursor-pointer uppercase tracking-wide text-white/90 hover:text-white group"
                >
                  {name}

                  <span className="pointer-events-none absolute left-0 -bottom-1 h-0.5 w-0 bg-rose-600 transition-all duration-300 group-hover:w-full" />
                </motion.button>
              </li>
            ))}
          </ul>

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
            <motion.div
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
            />

            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              className="fixed inset-0 z-50 md:hidden flex items-center justify-center px-4"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={springMorph}
            >
              <motion.div
                layoutId="mobile-menu-anchor"
                className="relative w-full max-w-md rounded-3xl bg-zinc-900/95 border border-white/10 shadow-2xl px-6 pt-10 pb-12"
              >
                <button
                  onClick={closeMenu}
                  aria-label="Close menu"
                  className="absolute right-4 top-4 h-10 w-10 rounded-full grid place-items-center bg-rose-600/20 hover:bg-rose-600/30"
                >
                  <RiCloseLine className="text-2xl text-rose-600" />
                </button>

                {/* Nav links */}
                <motion.ul
                  className="mt-6 space-y-8 text-center"
                  variants={listVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                >
                  {navLinks.map(({ id, href, name }) => (
                    <motion.li
                      key={id}
                      variants={itemVariants}
                      transition={springNav}
                    >
                      <button
                        onClick={() => handleScroll(href)}
                        className="text-4xl font-bold uppercase text-white/90 hover:text-rose-600"
                      >
                        {name}
                      </button>
                    </motion.li>
                  ))}
                </motion.ul>

                {/* Socials */}
                <motion.div
                  className="mt-16 flex justify-center gap-6"
                  variants={listVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                >
                  {socialLinks.map(({ id, href, icon, name }) => (
                    <motion.a
                      key={id}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={name}
                      variants={itemVariants}
                      transition={springIcon}
                      className="text-white hover:text-rose-600"
                      whileHover={{ scale: 1.12 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {icon}
                    </motion.a>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}
