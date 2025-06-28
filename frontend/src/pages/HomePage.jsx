/* eslint-disable no-unused-vars */
"use client";
import React from "react";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <>
      <h1 className="relative z-10 mx-auto max-w-5xl text-center text-2xl font-bold text-slate-700 md:text-4xl lg:text-7xl dark:text-slate-300">
        {"Turn Chaos into Clarity with Smarter Project Management"
          .split(" ")
          .map((word, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.1,
                ease: "easeInOut",
              }}
              className="mr-2 inline-block"
            >
              {word}
            </motion.span>
          ))}
      </h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.8 }}
        className="relative z-10 mx-auto max-w-2xl py-4 text-center text-lg font-normal text-neutral-600 dark:text-neutral-400"
      >
        Plan, track, and manage your projects effortlessly. From Kanban boards to collaborative notes, experience the all-in-one workspace designed to keep teams focused, aligned, and in control.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 1 }}
        className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
      >
        <button className="w-60 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
          Get Started Free
        </button>
        <button className="w-60 transform rounded-lg border border-gray-300 bg-white px-6 py-2 font-medium text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-100 dark:border-gray-700 dark:bg-black dark:text-white dark:hover:bg-gray-900">
          Watch Demo
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 1.2 }}
        className="relative z-10 mt-20 rounded-3xl border border-neutral-200 bg-neutral-100 p-4 shadow-md dark:border-neutral-800 dark:bg-neutral-900"
      >
        <div className="w-full overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700">
          <img
            src="https://assets.aceternity.com/pro/aceternity-landing.webp"
            alt="Task Management Dashboard Preview"
            className="aspect-[16/9] h-auto w-full object-cover"
            height={1000}
            width={1000}
          />
        </div>
      </motion.div>
    </>
  );
}
