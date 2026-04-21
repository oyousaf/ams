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

  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "");
  }, [menuOpen]);

  useEffect(() => closeMenu(), [pathname]);

  return (
    <LayoutGroup>
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-7xl rounded-2xl bg-black border border-white/10 backdrop-blur-xl shadow-xl text-white">
        <div className="flex items-center justify-between px-4 py-3 sm:px-6">
          {/* LOGO */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            transition={springIcon}
            className="cursor-pointer"
            onClick={() => handleScroll("hero")}
          >
            <Image
              src={logo}
              alt="Ace Motor Sales"
              fetchPriority="low"
              decoding="async"
              draggable={false}
              sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, 176px"
              className="w-32 sm:w-40 md:w-44"
            />
          </motion.button>

          {/* DESKTOP NAV */}
          <ul className="hidden items-center gap-6 md:flex lg:gap-10">
            {navLinks.map(({ id, href, name }) => (
              <li key={id}>
                <motion.button
                  onClick={() => handleScroll(href)}
                  whileHover={{ y: -2 }}
                  className="relative text-lg md:text-xl font-bold uppercase tracking-wide text-white/90 hover:text-white group"
                >
                  {name}
                  <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-rose-600 transition-all duration-300 group-hover:w-full" />
                </motion.button>
              </li>
            ))}
          </ul>

          {/* MOBILE BUTTON */}
          <motion.button
            layoutId="mobile-menu-anchor"
            onClick={toggleMenu}
            className="md:hidden"
          >
            {menuOpen ? (
              <RiCloseLine className="text-4xl text-rose-600" />
            ) : (
              <RiMenu3Line className="text-4xl text-rose-600" />
            )}
          </motion.button>
        </div>
      </nav>

      {/* MOBILE MENU */}
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
              className="fixed inset-0 z-50 md:hidden flex items-center justify-center px-4"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={springMorph}
            >
              <motion.div className="relative w-full max-w-md rounded-3xl bg-zinc-900/95 border border-white/10 shadow-2xl px-6 pt-10 pb-12">
                <button
                  onClick={closeMenu}
                  className="absolute right-4 top-4 h-10 w-10 rounded-full grid place-items-center bg-rose-600/20"
                >
                  <RiCloseLine className="text-2xl text-rose-600" />
                </button>

                <ul className="mt-6 space-y-8 text-center">
                  {navLinks.map(({ id, href, name }) => (
                    <li key={id}>
                      <button
                        onClick={() => handleScroll(href)}
                        className="text-4xl font-bold uppercase text-white/90 hover:text-rose-600"
                      >
                        {name}
                      </button>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}
