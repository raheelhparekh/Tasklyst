import ProjectSidebar from "@/components/ProjectSidebar";
import { useProjectStore } from "@/store/useProjectStore";
import React, { useEffect } from "react";

function TaskPage() {
  const { projects, getAllProjects } = useProjectStore();

  useEffect(() => {
    getAllProjects();
  }, []);

  return (
    <div className="flex">
      <ProjectSidebar projects={projects} />
      <main className="flex-1 p-6">
        {/* Render tasks based on selection */}
      </main>
    </div>
  );
}

export default TaskPage;
