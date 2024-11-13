"use client"

import { useState, useEffect } from "react";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";
import Image from "next/image";
import { navLinks, socialLinks } from "../constants/index";
import logo from "@/public/logo.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleScroll = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
    }
  };

  // Effect to toggle scroll-lock
  useEffect(() => {
    const body = document.body;
    menuOpen
      ? body.classList.add("overflow-hidden")
      : body.classList.remove("overflow-hidden");

    return () => {
      body.classList.remove("overflow-hidden");
    };
  }, [menuOpen]);

  return (
    <nav className="bg-black text-white fixed top-0 left-0 right-0 p-4 z-50">
      <div className="flex container mx-auto justify-between items-center">
        <Image
          src={logo}
          alt="logo"
          priority={true}
          className="w-[150px] md:w-[200px] cursor-pointer"
          onClick={() => handleScroll("hero")}
        />

        <button
          onClick={toggleMenu}
          className="text-white md:hidden z-10 focus:outline-none"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? (
            <RiCloseLine className="text-4xl" />
          ) : (
            <RiMenu3Line className="text-4xl" />
          )}
        </button>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-4">
          {navLinks.map(({ id, href, name }) => (
            <li key={id}>
              <button
                onClick={() => handleScroll(href)}
                className="text-xl hover:text-rose-600 transition-colors cursor-pointer"
              >
                {name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Full-Screen Mobile Menu */}
      <div
        className={`fixed inset-0 bg-black flex flex-col transition-transform duration-300 ease-in-out transform ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <div className="flex flex-col items-center justify-center flex-grow">
          <ul className="space-y-8 text-center">
            {navLinks.map(({ id, href, name }) => (
              <li key={id}>
                <button
                  onClick={() => handleScroll(href)}
                  className="text-3xl hover:text-rose-600 transition-colors ease-in-out duration-300 uppercase cursor-pointer"
                >
                  {name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Social Media Icons */}
        <div className="flex space-x-6 mb-4 justify-center">
          {socialLinks.map(({ id, href, icon }) => (
            <a key={id} href={href} target="_blank" rel="noopener noreferrer">
              {icon}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
