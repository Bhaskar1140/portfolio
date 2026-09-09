"use client";

import React, { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { assets } from "../Assets/assets/assets";

const Work = () => {
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(0);
  const [error, setError] = useState("");
  const carouselRef = useRef(null);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
    || (typeof window === "undefined"
      ? "http://localhost:8080"
      : `http://${window.location.hostname}:8080`);

  useEffect(() => {
    let retryTimer;
    let attempts = 0;
    let isMounted = true;

    const loadProjects = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/projects`);

        if (!response.ok) {
          throw new Error("Unable to load projects");
        }

        const data = await response.json();

        if (isMounted) {
          setProjects(data);
          setError("");
        }
      } catch {
        attempts += 1;

        if (attempts < 4 && isMounted) {
          retryTimer = setTimeout(loadProjects, 1500);
        } else if (isMounted) {
          setError("Projects are unavailable right now. Please try again shortly.");
        }
      }
    };

    loadProjects();

    return () => {
      isMounted = false;
      clearTimeout(retryTimer);
    };
  }, []);

  const scrollCarousel = (direction) => {
    carouselRef.current?.scrollBy({
      left: direction * carouselRef.current.clientWidth * 0.85,
      behavior: "smooth",
    });
  };

  const scrollToProject = (index) => {
    carouselRef.current?.children[index]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  };

  const updateActiveProject = () => {
    const carousel = carouselRef.current;
    const firstCard = carousel?.children[0];

    if (!carousel || !firstCard) {
      return;
    }

    const cardWidth = firstCard.getBoundingClientRect().width;
    const gap = Number.parseFloat(getComputedStyle(carousel).gap) || 0;
    const index = Math.round(carousel.scrollLeft / (cardWidth + gap));

    setActiveProject(Math.min(Math.max(index, 0), projects.length - 1));
  };

  return (
    <section
      id="Work"
      className="w-full scroll-mt-20 px-[6%] py-10 text-zinc-900 sm:px-[8%] lg:px-[12%] dark:text-white"
    >
      <h4 className="mb-2 text-center font-ovo text-lg text-gray-700 dark:text-gray-300">
        My Portfolio
      </h4>

      <h2 className="text-center font-ovo text-4xl text-zinc-900 sm:text-5xl dark:text-white">
        My latest Work
      </h2>

      <p className="mx-auto mt-5 mb-10 max-w-2xl text-center font-ovo text-sm leading-6 text-gray-600 sm:text-base sm:leading-7 dark:text-gray-300">
        Welcome to my Website Development Portfolio! Explore a collection of
        projects showcasing my expertise in full-stack development.
      </p>

      {error ? (
        <p className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-center text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
          {error}
        </p>
      ) : projects.length === 0 ? (
        <p className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
          Loading projects...
        </p>
      ) : (
        <div>
          <div className="mb-4 hidden justify-end gap-3 lg:flex">
            <button
              type="button"
              onClick={() => scrollCarousel(-1)}
              aria-label="Show previous projects"
              className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white p-3 text-gray-800 shadow-sm transition hover:bg-lime-300 dark:border-white/20 dark:bg-[#1a0029] dark:text-white"
            >
              <FaChevronLeft />
            </button>

            <button
              type="button"
              onClick={() => scrollCarousel(1)}
              aria-label="Show more projects"
              className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white p-3 text-gray-800 shadow-sm transition hover:bg-lime-300 dark:border-white/20 dark:bg-[#1a0029] dark:text-white"
            >
              <FaChevronRight />
            </button>
          </div>

          <div
            ref={carouselRef}
            onScroll={updateActiveProject}
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="Portfolio projects"
          >
            {projects.map((project) => (
              <article
                key={project.id}
                className="group relative min-h-[340px] min-w-[84%] snap-start overflow-hidden rounded-2xl bg-gray-200 shadow-md sm:min-w-[47%] lg:min-w-[31.5%] dark:bg-[#1a0029]"
                style={{
                  backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.78), rgba(0, 0, 0, 0.05)), url(${project.imageUrl})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
              >
                <div className="absolute right-0 bottom-0 left-0 p-5 text-white">
                  <p className="mb-1 text-xs font-medium tracking-[0.16em] text-lime-200 uppercase">
                    Featured project
                  </p>
                  <h3 className="text-xl font-semibold">{project.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-gray-200">
                    {project.description}
                  </p>

                  <div className="mt-5 flex gap-3">
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-lime-300"
                    >
                      View site
                      <img
                        src={assets.send_icon.src}
                        alt=""
                        aria-hidden="true"
                        className="w-4"
                      />
                    </a>

                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-full border border-white/70 px-4 py-2 text-sm font-medium transition hover:bg-white hover:text-zinc-900"
                    >
                      GitHub
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-1 flex justify-center gap-2" aria-label="Choose project">
            {projects.map((project, index) => (
              <button
                key={project.id}
                type="button"
                onClick={() => scrollToProject(index)}
                aria-label={`Show ${project.title}`}
                aria-current={activeProject === index ? "true" : undefined}
                className={`h-2.5 rounded-full transition-all ${
                  activeProject === index
                    ? "w-7 bg-lime-500"
                    : "w-2.5 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default Work;
