"use client";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Assuming Card components are available from shadcn/ui
import { BackgroundLines } from "@/components/ui/background-lines";



export default function KanbanSection() {
  return (
    <BackgroundLines className="flex items-center justify-center w-full flex-col px-4 py-20 bg-white dark:bg-black">
      <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl md:text-4xl lg:text-7xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
        {" "}
        Check out
        <span className="ml-3 px-4 py-1 rounded-lg bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 text-white">
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

      {/* Kanban Board Columns */}
      <div className="mt-16 w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        {/* To Do Column */}
        <Card className="bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              <span className="inline-flex items-center">
                <svg
                  xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)"
                  className="h-4 w-4 mr-1 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                To Do
              </span>
            </CardTitle>
            <span className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
              0
            </span>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-neutral-500 dark:text-neutral-600">
              No tasks yet.
            </p>
          </CardContent>
        </Card>

        {/* In Progress Column */}
        <Card className="bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              <span className="inline-flex items-center">
                <svg
                  xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)"
                  className="h-4 w-4 mr-1 text-yellow-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                In Progress
              </span>
            </CardTitle>
            <span className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
              0
            </span>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-neutral-500 dark:text-neutral-600">
              No tasks in progress.
            </p>
          </CardContent>
        </Card>

        {/* Completed Column */}
        <Card className="bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              <span className="inline-flex items-center">
                <svg
                  xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)"
                  className="h-4 w-4 mr-1 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Completed
              </span>
            </CardTitle>
            <span className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
              3
            </span>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Task 1 */}
            <div className="bg-white dark:bg-neutral-950 p-3 rounded-md border border-gray-100 dark:border-neutral-800 shadow-sm">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">
                  Design Homepage
                </h4>
                <Badge className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
                  high
                </Badge>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2">
                Create wireframes and mockups for the new homepage
              </p>
              <div className="flex justify-between items-center text-xs text-neutral-500 dark:text-neutral-500">
                <span className="flex items-center">
                  <svg
                    xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)"
                    className="h-3 w-3 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Sarah
                </span>
                <span className="flex items-center">
                  <svg
                    xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)"
                    className="h-3 w-3 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  2024-02-15
                </span>
              </div>
            </div>
            {/* Task 2 */}
            <div className="bg-white dark:bg-neutral-950 p-3 rounded-md border border-gray-100 dark:border-neutral-800 shadow-sm">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">
                  API Integration
                </h4>
                <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
                  medium
                </Badge>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2">
                Connect frontend with backend authentication
              </p>
              <div className="flex justify-between items-center text-xs text-neutral-500 dark:text-neutral-500">
                <span className="flex items-center">
                  <svg
                    xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)"
                    className="h-3 w-3 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Mike
                </span>
                <span className="flex items-center">
                  <svg
                    xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)"
                    className="h-3 w-3 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  2024-02-20
                </span>
              </div>
            </div>
            {/* Task 3 */}
            <div className="bg-white dark:bg-neutral-950 p-3 rounded-md border border-gray-100 dark:border-neutral-800 shadow-sm">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">
                  User Testing
                </h4>
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                  low
                </Badge>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2">
                Conduct usability study with 10 participants
              </p>
              <div className="flex justify-between items-center text-xs text-neutral-500 dark:text-neutral-500">
                <span className="flex items-center">
                  <svg
                    xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)"
                    className="h-3 w-3 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Emma
                </span>
                <span className="flex items-center">
                  <svg
                    xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)"
                    className="h-3 w-3 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  2024-02-10
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </BackgroundLines>
  );
}