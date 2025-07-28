import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";

export const useProjectStore = create((set) => ({
  projects: [],
  project: null,
  members: [],
  isFetchingAllProjects: false,
  isFetchingProjectById: false,
  isCreatingProject: false,
  isUpdatingProject: false,
  isDeletingProject: false,
  isFetchingMembers: false,
  isAddingMember: false,
  isUpdatingMemberRole: false,
  isDeletingMember: false,

  getAllProjects: async () => {
    try {
      set({ isFetchingAllProjects: true });

      // Step 1: Fetch all projects
      const res = await axiosInstance.get("/project/");
      const projects = res.data.data;

      console.log("getAllProjects response", projects);

      // Step 2: Fetch members count for each project in parallel
      const projectsWithMemberCounts = await Promise.all(
        projects.map(async (project) => {
          try {
            const countRes = await axiosInstance.get(
              `/project/get-all-members/${project._id}`,
            );
            return {
              ...project,
              members: countRes.data.data || 0,
            };
          } catch (error) {
            console.error(
              `Error fetching members for project ${project._id}:`,
              error,
            );
            return {
              ...project,
              members: 0,
            };
          }
        }),
      );

      // Step 3: Set updated projects in state
      set({ projects: projectsWithMemberCounts });

      // toast.success(res.data.message || "All Projects fetched successfully");
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to fetch all projects");
      set({ projects: [] });
    } finally {
      set({ isFetchingAllProjects: false });
    }
  },

  getProjectById: async (id) => {
    try {
      set({ isFetchingProjectById: true });
      const res = await axiosInstance.get(`/project/${id}`);
      console.log("getProjectById response", res.data.data);
      set({ project: res.data.data });
      // toast.success(res.data.message || "Project fetched successfully");
    } catch (error) {
      console.error("Error fetching project by id:", error);
      toast.error("Failed to fetch project by id");
      set({ project: null });
    } finally {
      set({ isFetchingProjectById: false });
    }
  },

  createProject: async (data) => {
    try {
      set({ isCreatingProject: true });

      const res = await axiosInstance.post("/project/create-project", data);
      const newProject = res.data.data;

      // Fetch members count
      try {
        const countRes = await axiosInstance.get(
          `/project/get-all-members/${newProject._id}`,
        );
        
        const newProjectWithMembers = {
          ...newProject,
          members: countRes.data.data || 1, // Creator is automatically added as member
        };

        // Add to state
        set((state) => ({
          projects: [...state.projects, newProjectWithMembers],
        }));
      } catch (memberError) {
        console.error("Error fetching members count for new project:", memberError);
        // Still add the project but with default member count
        const newProjectWithMembers = {
          ...newProject,
          members: 1, // Creator is automatically added as member
        };
        
        set((state) => ({
          projects: [...state.projects, newProjectWithMembers],
        }));
      }

      toast.success(res.data.message || "Project created successfully");
    } catch (error) {
      console.error("Error creating project:", error);
      const errorMessage = error.response?.data?.message || "Failed to create project";
      toast.error(errorMessage);
    } finally {
      set({ isCreatingProject: false });
    }
  },

  //TODO: pending
  updateProject: async (id, data) => {
    try {
      set({ isUpdatingProject: true });
      const res = await axiosInstance.put(
        `/project/update-project/${id}`,
        data,
      );
      console.log("updateProject response", res.data.data);
      
      const updatedProject = res.data.data;
      
      set((state) => ({
        projects: state.projects.map((project) =>
          project._id === id ? { ...project, ...updatedProject } : project,
        ),
        project: state.project && state.project._id === id ? updatedProject : state.project,
      }));
      toast.success(res.data.message || "Project updated successfully");
    } catch (error) {
      console.error("Error updating project:", error);
      const errorMessage = error.response?.data?.message || "Failed to update project";
      toast.error(errorMessage);
    } finally {
      set({ isUpdatingProject: false });
    }
  },

  deleteProject: async (id) => {
    try {
      set({ isDeletingProject: true });
      const res = await axiosInstance.delete(`/project/delete-project/${id}`);
      console.log("deleteProject response", res.data.data);

      set((state) => ({
        projects: state.projects.filter((project) => project._id !== id),
        project: state.project && state.project._id === id ? null : state.project,
      }));
      toast.success(res.data.message || "Project deleted successfully");
    } catch (error) {
      console.error("Error deleting project:", error);
      const errorMessage = error.response?.data?.message || "Failed to delete project";
      toast.error(errorMessage);
    } finally {
      set({ isDeletingProject: false });
    }
  },

  getAllMembersDetails: async (id) => {
    try {
      set({ isFetchingMembers: true });
      const res = await axiosInstance.get(
        `/project/get-all-members-details/${id}`,
      );
      console.log("getAllMembersDetails response", res.data.data);

      // Assuming the response contains an array of member details
      set({ members: res.data.data || [] });
      // toast.success(res.data.message || "Members details fetched successfully");
    } catch (error) {
      console.error("Error fetching members details:", error);
      const errorMessage = error.response?.data?.message || "Failed to fetch members details";
      toast.error(errorMessage);
      set({ members: [] });
    } finally {
      set({ isFetchingMembers: false });
    }
  },

  changeMemberRole: async (memberId, role) => {
    try {
      set({ isUpdatingMemberRole: true });
      const res = await axiosInstance.put(
        `/project/update-member-role/${memberId}`,
        { role },
      );
      console.log("changeMemberRole response", res.data.data);
      toast.success(res.data.message || "Member role changed successfully");
      // Update the member in the state
      set((state) => ({
        members: state.members.map((member) =>
          member._id === memberId
            ? { ...member, role: res.data.data.role }
            : member,
        ),
      }));
    } catch (error) {
      console.error("Error changing member role:", error);
      const errorMessage = error.response?.data?.message || "Failed to change member role";
      toast.error(errorMessage);
    } finally {
      set({ isUpdatingMemberRole: false });
    }
  },
  deleteProjectMember: async (memberId) => {
    try {
      set({ isDeletingMember: true });
      const res = await axiosInstance.delete(
        `/project/delete-member/${memberId}`,
      );
      console.log("deleteProjectMember response", res.data.data);
      toast.success(res.data.message || "Project member deleted successfully");
      
      // Remove the member from the state and update project member count
      set((state) => {
        const updatedMembers = state.members.filter((member) => member._id !== memberId);
        const deletedMember = state.members.find((member) => member._id === memberId);
        
        // If we know which project this member belonged to, update the count
        const updatedProjects = deletedMember ? state.projects.map((project) => 
          project._id === deletedMember.project 
            ? { ...project, members: Math.max(0, project.members - 1) }
            : project
        ) : state.projects;
        
        return {
          members: updatedMembers,
          projects: updatedProjects,
        };
      });
    } catch (error) {
      console.error("Error deleting project member:", error);
      const errorMessage = error.response?.data?.message || "Failed to delete project member";
      toast.error(errorMessage);
    } finally {
      set({ isDeletingMember: false });
    }
  },

  addMemberToProject: async (projectId, memberData) => {
    try {
      set({ isAddingMember: true });
      const res = await axiosInstance.post(
        `/project/add-member/${projectId}`,
        memberData,
      );
      console.log("addMemberToProject response", res.data.data);
      
      // Update the project members count
      set((state) => ({
        projects: state.projects.map((project) =>
          project._id === projectId
            ? { ...project, members: project.members + 1 }
            : project,
        ),
      }));
      
      toast.success(res.data.message || "Member added to project successfully");
      
    } catch (error) {
      console.error("Error adding member to project:", error);
      const errorMessage = error.response?.data?.message || "Failed to add member to project";
      toast.error(errorMessage);
    } finally {
      set({ isAddingMember: false });
    }
  },

  // Add method to get project members count
  getProjectMembersCount: async (projectId) => {
    try {
      const res = await axiosInstance.get(`/project/get-all-members/${projectId}`);
      return res.data.data || 0;
    } catch (error) {
      console.error("Error fetching project members count:", error);
      return 0;
    }
  },

  // Clear project data (useful for cleanup)
  clearProject: () => {
    set({ project: null });
  },

  // Clear members data (useful for cleanup)
  clearMembers: () => {
    set({ members: [] });
  },
}));
