import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";
import { toast } from "sonner";

export const useSubtaskStore = create((set) => ({
  subtasks: [],
  isCreatingSubtask: false,
  isFetchingSubtasks: false,
  createSubtask: async (subtaskData,taskId) => {
    try {
      set({ isCreatingSubtask: true });
      const response = await axiosInstance.post(
        `/subtask/create-subtask/${taskId}`,
        subtaskData,
      );
      set((state) => ({
        subtasks: [...state.subtasks, response.data.data],
      }));
      toast.success("Subtask created successfully");
    } catch (error) {
      toast.error("Failed to create subtask");
    } finally {
      set({ isCreatingSubtask: false });
    }
  },

  getSubtasks: async (taskId) => {
    try {
      set({ isFetchingSubtasks: true });
      const response = await axiosInstance.get(
        `/subtask/all-subtasks/${taskId}`,
      );
      set({ subtasks: response.data.data });
    } catch (error) {
      toast.error("Failed to fetch subtasks");
      set({ subtasks: [] });
    } finally {
      set({ isFetchingSubtasks: false });
    }
  },

  deleteSubtask: async (subtaskId) => {
    try {
      const response = await axiosInstance.delete(
        `/subtask/delete-subtask/${subtaskId}`,
      );
      set((state) => ({
        subtasks: state.subtasks.filter((subtask) => subtask._id !== subtaskId),
      }));
      toast.success("Subtask deleted successfully");
    } catch (error) {
      toast.error("Failed to delete subtask");
    }
  },

  updateSubtask: async (subtaskId, updatedData) => {
    try {
      const response = await axiosInstance.put(
        `/subtask/update-subtask/${subtaskId}`,
        updatedData,
      );
      set((state) => ({
        subtasks: state.subtasks.map((subtask) =>
          subtask._id === subtaskId
            ? { ...subtask, ...response.data }
            : subtask,
        ),
      }));
      toast.success("Subtask updated successfully");
    } catch (error) {
      toast.error("Failed to update subtask");
    }
  },
}));
