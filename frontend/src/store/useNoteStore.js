import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { create } from "zustand";

export const useNoteStore = create((set) => ({
  notes: [],
  isFetchingNotes: false,
  isCreatingNote: false,
  isUpdatingNote: false,
  isDeletingNote: false,

  getAllProjectNotes: async (projectId) => {
    try {
      set({ isFetchingNotes: true });
      const res = await axiosInstance.get(`/note/${projectId}`);
      console.log("getAllProjectNotes response", res.data.data);
      set({ notes: res.data.data || [] });
      toast.success(res.data.message || "Notes fetched successfully");
    } catch (error) {
      console.error("Error fetching notes:", error);
      toast.error(error.response?.data?.message || "Failed to fetch notes");
      set({ notes: [] });
    } finally {
      set({ isFetchingNotes: false });
    }
  },
}));
