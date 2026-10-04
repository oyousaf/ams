"use client";

import { useState, useEffect, useRef } from "react";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";
import Image from "next/image";
import Link from "next/link";
import { navLinks, socialLinks } from "../constants";
import logo from "public/logo.png";
import { motion, AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";
import { useEscapeKey } from "@/lib/useEscapeKey";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";

const springNav = { type: "spring", stiffness: 600, damping: 28 };
const springIcon = { type: "spring", stiffness: 500, damping: 30 };
const springPanel = { type: "spring", stiffness: 320, damping: 32, mass: 0.8 };

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

const focusRing =
  "rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black";

// Smooth-scrolls to an in-page section and moves keyboard/screen-reader focus
// there too (what a native #hash jump would do), and keeps the URL shareable.
function scrollToSection(target) {
  target.scrollIntoView({ behavior: "smooth" });
  if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
  history.replaceState(null, "", `#${target.id}`);
}

function SocialLink({ href, icon, name, external, className, ...motionProps }) {
  return (
    <motion.a
      href={href}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      aria-label={external ? `${name} (opens in a new tab)` : name}
      className={`${className} ${focusRing}`}
      {...motionProps}
    >
      {icon}
    </motion.a>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pendingScrollId, setPendingScrollId] = useState(null);
  const panelRef = useRef(null);
  const toggleRef = useRef(null);
  const pathname = usePathname();

  const toggleMenu = () => setMenuOpen((p) => !p);
  const closeMenu = () => setMenuOpen(false);

  // Links are real hrefs ("/#cars") so they work without JS, from other pages
  // and for crawlers. On the homepage we intercept them for smooth scrolling.
  const handleNavClick = (e, id) => {
    const target = document.getElementById(id);
    if (!target) {
      closeMenu();
      return; // Not on this page - let Link navigate to /#id.
    }

    e.preventDefault();

    if (menuOpen) {
      // Closing the mobile menu releases the body scroll-lock, which
      // restores whatever scroll position was captured when the menu
      // opened - if we scroll first, that restore immediately cancels it.
      // Defer the scroll until after the close/unlock has actually
      // committed (see the pendingScrollId effect below).
      setPendingScrollId(id);
      closeMenu();
      return;
    }

    scrollToSection(target);
  };

  const handleLogoClick = (e) => {
    if (pathname !== "/") return;
    e.preventDefault();
    closeMenu();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* Scroll lock */
  useBodyScrollLock(menuOpen);

  /* Run a scroll deferred by handleNavClick once the menu has actually closed */
  useEffect(() => {
    if (menuOpen || pendingScrollId === null) return;
    const target = document.getElementById(pendingScrollId);
    if (target) scrollToSection(target);
    // Clearing a one-shot flag after consuming it - same class of pattern as
    // the route-change-close effect below, just flagged by the strict rule.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPendingScrollId(null);
  }, [menuOpen, pendingScrollId]);

  /* Route change close */
  useEffect(() => {
    // Resetting UI state when a prop/derived value (pathname) changes -
    // the React-docs-endorsed pattern, flagged by the newer strict lint rule.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    closeMenu();
  }, [pathname]);

  /* Escape close - return focus to the toggle that opened the menu */
  useEscapeKey(() => {
    closeMenu();
    toggleRef.current?.focus();
  }, menuOpen);

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
    <>
      {/* ================= FLOATING NAV ================= */}
      <nav
        aria-label="Main"
        className="fixed top-4 left-1/2 -translate-x-1/2 z-60 w-[calc(100%-2rem)] max-w-7xl rounded-2xl bg-black border border-white/10 backdrop-blur-xl shadow-xl text-white"
      >
        <div className="flex items-center justify-between px-4 py-3 sm:px-6">
          <motion.div whileHover={{ scale: 1.05 }} transition={springIcon}>
            <Link
              href="/"
              onClick={handleLogoClick}
              className={`block ${focusRing}`}
            >
              <Image
                src={logo}
                alt="Ace Motor Sales - home"
                priority
                draggable={false}
                className="w-32 sm:w-40 md:w-44"
              />
            </Link>
          </motion.div>

          <ul className="hidden items-center gap-6 md:flex lg:gap-10">
            {navLinks.map(({ id, href, name }) => (
              <li key={id}>
                <motion.div
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  <Link
                    href={`/#${href}`}
                    onClick={(e) => handleNavClick(e, href)}
                    className={`relative inline-block text-lg md:text-xl font-bold uppercase tracking-wide text-white/90 hover:text-white group ${focusRing}`}
                  >
                    {name}

                    <span className="pointer-events-none absolute left-0 -bottom-1 h-0.5 w-0 bg-rose-600 transition-all duration-300 group-hover:w-full" />
                  </Link>
                </motion.div>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-5 md:flex">
            {socialLinks.map(({ id, ...link }) => (
              <SocialLink
                key={id}
                {...link}
                whileHover={{ y: -3 }}
                transition={springIcon}
                className="hover:text-rose-600"
              />
            ))}
          </div>

          <motion.button
            ref={toggleRef}
            type="button"
            onClick={toggleMenu}
            className={`md:hidden ${focusRing}`}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? (
              <RiCloseLine className="text-5xl text-rose-600" aria-hidden="true" />
            ) : (
              <RiMenu3Line className="text-5xl text-rose-600" aria-hidden="true" />
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
              id="mobile-menu"
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              className="fixed inset-0 z-50 md:hidden flex items-start justify-center px-4 pt-24"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                initial={{ opacity: 0, y: -28, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.94 }}
                transition={springPanel}
                className="relative w-full max-w-md origin-top rounded-3xl bg-zinc-900/95 border border-white/10 shadow-2xl px-6 pt-10 pb-12"
              >
                {/* Nav links */}
                <nav aria-label="Mobile">
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
                        <Link
                          href={`/#${href}`}
                          onClick={(e) => handleNavClick(e, href)}
                          className={`text-4xl font-bold uppercase text-white/90 hover:text-rose-600 ${focusRing}`}
                        >
                          {name}
                        </Link>
                      </motion.li>
                    ))}
                  </motion.ul>
                </nav>

                {/* Socials */}
                <motion.div
                  className="mt-16 flex justify-center gap-6"
                  variants={listVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                >
                  {socialLinks.map(({ id, ...link }) => (
                    <SocialLink
                      key={id}
                      {...link}
                      variants={itemVariants}
                      transition={springIcon}
                      className="text-white hover:text-rose-600"
                      whileHover={{ scale: 1.12 }}
                      whileTap={{ scale: 0.95 }}
                    />
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
