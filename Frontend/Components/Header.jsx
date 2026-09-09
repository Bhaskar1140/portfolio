"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { assets } from "../Assets/assets/assets";

const technologies = [
  "Node.js",
  "React.js",
  "Express.js",
  "MongoDB",
  "Java",
  "Python",
  "SQL",
];

const Header = () => {
  const [techIndex, setTechIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTechIndex((current) => (current + 1) % technologies.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      id="Home"
      className="
        w-11/12
        max-w-3xl
        mx-auto
        min-h-170
        sm:min-h-screen
        flex
        flex-col
        items-center
        justify-center
        text-center
        gap-4
        px-2
        pt-24
        sm:pt-20
      "
    >
      {/* Profile Video */}
      <div className="h-40 w-40 sm:h-50 sm:w-50 overflow-hidden rounded-b-[99px]">
        <video
          autoPlay
          muted
          playsInline
          className="h-full w-full object-cover object-top"
        >
          <source src="/Bhaskar.webm" type="video/webm" />
        </video>
      </div>

      {/* Introduction */}
      <h3
        className="
          flex
          items-end
          justify-center
          gap-2
          text-lg
          sm:text-xl
          md:text-2xl
          mb-2
          sm:mb-3
          font-ovo
          text-zinc-900
          dark:text-white
        "
      >
        Hi! I'm Bhaskar More

        <Image
          className="w-5 sm:w-6"
          src={assets.hand_icon}
          alt=""
        />
      </h3>

      {/* Main Heading */}
      <h1
        className="
          text-3xl
          sm:text-6xl
          lg:text-[66px]
          font-ovo
          leading-tight
          text-zinc-900
          dark:text-white
        "
      >
        <span className="block sm:inline">
          FULL-STACK{" "}
        </span>

        <span className="block sm:inline-block h-[1.2em] text-pink-600">
          {technologies[techIndex]}
        </span>

        <span className="block sm:inline">
          {" "}DEVELOPER.
        </span>
      </h1>

      {/* Description */}
      <p
        className="
          max-w-2xl
          mx-auto
          px-2
          font-ovo
          text-sm
          sm:text-base
          leading-6
          sm:leading-7
          text-gray-700
          dark:text-gray-300
        "
      >
        I build secure, practical full-stack web applications with the MERN
        stack, JAVA stack, REST APIs, authentication, and AI integrations.
      </p>

      {/* Buttons */}
      <div
        className="
          flex
          flex-col
          sm:flex-row
          items-center
          gap-3
          sm:gap-4
          mt-3
          sm:mt-4
          w-full
          justify-center
        "
      >
        {/* Contact Button */}
        <a
          href="#Contact-me"
          className="
            px-8
            sm:px-10
            py-3
            border
            border-white
            rounded-full
            bg-black
            dark:bg-white
            dark:text-black
            text-white
            flex
            items-center
            justify-center
            gap-2
            w-45
            sm:w-auto
          "
        >
          contact me

          <Image
            src={assets.right_arrow_white}
            alt=""
            className="w-4 dark:invert"
          />
        </a>

        {/* Resume Button */}
        <a
          target="_blank"
          href="/Resume.Pdf"
          download
          className="
            px-8
            sm:px-10
            py-3
            border
            rounded-full
            border-gray-500
            dark:border-gray-400
            flex
            items-center
            justify-center
            gap-2
            w-45
            sm:w-auto
            text-zinc-900
            dark:text-white
          "
        >
          My Resume

          <Image
            src={assets.download_icon}
            alt=""
            className="w-4 dark:invert"
          />
        </a>
      </div>
    </div>
  );
};

export default Header;