import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useParams } from "react-router-dom";
import { useTaskStore } from "@/store/useTaskStore";
import { useNoteStore } from "@/store/useNoteStore";
import { useSubtaskStore } from "@/store/useSubtaskStore";
import { File, FileText, Plus, Trash } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function TaskByIdPage() {
  const [status, setStatus] = useState("");
  const [noteInput, setNoteInput] = useState("");
  const [subtaskInput, setSubtaskInput] = useState("");

  const { id } = useParams();

  const { task, getTaskById, updateTaskStatus } = useTaskStore();
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
    getTaskById(id);
    getAllTaskNotes(id);
    getSubtasks(id);
  }, [id, getTaskById, getAllTaskNotes, getSubtasks]);

  const handleNoteSubmit = async () => {
    if (!noteInput.trim()) return;
    await createTaskNote(noteInput, id);
    setNoteInput("");
  };

  const handleAddSubtask = async () => {
    await createSubtask({ title: subtaskInput }, id);
    setSubtaskInput("");
  };

  const handleStatusChange = async (newStatus) => {
    try {
      if (!newStatus || newStatus === status) return; // No change in status
      setStatus(newStatus);
      await updateTaskStatus(id, { status: newStatus });
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Side */}
      <div className="space-y-4">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{task?.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div>
          <h2 className="text-2xl font-semibold">{task.title}</h2>
          <p className="text-muted-foreground mt-1">{task.description}</p>
          <p className="text-sm text-muted-foreground mt-1">
            Due Date: {new Date(task.dueDate).toLocaleDateString("en-US")}
          </p>

          <div className="flex items-center gap-2 mt-3">
            <Badge
              variant={
                task.priority === "high"
                  ? "destructive"
                  : task.priority === "medium"
                  ? "secondary"
                  : "outline"
              }
            >
              {task.priority}
            </Badge>

            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder={task.status} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">Todo</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        {/* Notes */}
        <div>
          <h3 className="text-lg font-medium mb-2">Notes</h3>
          <div className="max-h-64 overflow-y-auto flex flex-col gap-3 pr-2">
            {taskNotes.map((note, index) => (
              <Card key={index} className="bg-muted p-3">

                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage
                      src={note.createdBy?.avatar}
                      alt={note.createdBy?.username}
                    />
                    <AvatarFallback className="bg-white text-black">
                      {note.createdBy?.username?.[0] ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">
                    {note.createdBy?.username}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{note.content}</p>
                <p className="text-xs text-gray-400">
                  {note.createdAt.split("T")[0]}
                </p>
              </Card>
            ))}
          </div>
          <div className="mt-3 space-y-2">
            <Textarea
              placeholder="Add a note..."
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
            />
            <div className="flex justify-end">
              <Button onClick={handleNoteSubmit}>Add Note</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="space-y-4">
        {/* Attachments */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Attachments</CardTitle>
            <Button variant="outline" className="">
              <Plus className="w-4 h-4 mr-2" />
              Add File
            </Button>
          </CardHeader>
          <CardContent>
            {task.attachments?.length > 0 ? (
              task.attachments.map((file, index) => (
                <a
                  key={index}
                  href={file.url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:underline text-sm mb-2"
                >
                  {file.mimeType?.includes("pdf") ? (
                    <FileText className="w-4 h-4 text-red-500" />
                  ) : (
                    <File className="w-4 h-4 text-gray-500" />
                  )}
                  {file.name || "View file"}
                </a>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No attachments.</p>
            )}
          </CardContent>
        </Card>

        {/* Subtasks */}
        <Card className="space-y-4 ">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Subtasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isFetchingSubtasks ? (
              <p className="text-sm text-muted-foreground">
                Loading subtasks...
              </p>
            ) : subtasks.length > 0 ? (
              subtasks.map((subtask) => (
                <div
                  key={subtask._id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={subtask.isCompleted}
                      onChange={() =>
                        updateSubtask(subtask._id, {
                          isCompleted: !subtask.isCompleted,
                        })
                      }
                      className="h-4 w-4"
                    />
                    <span
                      className={
                        subtask.isCompleted
                          ? "line-through text-muted-foreground"
                          : ""
                      }
                    >
                      {subtask.title}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteSubtask(subtask._id)}
                  >
                    <Trash className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No subtasks found.
              </p>
            )}

            <div className="flex gap-2 mt-10">
              <Input
                value={subtaskInput}
                onChange={(e) => setSubtaskInput(e.target.value)}
                placeholder="New subtask title"
                className="flex-1"
              />
              <Button onClick={handleAddSubtask}>Add</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
