"use client";

import { useState, useEffect, useRef } from "react";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";
import Image from "next/image";
import { navLinks, socialLinks } from "../constants";
import logo from "@/public/logo.png";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const panelRef = useRef(null);
  const dragControls = useDragControls();
  const pathname = usePathname();

  const toggleMenu = () => setMenuOpen((p) => !p);
  const closeMenu = () => setMenuOpen(false);

  const handleScroll = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      closeMenu();
    }
  };

  /* Scroll lock */
  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  /* Route change auto-close */
  useEffect(() => {
    closeMenu();
  }, [pathname]);

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
    <nav className="bg-black text-white fixed top-0 inset-x-0 p-4 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="cursor-pointer"
          onClick={() => handleScroll("hero")}
        >
          <Image
            src={logo}
            alt="logo"
            priority
            className="w-30 sm:w-37.5 md:w-45"
          />
        </motion.div>

        {/* Desktop nav */}
        <ul className="hidden md:flex gap-6 lg:gap-10 items-center">
          {navLinks.map(({ id, href, name }, index) => (
            <motion.li
              key={id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -2 }}
              transition={{
                opacity: { duration: 0.25, ease: "easeOut" },
                y: { type: "spring", stiffness: 600, damping: 28 },
                delay: index * 0.08,
              }}
            >
              <button
                onClick={() => handleScroll(href)}
                className="relative text-lg md:text-xl font-bold uppercase tracking-wide text-white/90 hover:text-white transition
                  after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-rose-600 after:transition-all hover:after:w-full"
              >
                {name}
              </button>
            </motion.li>
          ))}
        </ul>

        {/* Desktop socials */}
        <div className="hidden md:flex gap-5 items-center">
          {socialLinks.map(({ id, href, icon, name }) => (
            <motion.a
              key={id}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={name}
              whileHover={{ y: -3 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="hover:text-rose-600"
            >
              {icon}
            </motion.a>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={toggleMenu}
          className="md:hidden z-60"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? (
            <RiCloseLine className="text-5xl text-rose-600" />
          ) : (
            <RiMenu3Line className="text-5xl text-rose-600" />
          )}
        </button>
      </div>

      {/* ===== MOBILE MENU ===== */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm md:hidden z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
            />

            {/* Panel */}
            <motion.div
              ref={panelRef}
              className="fixed inset-0 md:hidden z-50 flex flex-col bg-zinc-900/90"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              drag="x"
              dragControls={dragControls}
              dragListener={false}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => {
                if (info.offset.x > 120 || info.velocity.x > 600) closeMenu();
              }}
              transition={{ type: "spring", stiffness: 220, damping: 30 }}
            >
              <div
                className="flex flex-col items-center justify-center grow"
                onPointerDown={(e) => dragControls.start(e)}
              >
                <motion.ul
                  className="space-y-8 text-center"
                  initial="closed"
                  animate="open"
                  exit="closed"
                  variants={{
                    open: {
                      transition: {
                        staggerChildren: 0.08,
                        delayChildren: 0.15,
                      },
                    },
                    closed: {
                      transition: {
                        staggerChildren: 0.05,
                        staggerDirection: -1,
                      },
                    },
                  }}
                >
                  {navLinks.map(({ id, href, name }) => (
                    <motion.li
                      key={id}
                      variants={{
                        open: {
                          opacity: 1,
                          y: 0,
                          scale: 1,
                          transition: {
                            type: "spring",
                            stiffness: 600,
                            damping: 28,
                          },
                        },
                        closed: {
                          opacity: 0,
                          y: 24,
                          scale: 0.96,
                          transition: { duration: 0.15 },
                        },
                      }}
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
                </motion.ul>
              </div>

              {/* Mobile socials */}
              <motion.div
                className="flex gap-6 mb-20 justify-center"
                initial="closed"
                animate="open"
                exit="closed"
                variants={{
                  open: {
                    transition: {
                      staggerChildren: 0.04,
                      delayChildren: menuOpen ? 0.25 : 0,
                    },
                  },
                  closed: {
                    transition: {
                      staggerChildren: 0.03,
                      staggerDirection: -1,
                    },
                  },
                }}
              >
                {socialLinks.map(({ id, href, icon, name }) => (
                  <motion.a
                    key={id}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    className="text-white hover:text-rose-600"
                    variants={{
                      open: {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: {
                          type: "spring",
                          stiffness: 500,
                          damping: 26,
                        },
                      },
                      closed: {
                        opacity: 0,
                        y: 8,
                        scale: 0.96,
                        transition: { duration: 0.12 },
                      },
                    }}
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {icon}
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
