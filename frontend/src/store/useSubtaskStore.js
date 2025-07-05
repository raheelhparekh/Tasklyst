import { axiosInstance } from "../lib/axios.js";
import { create } from "zustand";
import { toast } from "sonner";

export const useSubtaskStore = create((set) => ({
  subtasks: [],
  isCreatingSubtask: false,
  isFetchingSubtasks: false,
  createSubtask: async (subtaskData,taskId) => {
    try {
      set({ isCreatingSubtask: true });
      console.log("Creating subtask with data:", subtaskData, "for taskId:", taskId);
      const response = await axiosInstance.post(
        `/subtask/create-subtask/${taskId}`,
        subtaskData,
      );
      console.log("Subtask created:", response.data.data);
      set((state) => ({
        subtasks: [...state.subtasks, response.data.data],
      }));
      toast.success("Subtask created successfully");
    } catch (error) {
      toast.error("Failed to create subtask");
      console.error("Error creating subtask:", error);
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
      console.log("Subtasks fetched:", response.data.data);
      set({ subtasks: response.data.data });
    } catch (error) {
      toast.error("Failed to fetch subtasks");
      console.error("Error fetching subtasks:", error);
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
      console.log("Subtask deleted:", response.data);
      set((state) => ({
        subtasks: state.subtasks.filter((subtask) => subtask._id !== subtaskId),
      }));
      toast.success("Subtask deleted successfully");
    } catch (error) {
      toast.error("Failed to delete subtask");
      console.error("Error deleting subtask:", error);
    }
  },

  updateSubtask: async (subtaskId, updatedData) => {
    try {
      const response = await axiosInstance.put(
        `/subtask/update-subtask/${subtaskId}`,
        updatedData,
      );
      console.log("Subtask updated:", response.data);
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
      console.error("Error updating subtask:", error);
    }
  },
}));
