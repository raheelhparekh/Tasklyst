import { useEffect, useState } from "react";
import { useProjectStore } from "@/store/useProjectStore";

export const useProjectOperations = () => {
  const [search, setSearch] = useState("");
  
  const { 
    projects, 
    getAllProjects, 
    deleteProject, 
    isFetchingAllProjects, 
    isDeletingProject 
  } = useProjectStore();

  useEffect(() => {
    getAllProjects();
  }, [getAllProjects]);

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(search.toLowerCase())
  );

  return {
    search,
    setSearch,
    projects,
    filteredProjects,
    deleteProject,
    isFetchingAllProjects,
    isDeletingProject,
  };
};
