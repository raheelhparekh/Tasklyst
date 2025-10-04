"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Assuming Card components are available from shadcn/ui
import { useNavigate } from "react-router-dom";

// Placeholder icons - replace with actual Lucide React or custom SVG icons if needed
const KanbanIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-8 w-8 text-violet-600"
  >
    <rect width="7" height="7" x="3" y="3" rx="1" />
    <rect width="7" height="7" x="14" y="3" rx="1" />
    <rect width="7" height="7" x="14" y="14" rx="1" />
    <rect width="7" height="7" x="3" y="14" rx="1" />
  </svg>
);

const TeamCollaborationIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-8 w-8 text-pink-600"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const AdvancedAnalyticsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-8 w-8 text-violet-600"
  >
    <path d="M3 3v18h18" />
    <path d="M18.7 8.3L12 15l-3.3-3.3L3 18" />
  </svg>
);

const LightningFastIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-8 w-8 text-pink-600"
  >
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

const EnterpriseSecurityIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-8 w-8 text-violet-600"
  >
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const TimeTrackingIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-8 w-8 text-pink-600"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export default function FeaturesSection() {
  const navigate = useNavigate();
  return (
    <div className="w-full py-20 px-4 bg-white dark:bg-black">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
          Everything you need to{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-700 to-pink-600">
            succeed
          </span>
        </h2>
        <p className="text-md md:text-lg text-neutral-700 dark:text-neutral-400 mb-12">
          Powerful features designed to streamline your workflow and boost
          team productivity.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature Card 1 */}
          <Card className="bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="flex flex-col items-start p-0">
              <KanbanIcon />
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mt-4 mb-2">
                Kanban Boards
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 text-left">
                Visualize your workflow with customizable boards that adapt to
                your team's process.
              </p>
            </CardContent>
          </Card>

          {/* Feature Card 2 */}
          <Card className="bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="flex flex-col items-start p-0">
              <TeamCollaborationIcon />
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mt-4 mb-2">
                Team Collaboration
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 text-left">
                Real-time updates, comments, and file sharing keep everyone in
                sync.
              </p>
            </CardContent>
          </Card>

          {/* Feature Card 3 */}
          <Card className="bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="flex flex-col items-start p-0">
              <AdvancedAnalyticsIcon />
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mt-4 mb-2">
                Advanced Analytics
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 text-left">
                Track progress, identify bottlenecks, and optimize your team's
                performance.
              </p>
            </CardContent>
          </Card>

          {/* Feature Card 4 */}
          <Card className="bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="flex flex-col items-start p-0">
              <LightningFastIcon />
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mt-4 mb-2">
                Lightning Fast
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 text-left">
                Built for speed with instant loading and real-time
                synchronization.
              </p>
            </CardContent>
          </Card>

          {/* Feature Card 5 */}
          <Card className="bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="flex flex-col items-start p-0">
              <EnterpriseSecurityIcon />
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mt-4 mb-2">
                Enterprise Security
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 text-left">
                Bank-grade security with SSL encryption and advanced access
                controls.
              </p>
            </CardContent>
          </Card>

          {/* Feature Card 6 */}
          <Card className="bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="flex flex-col items-start p-0">
              <TimeTrackingIcon />
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mt-4 mb-2">
                Time Tracking
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 text-left">
                Monitor time spent on tasks and generate detailed productivity
                reports.
              </p>
            </CardContent>
          </Card>
        </div>
        <Button
          size="lg"
          className="relative z-50 mt-12 bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold hover:brightness-110 transition"
          onClick={() => navigate("/features")} // Adjust navigation as needed
        >
          Explore All Features →
        </Button>
      </div>
    </div>
  );
}