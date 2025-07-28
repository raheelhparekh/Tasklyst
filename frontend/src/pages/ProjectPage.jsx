import React from "react";
import { DataTable } from "@/components/ui/DataTable.jsx";
import { useNavigate } from "react-router-dom";
import ProjectPageControls from "@/components/ProjectPageControls";
import { usePermissions } from "@/hooks/usePermissions";
import { useProjectOperations } from "@/hooks/project/useProjectOperations";
import { createProjectColumns } from "@/components/project/projectColumns";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function ProjectPage() {
  const navigate = useNavigate();
  const { canPerformAction } = usePermissions();
  
  const {
    search,
    setSearch,
    filteredProjects,
    deleteProject,
    isFetchingAllProjects,
    isDeletingProject,
  } = useProjectOperations();

  const columns = createProjectColumns(
    navigate, 
    canPerformAction, 
    deleteProject, 
    isDeletingProject
  );

  if (isFetchingAllProjects) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-muted-foreground">Loading projects...</p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Projects</h1>
            <p className="text-muted-foreground">
              Manage and organize your team projects
            </p>
          </div>
        </div>

        <ProjectPageControls search={search} setSearch={setSearch} />

        <div className="h-screen w-full rounded-md border">
          <DataTable
            columns={columns}
            data={filteredProjects}
            onRowClick={(row) => navigate(`/project/${row._id}/task`)}
          />
        </div>

        {filteredProjects.length === 0 && !isFetchingAllProjects && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {search ? "No projects match your search." : "No projects found. Create your first project to get started!"}
            </p>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
