/* eslint-disable no-unused-vars */
"use client";
import React from "react";
import { motion } from "framer-motion";
import { BackgroundLines } from "@/components/ui/background-lines";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <>
      <BackgroundBeamsWithCollision>
        <h2 className="text-2xl relative z-20 md:text-4xl lg:text-7xl font-bold text-center text-black dark:text-white font-sans tracking-tight">
          Turn Chaos into Clarity with Smarter{" "}
          <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
            <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-purple-500 via-violet-500 to-pink-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">
              <span className="">Project Management</span>
            </div>
            <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">
              <span className="">Project Management</span>
            </div>
          </div>
        </h2>

        <Button
          size="lg"
          className="relative z-50 mt-8 bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold hover:brightness-110 transition"
          onClick={() => navigate("/projects")}
        >
          🚀 Try Tasklyst Now
        </Button>
      </BackgroundBeamsWithCollision>

      <BackgroundLines className="flex items-center justify-center w-full flex-col px-2">
        <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl md:text-4xl lg:text-7xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
          {" "}
          Check out
          <span className="ml-3 px-4 py-1 rounded-lg bg-violet-600 text-white">
            Kanban
          </span>
        </h2>
        <p className="max-w-xl mx-auto text-sm md:text-lg text-neutral-700 dark:text-neutral-400 text-center">
          Plan, track, and manage your projects effortlessly. From Kanban boards
          to collaborative notes, experience the all-in-one workspace designed
          to keep teams focused, aligned, and in control.
        </p>
        <div className="flex flex-wrap justify-center gap-2 mt-4 z-20 relative">
          <Badge
            variant="outline"
            className="text-violet-600 border-violet-500"
          >
            Kanban Boards
          </Badge>
          <Badge variant="outline" className="text-pink-600 border-pink-500">
            Real-time Collaboration
          </Badge>
          <Badge
            variant="outline"
            className="text-violet-600 border-violet-500"
          >
            Task Notes
          </Badge>
          <Badge variant="outline" className="text-pink-600 border-pink-500">
            Member Roles
          </Badge>
        </div>
      </BackgroundLines>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 1.2 }}
        className="relative z-10 mt-20 rounded-3xl border border-neutral-200 bg-neutral-100 p-4 shadow-md dark:border-neutral-800 dark:bg-neutral-900"
      >
        <div className="relative group w-full overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700">
          <img
            src="https://assets.aceternity.com/pro/aceternity-landing.webp"
            alt="Task Management Dashboard Preview"
            className="aspect-[16/9] h-auto w-full object-cover"
            height={1000}
            width={1000}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-70 group-hover:opacity-90 transition rounded-xl" />
        </div>
      </motion.div>
    </>
  );
}
