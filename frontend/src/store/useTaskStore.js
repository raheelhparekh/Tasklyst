import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { create } from "zustand";

export const useTaskStore = create((set) => ({
  tasks: [],
  todoTasks: [],
  in_progress: [],
  completedTasks: [],
  isFetchingTasks: false,
  isCreatingTask: false,
  isUpdatingTask: false,
  isDeletingTask: false,

  createTask: async (data, projectId) => {
    try {
      set({ isCreatingTask: true });
      const res = await axiosInstance.post(
        `/task/create-task/${projectId}`,
        data,
      );
      toast.success(res.data.message || "Task created successfully");
      set((state) => ({
        tasks: [...state.tasks, res.data.task],
      }));
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error(error.response?.data?.message || "Failed to create task");
    } finally {
      set({ isCreatingTask: false });
    }
  },
  getAllTodoTasks: async (projectId) => {
    try {
      set({ isFetchingTasks: true });
      const res = await axiosInstance.get(
        `/task/all-tasks/${projectId}?status=todo`,
      );
      console.log("getAllTodoTasks response", res.data.data);
      set({ todoTasks: res.data.data || [] });
      toast.success(res.data.message || "Tasks fetched successfully");
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error(error.response?.data?.message || "Failed to fetch tasks");
      set({ todoTasks: [] });
    } finally {
      set({ isFetchingTasks: false });
    }
  },

  getAllPendingTasks: async (projectId) => {
    try {
      set({ isFetchingTasks: true });
      const res = await axiosInstance.get(
        `/task/all-tasks/${projectId}?status=in_progress`,
      );
      console.log("getAllInProgressTasks response", res.data.data);
      set({ in_progress: res.data.data || [] });
      toast.success(res.data.message || "Tasks fetched successfully");
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error(error.response?.data?.message || "Failed to fetch tasks");
      set({ in_progress: [] });
    } finally {
      set({ isFetchingTasks: false });
    }
  },

  getAllCompletedTasks: async (projectId) => {
    try {
      set({ isFetchingTasks: true });
      const res = await axiosInstance.get(
        `/task/all-tasks/${projectId}?status=completed`,
      );
      console.log("getAllCompletedTasks response", res.data.data);
      set({ completedTasks: res.data.data || [] });
      toast.success(res.data.message || "Tasks fetched successfully");
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error(error.response?.data?.message || "Failed to fetch tasks");
      set({ completedTasks: [] });
    } finally {
      set({ isFetchingTasks: false });
    }
  },
}));
