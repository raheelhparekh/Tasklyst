import { useState } from "react";
import { useTaskStore } from "@/store/useTaskStore";

export const useTaskOperations = (projectId) => {
  const {
    getAllTodoTasks,
    getAllCompletedTasks,
    getAllPendingTasks,
    deleteTask,
    updateTaskStatus,
    isDeletingTask,
  } = useTaskStore();

  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, { status: newStatus });
      // Refresh the task lists
      refreshTaskLists();
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const refreshTaskLists = () => {
    getAllTodoTasks(projectId);
    getAllCompletedTasks(projectId);
    getAllPendingTasks(projectId);
  };

  // Handle opening delete dialog
  const openDeleteDialog = (task) => {
    setTaskToDelete(task);
    setIsDeleteDialogOpen(true);
  };

  // Handle task deletion confirmation
  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    
    try {
      await deleteTask(taskToDelete._id);
      refreshTaskLists();
      // Close dialog and reset state
      setIsDeleteDialogOpen(false);
      setTaskToDelete(null);
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  return {
    taskToDelete,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isDeletingTask,
    handleTaskStatusChange,
    openDeleteDialog,
    handleDeleteTask,
    refreshTaskLists,
  };
};
