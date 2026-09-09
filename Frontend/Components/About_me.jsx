"use client";

import React, { useRef, useEffect, useState } from "react";
import { infoList, toolsData } from "../Assets/assets/assets";

export default function FloatingInteractiveCat() {
  const catRef = useRef(null);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [catOffset, setCatOffset] = useState({ x: 0, y: 0 });
  const [isLicking, setIsLicking] = useState(false);

  const followPointer = (clientX, clientY) => {
    setMousePos({ x: clientX, y: clientY });
  };

  useEffect(() => {
    const handlePointerMove = (event) => {
      if (event.pointerType === "mouse") {
        followPointer(event.clientX, event.clientY);
      }
    };

    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  const updatePosition = () => {
    if (catRef.current) {
      const rect = catRef.current.getBoundingClientRect();

      setCatOffset({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }
  };

  useEffect(() => {
    updatePosition();

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);

    const timeout = setTimeout(updatePosition, 100);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    const idleInterval = setInterval(() => {
      const rand = Math.random();

      if (rand > 0.7 && !isLicking) {
        setIsLicking(true);

        setTimeout(() => {
          setIsLicking(false);
        }, 2000);
      }
    }, 3500);

    return () => clearInterval(idleInterval);
  }, [isLicking]);

  const deltaX = mousePos.x - catOffset.x;
  const deltaY = mousePos.y - catOffset.y;

  const distance =
    Math.sqrt(deltaX * deltaX + deltaY * deltaY) || 1;

  const maxHeadMove = 9;
  const maxEyeMove = 7;

  const headX =
    (deltaX / distance) *
    Math.min(Math.abs(deltaX) * 0.1, maxHeadMove);

  const headY =
    (deltaY / distance) *
    Math.min(Math.abs(deltaY) * 0.1, maxHeadMove);

  const eyeX =
    (deltaX / distance) *
    Math.min(Math.abs(deltaX) * 0.1, maxEyeMove);

  const eyeY =
    (deltaY / distance) *
    Math.min(Math.abs(deltaY) * 0.1, maxEyeMove);

  return (
    <section
      id="About-me"
      className="
        w-[95%]
        max-w-7xl
        mx-auto
        pt-20
        sm:pt-28
        pb-16
        sm:pb-20
        px-4
        text-zinc-900
        dark:text-white
      "
    >
      {/* Section Heading */}
      <div className="text-center mb-10 sm:mb-16">
        <p className="font-ovo text-sm text-gray-500 dark:text-gray-400 mb-2">
          Introduction
        </p>

        <h2 className="font-ovo text-4xl sm:text-5xl text-zinc-900 dark:text-white">
          About me
        </h2>
      </div>

      {/* Main Content */}
      <div className="grid items-start gap-12 lg:gap-16 lg:grid-cols-[380px_1fr]">

        {/* ================= CAT CONTAINER ================= */}

        <div
          onPointerDown={(event) =>
            followPointer(event.clientX, event.clientY)
          }
          onPointerMove={(event) => {
            if (event.pointerType !== "mouse") {
              followPointer(event.clientX, event.clientY);
            }
          }}
          className="
            relative mx-auto flex min-h-[290px] w-full max-w-[420px]
            touch-pan-y items-center justify-center overflow-hidden rounded-3xl
            bg-linear-to-br from-rose-50 via-violet-50 to-sky-50 shadow-sm
            sm:min-h-[370px] lg:mx-0 lg:min-h-[430px]
            dark:from-[#24102f] dark:via-[#171329] dark:to-[#101b2b]
          "
        >
          <div className="absolute inset-0 bg-white/25 dark:bg-black/20" />
          <div className="absolute -top-16 -right-12 h-40 w-40 rounded-full bg-pink-300/30 blur-3xl dark:bg-pink-500/10" />
          <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-sky-300/30 blur-3xl dark:bg-sky-500/10" />

          {/* Cat stage */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="scale-[0.76] sm:scale-110 lg:scale-125">

              <div
                ref={catRef}
                className="
                  relative
                  w-48
                  h-64
                  sm:w-56
                  sm:h-72
                  flex
                  flex-col
                  items-center
                  justify-end
                  pb-8
                  drop-shadow-xl
                  pointer-events-auto
                "
              >

                {/* Virtual Paw */}
                {/* <div className="absolute bottom-12 left-10 w-7 h-7 bg-[#20242e] rounded-full border border-[#303846] z-30 transition-all duration-500 ease-out flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-pink-300 rounded-full mt-1" />
                </div> */}

                {/* Tail */}
                {/* <div className="absolute bottom-10 right-8 h-16 w-12 rounded-r-full border-r-[14px] border-b-[14px] border-[#20242e] rotate-[-18deg]" /> */}

                {/* Body */}
                <div className="relative w-24 h-[88px] bg-[#20242e] rounded-b-[35px] rounded-t-[25px] flex justify-between px-3 pt-10 z-10">
                  <div className="w-6 h-7 bg-[#20242e] rounded-full border-t border-[#303846] self-end -mb-1" />

                  <div className="w-6 h-7 bg-[#20242e] rounded-full border-t border-[#303846] self-end -mb-1" />
                </div>

                {/* Head */}
                <div
                  style={{
                    transform: `translate(${headX}px, ${headY}px)`,
                  }}
                  className="absolute top-24 w-44 h-36 bg-[#20242e] rounded-[75px/65px] flex items-center justify-center px-4 z-20 transition-transform duration-75 ease-out"
                >

                  {/* Left Ear */}
                  <div
                    style={{
                      transform: `rotate(${-15 + headX * 0.01}deg)`,
                    }}
                    className="absolute -top-10 left-0 h-[88px] w-20 bg-[#20242e] [clip-path:polygon(50%_0,100%_100%,0_100%)] origin-bottom-right flex items-end justify-center pb-9"
                  >
                    <div className="h-10 w-5 bg-pink-600 [clip-path:polygon(50%_40%,100%_100%,0_100%)]" />
                  </div>

                  {/* Right Ear */}
                  <div
                    style={{
                      transform: `rotate(${15 + headX * 0.9}deg)`,
                    }}
                    className="absolute -top-10 right-0 h-[88px] w-20 bg-[#20242e] [clip-path:polygon(50%_0,100%_100%,0_100%)] origin-bottom-left flex items-end justify-center pb-9"
                  >
                    <div className="h-10 w-5 bg-pink-600 [clip-path:polygon(50%_40%,100%_100%,0_100%)]" />
                  </div>

                  {/* Eyes */}
                  <div className="w-full flex justify-between px-1 mt-2">

                    <div className="w-12 h-15 bg-[#f7f3df] rounded-[48%] flex items-center justify-center relative border-2 border-[#303846] overflow-hidden">
                      <div
                        style={{
                          transform: `translate(${eyeX}px, ${eyeY}px)`,
                        }}
                        className="w-9 h-11 bg-[#111215] rounded-[48%] absolute flex items-center justify-center transition-transform duration-75 ease-out"
                      >
                        <div className="w-2 h-2 bg-white rounded-full absolute top-2 left-2" />
                      </div>
                    </div>

                    <div className="w-12 h-15 bg-[#f7f3df] rounded-[48%] flex items-center justify-center relative border-2 border-[#303846] overflow-hidden">
                      <div
                        style={{
                          transform: `translate(${eyeX}px, ${eyeY}px)`,
                        }}
                        className="w-9 h-11 bg-[#111215] rounded-[48%] absolute flex items-center justify-center transition-transform duration-75 ease-out"
                      >
                        <div className="w-2 h-2 bg-white rounded-full absolute top-2 left-2" />
                      </div>
                    </div>

                  </div>

                  {/* Tongue */}
                  <div
                    style={{
                      transform: isLicking
                        ? "translateY(10px) scale(1)"
                        : "translateY(0px) scale(0)",
                    }}
                    className="absolute bottom-8 left-[44%] w-4 h-5 bg-pink-400 rounded-b-full border border-pink-500 z-40 transition-all duration-300 ease-out origin-top"
                  />

                  {/* Nose */}
                  <div className="absolute bottom-11 w-1.5 h-1 bg-gray-900 rounded-full" />

                  {/* Whiskers */}
                  <div className="absolute bottom-7 left-3 h-px w-9 -rotate-12 bg-[#3a4050]" />
                  <div className="absolute bottom-5 left-3 h-px w-9 rotate-6 bg-[#3a4050]" />
                  <div className="absolute bottom-7 right-3 h-px w-9 rotate-12 bg-[#3a4050]" />
                  <div className="absolute bottom-5 right-3 h-px w-9 -rotate-6 bg-[#3a4050]" />

                </div>
              </div>

            </div>
          </div>

          <p className="absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/50 bg-white/50 px-3 py-1 text-xs text-gray-600 backdrop-blur-sm dark:border-white/10 dark:bg-black/20 dark:text-gray-300">
            Move your cursor — or touch me
          </p>
        </div>

        {/* ================= TEXT CONTENT ================= */}

        <div className="lg:pt-4">

          <p className="font-ovo text-base leading-7 sm:leading-9 text-gray-600 dark:text-gray-300 mb-8">
            Aspiring Backend-Focused Full Stack Developer with hands-on
            experience building web applications using React.js, Node.js,
            Express.js, MongoDB, and JavaScript. Passionate about backend
            development, software engineering fundamentals, and problem solving
            through Data Structures & Algorithms. I enjoy building secure REST
            APIs, implementing authentication systems, and continuously learning
            modern technologies while working on real-world projects. I'm
            looking for an opportunity to grow, contribute, and learn from
            experienced engineers.
          </p>

          {/* Info Cards */}
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl">

            {infoList.map(
              ({ icon, iconDark, title, description }, index) => (
                <li
                  key={index}
                  className="
                    border-[0.5px]
                    border-gray-300
                    dark:border-gray-700
                    rounded-xl
                    p-6
                    cursor-pointer
                    bg-transparent
                    dark:bg-[#1a0029]
                    hover:bg-light-hover
                    dark:hover:bg-dark-hover
                    hover:-translate-y-1
                    duration-500
                    hover:shadow-black
                    dark:hover:shadow-white
                  "
                >
                  <img
                    src={icon.src}
                    alt={title}
                    className="w-7 mt-3"
                  />

                  <h3 className="my-4 font-semibold text-gray-700 dark:text-gray-200">
                    {title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 text-sm font-ovo">
                    {description}
                  </p>
                </li>
              )
            )}

          </ul>

          {/* Tools */}
          <h4 className="my-6 text-gray-700 dark:text-gray-300 font-ovo">
            Tools I Can Use
          </h4>

          {/* Tools */}
          <ul className="flex flex-wrap items-center gap-3 sm:gap-5">

            {toolsData.map((tool, index) => (
              <li
                key={index}
                className="
                  flex
                  items-center
                  justify-center
                  w-12
                  sm:w-14
                  aspect-square
                  border
                  border-gray-400
                  dark:border-gray-700
                  rounded-2xl
                  cursor-pointer
                  bg-transparent
                  dark:bg-[#1a0029]
                  hover:-translate-y-1
                  duration-500
                  hover:bg-light-hover
                  dark:hover:bg-dark-hover
                  hover:shadow-black
                  dark:hover:shadow-white
                "
              >
                <img
                  src={tool.src}
                  alt="Tool"
                  className="w-8 sm:w-7"
                />
              </li>
            ))}

          </ul>

        </div>
      </div>
    </section>
  );
}
