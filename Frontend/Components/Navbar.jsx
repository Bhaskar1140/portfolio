"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { assets, letters } from "../Assets/assets/assets";

const Navbar = () => {
  const [isScroll, setIsScroll] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // default false, synced in useEffect below

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScroll(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Prevent the page from scrolling while mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;

      if (newMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }

      return newMode;
    });
  };

  return (
    <>
      {/* Header background */}
      <div className="fixed top-0 right-0 -z-10 w-11/12 translate-y-[-80%] dark:hidden">
        <Image
          src={assets.header_bg_color}
          alt=""
          loading="eager"
          className="w-full"
        />
      </div>

      {/* NAVBAR */}
      <nav
        className={`fixed top-0 left-0 w-full px-5 lg:px-8 xl:px-[8%] py-4 flex items-center justify-between z-[100] transition-all duration-300 ${
          isScroll
            ? "bg-white/70 dark:bg-[#11001f]/80 backdrop-blur-lg shadow-sm"
            : "bg-transparent"
        }`}
      >
        {/* LOGO */}
        <a
          href="#Home"
          className="flex items-end justify-center text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white no-underline"
        >
          {letters.map((letter, index) => (
            <span
              key={`${letter}-${index}`}
              className={`animate-letter-bounce inline-block ${
                letter === "."
                  ? "text-pink-600"
                  : "text-zinc-900 dark:text-white"
              }`}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {letter}
            </span>
          ))}
        </a>

        {/* DESKTOP MENU */}
        <ul
          className={`hidden md:flex items-center gap-6 lg:gap-8 rounded-full px-12 py-3 ${
            isScroll
              ? ""
              : "bg-white/50 dark:bg-[#11001f]/50 shadow-sm"
          }`}
        >
          <li>
            <a
              className="font-ovo text-zinc-900 dark:text-white"
              href="#Home"
            >
              Home
            </a>
          </li>

          <li>
            <a
              className="font-ovo text-zinc-900 dark:text-white"
              href="#About-me"
            >
              About me
            </a>
          </li>

          <li>
            <a
              className="font-ovo text-zinc-900 dark:text-white"
              href="#Work"
            >
              Projects
            </a>
          </li>

          <li>
            <a
              className="font-ovo text-zinc-900 dark:text-white"
              href="#Contact-me"
            >
              Contact me
            </a>
          </li>
        </ul>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3 sm:gap-4 relative z-110">
          {/* DARK MODE */}
          <button
            type="button"
            onClick={toggleDarkMode}
            className="cursor-pointer"
          >
            <Image
              src={isDarkMode ? assets.sun_icon : assets.moon_icon}
              alt={isDarkMode ? "Light mode" : "Dark mode"}
              className="w-5 sm:w-6"
            />
          </button>

          {/* DESKTOP CONTACT */}
          <a
            className="hidden lg:flex items-center gap-3 px-10 py-2.5 border border-gray-500 dark:border-gray-400 font-ovo rounded-full ml-4 text-zinc-900 dark:text-white"
            href="#Contact-me"
          >
            Contact

            <Image
              src={assets.arrow_icon}
              alt=""
              className="w-3 dark:invert"
            />
          </a>

          {/* MOBILE HAMBURGER */}
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(true)}
            className="flex md:hidden items-center justify-center ml-2 cursor-pointer relative z-[120] pointer-events-auto"
          >
            <Image
              src={assets.menu_black}
              alt="Menu"
              className="w-6 h-6 dark:invert"
            />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU BACKDROP */}
      <div
        onClick={closeMenu}
        className={`fixed inset-0 bg-black/10 dark:bg-black/40 z-[150] md:hidden transition-opacity duration-300 ${
          isMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* MOBILE SIDE MENU */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-64 h-screen bg-rose-50 dark:bg-[#1a0029] text-zinc-900 dark:text-white z-[200] md:hidden transform transition-transform duration-500 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* CLOSE BUTTON */}
        <button
          type="button"
          onClick={closeMenu}
          aria-label="Close menu"
          className="absolute top-5 right-5 z-[9999] p-2 cursor-pointer"
        >
          <Image
            src={assets.close_black}
            alt="Close menu"
            className="w-6 h-6 dark:invert"
          />
        </button>

        {/* MOBILE LINKS */}
        <ul className="flex flex-col gap-6 pt-24 px-10">
          <li>
            <a
              href="#Home"
              onClick={closeMenu}
              className="font-ovo text-zinc-900 dark:text-white"
            >
              Home
            </a>
          </li>

          <li>
            <a
              href="#About-me"
              onClick={closeMenu}
              className="font-ovo text-zinc-900 dark:text-white"
            >
              About me
            </a>
          </li>

          <li>
            <a
              href="#Work"
              onClick={closeMenu}
              className="font-ovo text-zinc-900 dark:text-white"
            >
              Projects
            </a>
          </li>

          <li>
            <a
              href="#Contact-me"
              onClick={closeMenu}
              className="font-ovo text-zinc-900 dark:text-white"
            >
              Contact me
            </a>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
