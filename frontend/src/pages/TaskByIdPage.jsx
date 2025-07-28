import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useNavigate, useParams } from "react-router-dom";
import { useTaskById } from "@/hooks/task/useTaskById";
import { useTaskForms } from "@/hooks/task/useTaskForms";
import { TaskDetailsCard } from "@/components/task/TaskDetailsCard";
import { TaskNotesCard } from "@/components/task/TaskNotesCard";
import { TaskSubtasksCard } from "@/components/task/TaskSubtasksCard";
import TaskAttachmentsCard from "@/components/task/TaskAttachmentsCard";
import { BackgroundLines } from "@/components/ui/background-lines";

export default function TaskByIdPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
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
  } = useTaskById(id);

  const {
    noteInput,
    setNoteInput,
    subtaskInput,
    setSubtaskInput,
    handleNoteSubmit,
    handleAddSubtask,
  } = useTaskForms(
    id,
    createTaskNote,
    createSubtask,
    getAllTaskNotes,
    getSubtasks,
  );

  return (
    <div className="container mx-auto p-6 space-y-8 relative z-10">
      {/* Enhanced Breadcrumb */}
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              onClick={() => navigate("/")}
              className="text-violet-600 hover:text-violet-800 dark:text-violet-400 dark:hover:text-violet-200 font-medium cursor-pointer transition-colors"
            >
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-violet-400" />
          <BreadcrumbItem>
            <BreadcrumbLink
              onClick={() => navigate("/projects")}
              className="text-violet-600 hover:text-violet-800 dark:text-violet-400 dark:hover:text-violet-200 font-medium cursor-pointer transition-colors"
            >
              Projects
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-violet-400" />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-violet-900 dark:text-violet-100 font-semibold">
              {task?.title || "Task Details"}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Loading State */}
      {isFetchingTaskById && (
        <div className="flex justify-center items-center py-16">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-violet-500 to-purple-500 animate-pulse"></div>
            <p className="text-violet-700 dark:text-violet-300 font-medium">
              Loading task details...
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {!isFetchingTaskById && !task && (
        <div className="flex justify-center items-center py-16">
          <div className="text-center space-y-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-8 border border-red-200 dark:border-red-800">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900 dark:to-pink-900 flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <p className="text-red-700 dark:text-red-300 font-medium">
              Task not found or you don't have permission to view it.
            </p>
          </div>
        </div>
      )}

      {/* Task Content */}
      {!isFetchingTaskById && task && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Task Details */}
          <div className="space-y-8">
            <TaskDetailsCard
              task={task}
              status={status}
              onStatusChange={handleStatusChange}
            />

            <TaskSubtasksCard
              subtasks={subtasks}
              subtaskInput={subtaskInput}
              setSubtaskInput={setSubtaskInput}
              onAddSubtask={handleAddSubtask}
              updateSubtask={updateSubtask}
              deleteSubtask={deleteSubtask}
              isFetchingSubtasks={isFetchingSubtasks}
            />
          </div>

          {/* Right Column - Attachments and Notes */}
          <div className="space-y-8">
            <TaskAttachmentsCard task={task} />

            <TaskNotesCard
              taskNotes={taskNotes}
              noteInput={noteInput}
              setNoteInput={setNoteInput}
              onNoteSubmit={handleNoteSubmit}
            />
          </div>
        </div>
      )}
    </div>
  );
}
