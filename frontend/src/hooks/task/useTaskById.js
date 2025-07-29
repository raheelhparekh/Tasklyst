import { useEffect, useState } from "react";
import { useTaskStore } from "@/store/useTaskStore";
import { useNoteStore } from "@/store/useNoteStore";
import { useSubtaskStore } from "@/store/useSubtaskStore";

export const useTaskById = (taskId) => {
  const [status, setStatus] = useState("");

  const { task, getTaskById, updateTaskStatus, isFetchingTaskById } = useTaskStore();
  const { taskNotes, getAllTaskNotes, createTaskNote } = useNoteStore();
  const {
    subtasks,
    getSubtasks,
    createSubtask,
    isFetchingSubtasks,
    updateSubtask,
    deleteSubtask,
  } = useSubtaskStore();

  useEffect(() => {
    if (taskId) {
      getTaskById(taskId);
      getAllTaskNotes(taskId);
      getSubtasks(taskId);
    }
  }, [taskId, getTaskById, getAllTaskNotes, getSubtasks]);

  // Sync status with task data when task loads or updates
  useEffect(() => {
    if (task && task.status) {
      setStatus(task.status);
    }
  }, [task]);

  const handleStatusChange = async (newStatus) => {
    try {
      if (!newStatus || newStatus === status) return;
      setStatus(newStatus);
      await updateTaskStatus(taskId, { status: newStatus });
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  return {
    task,
    status,
    taskNotes,
    subtasks,
    isFetchingTaskById,
    isFetchingSubtasks,
    handleStatusChange,
    createTaskNote,
    createSubtask,
    updateSubtask,
    deleteSubtask,
    getAllTaskNotes,
    getSubtasks,
  };
};
