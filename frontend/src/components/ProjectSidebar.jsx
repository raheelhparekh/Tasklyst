// components/ProjectSidebar.jsx
"use client";

import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function ProjectSidebar({ projects }) {
  const [openProjectId, setOpenProjectId] = useState(null);

  return (
    <aside className="w-64 h-screen overflow-y-auto border-r px-4 py-6 space-y-4 bg-white dark:bg-neutral-900">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Projects</h2>
      <Separator />
      {projects.map((project) => {
        const isOpen = openProjectId === project.id;

        return (
          <Collapsible
            key={project._id}
            open={isOpen}
            onOpenChange={() => setOpenProjectId(isOpen ? null : project.id)}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between text-left font-medium"
              >
                {project.name}
                {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="ml-4 mt-2 space-y-2">
              <Button variant="ghost" className="w-full justify-start text-sm">
                To Do
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm">
                Completed
              </Button>
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </aside>
  );
}
