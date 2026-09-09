import React from "react";
import { assets, letters } from "../Assets/assets/assets";

const Footer = () => {
  return (
    <footer className="w-full px-[6%] sm:px-[8%] lg:px-[12%] py-8">

      {/* Logo */}
      <a
        href="#Home"
        className="
          flex
          items-end
          justify-center
          text-2xl
          sm:text-3xl
          lg:text-4xl
          font-extrabold
          tracking-tight
          text-zinc-900
          no-underline
        "
      >
        {letters.map((letter, index) => (
          <span
            key={`${letter}-${index}`}
            className={`animate-letter-bounce inline-block ${
              letter === "." ? "text-pink-600" : "text-zinc-900"
            }`}
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            {letter}
          </span>
        ))}
      </a>

      {/* Email */}
      <div className="flex items-center justify-center gap-2 mt-4 text-sm sm:text-base">
        <img
          src={assets.mail_icon.src}
          className="w-5 sm:w-6 shrink-0"
          alt="Email"
        />

        <a
          href="mailto:bhaskarmore310@gmail.com"
          className="break-all"
        >
          bhaskarmore310@gmail.com
        </a>
      </div>

      {/* Bottom section */}
      <div
        className="
          border-t
          border-gray-400
          mx-[3%]
          sm:mx-[10%]
          mt-10
          sm:mt-12
          py-6
          flex
          flex-col
          sm:flex-row
          items-center
          justify-between
          gap-4
          text-center
        "
      >
        <p className="text-sm sm:text-base">
          © 2026 Bhaskar. All rights reserved.
        </p>

        <ul className="flex items-center justify-center gap-6 sm:gap-10">
          <li>
            <a
              href="YOUR_GITHUB_URL"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm sm:text-base hover:text-pink-600 transition-colors"
            >
              GitHub
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;