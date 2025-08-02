import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { create } from "zustand";

export const useTaskStore = create((set) => ({
  tasks: [],
  task: null,
  todoTasks: [],
  in_progress: [],
  completedTasks: [],
  isFetchingTasks: false,
  isCreatingTask: false,
  isUpdatingTask: false,
  isDeletingTask: false,
  isFetchingTaskById: false,

  createTask: async (taskData) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.post("/task", taskData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      set((state) => ({
        tasks: [...state.tasks, res.data.data],
      }));

      toast.success(res.data.message || "Task created successfully");
      return res.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error creating task. Please try again.";
      toast.error(errorMessage);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  getAllTodoTasks: async (projectId) => {
    try {
      set({ isFetchingTasks: true });
      const res = await axiosInstance.get(
        `/task/all-tasks/${projectId}?status=todo`,
      );
      set({ todoTasks: res.data.data || [] });
      // toast.success(res.data.message || "Tasks fetched successfully");
    } catch (error) {
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
      set({ in_progress: res.data.data || [] });
      // toast.success(res.data.message || "Tasks fetched successfully");
    } catch (error) {
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
      set({ completedTasks: res.data.data || [] });
      // toast.success(res.data.message || "Tasks fetched successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch tasks");
      set({ completedTasks: [] });
    } finally {
      set({ isFetchingTasks: false });
    }
  },

  getTaskById: async (id) => {
    try {
      set({ isFetchingTaskById: true });
      const res = await axiosInstance.get(`/task/${id}`);
      set({ task: res.data.data || null });
      // toast.success(res.data.message || "Task fetched successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch task");
      set({ task: null });
    } finally {
      set({ isFetchingTaskById: false });
    }
  },

  deleteTask: async (id) => {
    try {
      set({ isDeletingTask: true });
      const res = await axiosInstance.delete(`/task/delete-task/${id}`);
      toast.success(res.data.message || "Task deleted successfully");
      set((state) => ({
        tasks: state.tasks.filter((task) => task._id !== id),
        todoTasks: state.todoTasks.filter((task) => task._id !== id),
        in_progress: state.in_progress.filter((task) => task._id !== id),
        completedTasks: state.completedTasks.filter((task) => task._id !== id),
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete task");
    } finally {
      set({ isDeletingTask: false });
    }
  },

  updateTaskStatus: async (id, statusData) => {
    try {
      set({ isUpdatingTask: true });
      const res = await axiosInstance.put(
        `/task/update-task-status/${id}`,
        statusData,
      );
      toast.success(res.data.message || "Task status updated successfully");

      const newStatus = statusData.status;
      set((state) => ({
        // Update the current task if it exists
        task: state.task && state.task._id === id 
          ? { ...state.task, status: newStatus }
          : state.task,
        // Update in all task arrays
        tasks: state.tasks.map((task) =>
          task._id === id ? { ...task, status: newStatus } : task,
        ),
        todoTasks: state.todoTasks.map((task) =>
          task._id === id ? { ...task, status: newStatus } : task,
        ),
        in_progress: state.in_progress.map((task) =>
          task._id === id ? { ...task, status: newStatus } : task,
        ),
        completedTasks: state.completedTasks.map((task) =>
          task._id === id ? { ...task, status: newStatus } : task,
        ),
      }));
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update task status",
      );
    } finally {
      set({ isUpdatingTask: false });
    }
  },

  addAttachmentsToTask: async (taskId, formData) => {
    try {
      set({ isUpdatingTask: true });
      const res = await axiosInstance.post(
        `/task/add-attachments/${taskId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      
      // Update the current task if it exists
      set((state) => ({
        task: state.task && state.task._id === taskId 
          ? res.data.data 
          : state.task,
      }));
      
      toast.success(res.data.message || "Attachments added successfully");
      return res.data.data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add attachments",
      );
      throw error;
    } finally {
      set({ isUpdatingTask: false });
    }
  },
}));
