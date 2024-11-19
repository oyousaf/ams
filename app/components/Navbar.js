"use client";

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
    <nav className="bg-black text-white fixed top-0 left-0 right-0 p-4 z-50 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div
          className="cursor-pointer"
          onClick={() => handleScroll("hero")}
        >
          <Image
            src={logo}
            alt="logo"
            priority={true}
            className="w-[120px] sm:w-[150px] md:w-[200px]"
          />
        </div>

        {/* Desktop & Tablet Menu */}
        <ul className="hidden md:flex space-x-6 lg:space-x-8">
          {navLinks.map(({ id, href, name }) => (
            <li key={id}>
              <button
                onClick={() => handleScroll(href)}
                className="text-xl lg:text-2xl hover:text-rose-600 transition-colors duration-300 ease-in-out cursor-pointer"
              >
                {name}
              </button>
            </li>
          ))}
        </ul>

        {/* Social Media Icons (Desktop & Tablet) */}
        <div className="hidden md:flex space-x-4 lg:space-x-6">
          {socialLinks.map(({ id, href, icon }) => (
            <a
              key={id}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-rose-600 transition-colors duration-300 ease-in-out"
            >
              {icon}
            </a>
          ))}
        </div>

        {/* Mobile Menu Button */}
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
      </div>

      {/* Mobile Full-Screen Menu */}
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
                  className="text-3xl hover:text-rose-600 transition-colors duration-300 ease-in-out uppercase cursor-pointer"
                >
                  {name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Social Media Icons (Mobile) */}
        <div className="flex space-x-6 mb-4 justify-center">
          {socialLinks.map(({ id, href, icon }) => (
            <a
              key={id}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-rose-600 transition-colors duration-300 ease-in-out"
            >
              {icon}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
