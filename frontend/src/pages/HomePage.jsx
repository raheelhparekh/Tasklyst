/* eslint-disable no-unused-vars */
"use client";
import React from "react";
import { motion } from "framer-motion";
import { BackgroundLines } from "@/components/ui/background-lines";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import KanbanSection from "@/components/sections/KanbanSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import CallToActionSection from "@/components/sections/CallToActionSection";

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <>
      {/* First section - existing code */}
      <BackgroundBeamsWithCollision>
        <h2 className="text-2xl relative z-20 md:text-4xl lg:text-7xl font-bold text-center text-black dark:text-white font-sans tracking-tight">
          Turn Chaos into Clarity with Smarter{" "}
          <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
            <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-purple-500 via-violet-800 to-pink-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">
              <span className="">Project Management</span>
            </div>
            <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-800 to-pink-500 py-4">
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

      <KanbanSection />
      <FeaturesSection />
      <CallToActionSection />
    </>
  );
}
