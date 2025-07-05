"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useParams } from "react-router-dom";
import { Plus, X } from "lucide-react";
import CreateNewTask from "@/components/CreateNewTask";
import { useProjectStore } from "@/store/useProjectStore";
import { useEffect, useState } from "react";
import { Drawer } from "./ui/drawer";

export default function ProjectSidebar({
  onClose,
  setActiveTab,
  activeTab,
  members,
}) {
  const { id } = useParams();
  const { getProjectById, project } = useProjectStore();
  const [projectName, setProjectName] = useState("Loading...");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      await getProjectById(id);
    };

    fetchProject();
  }, [id]);

  useEffect(() => {
    if (project && project.name) {
      setProjectName(project.name);
    }
  }, [project]);

  return (
    <div className="w-64 h-full border-r border-gray-200 dark:border-gray-800 bg-background p-4 flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">{projectName}</h2>
        <div className="flex items-center gap-2">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(true)}
              >
                <Plus size={18} />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a new Task?</DialogTitle>
                <DialogDescription>
                  Fill in the details to add a new task to this project.
                </DialogDescription>
              </DialogHeader>
              <CreateNewTask
                members={members}
                onClose={() => setIsOpen(false)}
              />
            </DialogContent>
          </Dialog>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X size={18} />
            </Button>
          )}
        </div>
      </div>

      <Separator className="my-4" />

      {/* Sections */}
      <SidebarSection
        title="To Do"
        value="todo"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <SidebarSection
        title="In Progress"
        value="in_progress"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <SidebarSection
        title="Completed"
        value="completed"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <SidebarSection
        title="Members"
        value="members"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <SidebarSection
        title="Notes"
        value="notes"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}

function SidebarSection({ title, value, activeTab, setActiveTab }) {
  const isActive = activeTab === value;
  return (
    <Collapsible className="mt-2">
      <CollapsibleTrigger asChild>
        <Button
          variant={isActive ? "secondary" : "ghost"}
          className="w-full justify-start font-medium"
          onClick={() => setActiveTab(value)}
        >
          {title}
        </Button>
      </CollapsibleTrigger>
    </Collapsible>
  );
}
