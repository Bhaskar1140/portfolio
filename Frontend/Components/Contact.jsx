"use client";

import React, { useState } from "react";
import { assets } from "../Assets/assets/assets";

const Contact = () => {
  const [result, setResult] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();

    setResult("Sending...");

    const formData = new FormData(event.target);

    formData.append(
      "access_key",
      "7c358e3d-28bf-460c-8860-e302314b9b4d"
    );

    try {
      const response = await fetch(
        "https://api.web3forms.com/submit",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {
        setResult("Form submitted successfully.");
        event.target.reset();
      } else {
        console.error("Web3Forms error:", data);
        setResult(data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Request failed:", error);
      setResult("Something went wrong. Please try again.");
    }
  };

  return (
    <div
      id="Contact-me"
      className="
        relative
        w-full
        px-[6%]
        sm:px-[8%]
        lg:px-[12%]
        py-16
        sm:py-20
        scroll-mt-20
        overflow-hidden
      "
    >
      {/* ================= GRADIENT BACKGROUND ================= */}

      <div
        className="
          absolute
          inset-0
          bg-[url('/footer-bg-color.png')]
          bg-no-repeat
          bg-center
          bg-cover
          dark:hidden
          pointer-events-none
        "
      />

      {/* ================= CONTENT ================= */}

      <div className="relative z-10">

        {/* Heading */}

        <h4
          className="
            text-center
            mb-2
            text-lg
            font-ovo
            text-gray-700
            dark:text-gray-300
          "
        >
          Contact me
        </h4>

        <h2
          className="
            text-center
            text-4xl
            sm:text-5xl
            font-ovo
            text-zinc-900
            dark:text-white
          "
        >
          Get in touch
        </h2>

        <p
          className="
            text-center
            max-w-2xl
            mx-auto
            mt-5
            mb-12
            font-ovo
            text-sm
            sm:text-base
            leading-6
            sm:leading-7
            text-gray-600
            dark:text-gray-300
          "
        >
          I'd love to hear from you. Whether you have a question, want to
          discuss a project, or just want to connect, feel free to reach out.
        </p>

        {/* ================= CONTACT FORM ================= */}

        <form
          onSubmit={onSubmit}
          className="max-w-2xl mx-auto"
          suppressHydrationWarning
        >

          {/* Name + Email */}

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              gap-6
              mt-10
              mb-8
            "
          >

            {/* Name */}

            <input
              className="
                w-full
                p-3
                outline-none
                border-[0.5px]
                border-gray-400
                dark:border-gray-600
                rounded-md
                bg-white
                dark:bg-[#1a0029]
                text-gray-900
                dark:text-white
                placeholder-gray-500
                dark:placeholder-gray-400
              "
              type="text"
              name="name"
              placeholder="Enter your Name"
              required
              suppressHydrationWarning
            />

            {/* Email */}

            <input
              className="
                w-full
                p-3
                outline-none
                border-[0.5px]
                border-gray-400
                dark:border-gray-600
                rounded-md
                bg-white
                dark:bg-[#1a0029]
                text-gray-900
                dark:text-white
                placeholder-gray-500
                dark:placeholder-gray-400
              "
              type="email"
              name="email"
              placeholder="Enter your Email"
              required
              suppressHydrationWarning
            />

          </div>

          {/* Message */}

          <textarea
            className="
              w-full
              p-3
              outline-none
              border-[0.5px]
              border-gray-400
              dark:border-gray-600
              rounded-md
              bg-white
              dark:bg-[#1a0029]
              text-gray-900
              dark:text-white
              placeholder-gray-500
              dark:placeholder-gray-400
            "
            rows="6"
            name="message"
            placeholder="Enter Your Message"
            required
            suppressHydrationWarning
          />

          {/* Submit Button */}

          <button
            type="submit"
            className="
              mt-6
              px-8
              py-3
              w-max
              flex
              items-center
              justify-between
              gap-2
              bg-black/80
              dark:bg-white
              text-white
              dark:text-black
              rounded-full
              mx-auto
              hover:bg-black
              dark:hover:bg-gray-200
              duration-500
            "
          >
            Submit

            <img
              src={assets.right_arrow_white.src}
              className="w-4 dark:invert"
              alt=""
            />
          </button>

          {/* Result Message */}

          <p
            className="
              mt-4
              text-center
              text-sm
              text-gray-600
              dark:text-gray-300
            "
          >
            {result}
          </p>

        </form>
      </div>
    </div>
  );
};

export default Contact;
