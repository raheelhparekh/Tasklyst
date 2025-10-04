"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function CallToActionSection() {
  const navigate = useNavigate();
  return (
    <div className="w-full py-20 px-4 bg-gradient-to-br from-purple-700 via-violet-500 to-pink-600 text-white text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4">
          Ready to transform your workflow?
        </h2>
        <p className="text-md md:text-lg mb-8 opacity-90">
          Join thousands of teams who have revolutionized their project
          management. Start your free trial today.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
          <Button
            size="lg"
            className="bg-white text-violet-700 hover:bg-gray-100 font-semibold shadow-md hover:shadow-lg transition"
            onClick={() => navigate("/signup")} // Adjust navigation as needed
          >
            Start Free Trial →
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white text-violet-700 hover:bg-white hover:text-violet-700 font-semibold shadow-md hover:shadow-lg transition"
            onClick={() => navigate("/demo")} // Adjust navigation as needed
          >
            Schedule Demo
          </Button>
        </div>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm opacity-80">
          <span className="flex items-center">
            <svg
              xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            14-day free trial
          </span>
          <span className="flex items-center">
            <svg
              xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            No credit card required
          </span>
          <span className="flex items-center">
            <svg
              xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            Cancel anytime
          </span>
        </div>
      </div>
    </div>
  );
}