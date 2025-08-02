import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { create } from "zustand";

export const useNoteStore = create((set) => ({
  notes: [],
  taskNotes:[],
  isFetchingNotes: false,
  isCreatingNote: false,
  isUpdatingNote: false,
  isDeletingNote: false,

  getAllProjectNotes: async (projectId) => {
    try {
      set({ isFetchingNotes: true });
      const res = await axiosInstance.get(`/note/${projectId}`);
      set({ notes: res.data.data || [] });
      // toast.success(res.data.message || "Notes fetched successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch notes");
      set({ notes: [] });
    } finally {
      set({ isFetchingNotes: false });
    }
  },

  getAllTaskNotes: async (taskId) => {
    try {
      set({ isFetchingNotes: true });
      const res = await axiosInstance.get(`/note/n/${taskId}`);
      set({ taskNotes: res.data.data || [] });
      // toast.success(res.data.message || "Notes fetched successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch notes");
      set({ taskNotes: [] });
    } finally {
      set({ isFetchingNotes: false });
    }
  },

  createProjectNote:async(content, projectId) => {
    try {
      set({ isCreatingNote: true });
      const res = await axiosInstance.post(`/note/${projectId}/n/create-note`, {content});
      toast.success(res.data.message || "Note created successfully");
      set((state) => ({
        notes: [...state.notes, res.data.data],
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create note");
    } finally {
      set({ isCreatingNote: false });
    }
  },

  createTaskNote: async(content, taskId) => {
    try {
      set({ isCreatingNote: true });
      const res = await axiosInstance.post(`/note/task/${taskId}/create-note`, {content});
      toast.success(res.data.message || "Note created successfully");
      set((state) => ({
        taskNotes: [...state.taskNotes, res.data.data],
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create note");
    } finally {
      set({ isCreatingNote: false });
    }
  }
}));
