import { useState } from "react";

export const useTaskForms = (taskId, createTaskNote, createSubtask, getAllTaskNotes, getSubtasks) => {
  const [noteInput, setNoteInput] = useState("");
  const [subtaskInput, setSubtaskInput] = useState("");

  const handleNoteSubmit = async () => {
    if (!noteInput.trim()) return;
    await createTaskNote(noteInput, taskId);
    setNoteInput("");
    // Refresh notes after adding
    getAllTaskNotes(taskId);
  };

  const handleAddSubtask = async () => {
    if (!subtaskInput.trim()) return;
    await createSubtask({ title: subtaskInput }, taskId);
    setSubtaskInput("");
    // Refresh subtasks after adding
    getSubtasks(taskId);
  };

  return {
    noteInput,
    setNoteInput,
    subtaskInput,
    setSubtaskInput,
    handleNoteSubmit,
    handleAddSubtask,
  };
};
