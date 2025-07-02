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
import { useTaskStore } from "@/store/useTaskStore";
import { useParams } from "react-router-dom";
import { useNoteStore } from "@/store/useNoteStore";

// const dummyTask = {
//   title: "Design Landing Page",
//   description: "Create a modern, responsive UI for the landing page.",
//   status: "in-progress",
//   priority: "high",
//   dueDate: "2025-07-10",
//   notes: [
//     { user: "Alice", message: "Let's keep the hero section minimal.", timestamp: "2025-06-25" },
//     { user: "Bob", message: "Added CTA animations.", timestamp: "2025-06-26" },
//     { user: "Charlie", message: "Mobile view needs polish.", timestamp: "2025-06-27" },
//   ],
//   attachments: [
//     { name: "wireframe.pdf", url: "https://example.com/wireframe.pdf" },
//     { name: "logo.png", url: "https://example.com/logo.png" },
//   ],
//   checklist: [
//     { title: "Design Hero section", completed: true },
//     { title: "Footer design", completed: false },
//     { title: "Mobile responsiveness", completed: false },
//   ],
//   tags: ["UI", "Frontend", "Design"],
// };

export default function TaskByIdPage() {
  const [status, setStatus] = useState("");
  const [noteInput, setNoteInput] = useState("");
  const [notes, setNotes] = useState([]);
  const { task, getTaskById } = useTaskStore();
  const { taskNotes, getAllTaskNotes, createTaskNote } = useNoteStore();
  const { id } = useParams();

  // console.log("Task data:", task);

  const handleNoteSubmit = async () => {
    try {
      // console.log("noteInput", noteInput);
      const newNote = await createTaskNote(noteInput, id);
      setNotes([...notes, newNote]);
      setNoteInput("");
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  useEffect(() => {
    getTaskById(id);
    getAllTaskNotes(id);
  }, [getAllTaskNotes]);

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
            Due:{new Date(task.dueDate).toLocaleDateString("en-US")}
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

            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">Todo</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-medium mb-2">Notes</h3>
          <div className="max-h-64 overflow-y-auto flex flex-col gap-3 pr-2">
            {taskNotes.map((note, index) => (
              <Card key={index} className="bg-muted p-3">
                <p className="text-sm font-semibold">
                  {note.createdBy.username}
                </p>
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
      <div className="space-y-6">
        {/* Attachments */}
        <Card>
          <CardHeader>
            <CardTitle>Attachments</CardTitle>
          </CardHeader>
          <CardContent>
            {task.attachments > 0 ? (
              task.attachments.map((file, index) => (
                <a
                  key={index}
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:underline text-sm mb-2"
                >
                  {file.name}
                </a>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No attachments.</p>
            )}
          </CardContent>
        </Card>

        {/* Checklist */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {task.checklist.map((item, index) => (
              <div key={index} className="text-sm">
                <span className={item.completed ? "line-through text-muted-foreground" : ""}>
                  • {item.title}
                </span>
              </div>
            ))}
          </CardContent>
        </Card> */}

        {/* Tags */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {task.tags.map((tag, index) => (
              <Badge key={index} variant="secondary">
                {tag}
              </Badge>
            ))}
          </CardContent>
        </Card>  */}
      </div>
    </div>
  );
}
