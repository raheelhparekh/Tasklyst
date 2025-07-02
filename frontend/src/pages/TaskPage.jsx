import ProjectSidebar from "@/components/ProjectSidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DataTable } from "@/components/ui/DataTable";
import {
  DropdownMenuItem,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useProjectStore } from "@/store/useProjectStore";
import { Button } from "@/components/ui/button";
import { MoreVertical, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useTaskStore } from "@/store/useTaskStore";
import { useNoteStore } from "@/store/useNoteStore";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

function TaskPage() {
  const {
    getAllProjects,
    project,
    members,
    getAllMembersDetails,
    changeMemberRole,
    deleteProjectMember,
    addMemberToProject,
  } = useProjectStore();
  const [activeTab, setActiveTab] = useState("todo"); // default active tab
  const { id } = useParams();
  const {
    getAllTodoTasks,
    getAllCompletedTasks,
    getAllPendingTasks,
    todoTasks,
    completedTasks,
    in_progress,
    deleteTask,
  } = useTaskStore();
  const { getAllProjectNotes, notes, createProjectNote } = useNoteStore();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    getAllTodoTasks(id);
    getAllCompletedTasks(id);
    getAllPendingTasks(id);
    getAllMembersDetails(id);
    getAllProjectNotes(id);
  }, [
    id,
    getAllProjects,
    getAllTodoTasks,
    getAllCompletedTasks,
    getAllPendingTasks,
    getAllMembersDetails,
    getAllProjectNotes,
  ]);

  // columns for members table
  const columns = [
    {
      accessorKey: "username",
      header: "Name",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={user.user.avatar} alt={user.user.username} />
              <AvatarFallback>{user.user.username?.[0] ?? "U"}</AvatarFallback>
            </Avatar>
            <span>{user.user.username}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <span>{row.original.user.email}</span>,
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <span className="capitalize">{row.original.role}</span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const member = row.original;
        const userId = member._id;
        const currentRole = member.role;

        const handleMemberRoleChange = async () => {
          try {
            await changeMemberRole(userId, "admin");
          } catch (error) {
            console.error("Error changing member role:", error);
          }
        };

        const handleMemberDelete = async () => {
          try {
            await deleteProjectMember(userId);
          } catch (error) {
            console.error("Error deleting member:", error);
          }
        };

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={handleMemberRoleChange}
                disabled={currentRole === "admin"}
              >
                Make Admin
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleMemberDelete}>
                Remove Member
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // columns for tasks table
  const taskColumns = [
    {
      accessorKey: "title",
      header: "Task",
      cell: ({ row }) => (
        <button
          className="hover:underline hover:text-blue-600"
          onClick={() => navigate(`/task/${row.original._id}`)}
        >
          {row.original.title}
        </button>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground truncate max-w-xs block">
          {row.original.description}
        </span>
      ),
    },
    {
      accessorKey: "assignedTo.username",
      header: "Assigned To",
      cell: ({ row }) => {
        const assignedTo = row.original.assignedTo;
        return (
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={assignedTo.avatar} alt={assignedTo.username} />
              <AvatarFallback>{assignedTo.username?.[0] ?? "U"}</AvatarFallback>
            </Avatar>
            <span>{assignedTo.username}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      cell: ({ row }) => {
        const dueDate = new Date(row.original.dueDate);
        return (
          <span>
            {dueDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        );
      },
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => {
        const priority = row.original.priority;
        const priorityColors = {
          high: "text-red-500",
          medium: "text-yellow-500",
          low: "text-green-500",
        };
        return (
          <span className={`px-2 py-1 rounded-md ${priorityColors[priority]}`}>
            {priority}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",

      cell: ({ row }) => {
        const status = row.original.status;
        const statusColors = {
          todo: "text-red-500",
          in_progress: "text-yellow-500",
          completed: "text-green-500",
        };
        return (
          <span className={`px-2 py-1 rounded-md ${statusColors[status]}`}>
            {status}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const task = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => alert(`Change status for ${task.title}`)}
              >
                Change Status
              </DropdownMenuItem>
              <DropdownMenuItem  onClick={handleDeleteTask.bind(null, task._id)}>
                Remove Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // columns for notes for project table
  const noteColumn = [
    {
      accessorKey: "content",
      header: "Content",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground truncate max-w-xs block">
          {row.original.content}
        </span>
      ),
    },
    {
      accessorKey: "createdBy.username",
      header: "Created By",
      cell: ({ row }) => {
        const createdBy = row.original.createdBy;
        return (
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={createdBy.avatar} alt={createdBy.username} />
              <AvatarFallback>{createdBy.username?.[0] ?? "U"}</AvatarFallback>
            </Avatar>
            <span>{createdBy.username}</span>
          </div>
        );
      },
    },
  ];

  const handleSubmit = async () => {
    try {
      console.log("content", content);
      await createProjectNote(content, id);
      setContent(""); // Clear the content after submission
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  const handleAddMember = async () => {
    try {
      console.log("Adding member with email:", email);
      await addMemberToProject(id, { email, role: "member" });
      setEmail("");
      console.log("Member added successfully");
    } catch (error) {
      console.error("Error adding member:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      console.log("Deleting task with ID:", taskId);
      await deleteTask(taskId);
      // console.log("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }

  return (
    <div className="flex h-screen w-full">
      <ProjectSidebar
        onClose={() => navigate("/projects")}
        setActiveTab={setActiveTab}
        activeTab={activeTab}
        members={members}
      />

      <main className="flex-1 p-6 ">
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
              <BreadcrumbPage>{project?.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        {activeTab === "members" && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="mb-6 text-2xl font-bold text-slate-700 dark:text-slate-300">
                Members.
              </h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Plus size={18} />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add A Member?</DialogTitle>
                    <DialogDescription>
                      Enter the email of the user you want to add.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <Label htmlFor="email" className="text-sm">
                      Email
                    </Label>
                    <Input
                      type="email"
                      id="email"
                      placeholder="Enter the email..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddMember}>Add Member</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <DataTable
              columns={columns}
              data={members || []}
              onRowClick={(row) => console.log("Clicked member:", row.user._id)}
            />
          </>
        )}
        {activeTab === "todo" && (
          <div className="w-full">
            <h2 className="mb-6 text-2xl font-bold text-slate-700 dark:text-slate-300">
              Tasks To Do.
            </h2>
            <DataTable
              columns={taskColumns}
              data={todoTasks}
              onRowClick={(row) => console.log("Go to tasks page for", row._id)}
            />
          </div>
        )}
        {activeTab === "in_progress" && (
          <div className="w-full">
            <h2 className="mb-6 text-2xl font-bold text-slate-700 dark:text-slate-300">
              Tasks In Progress.
            </h2>
            <DataTable
              columns={taskColumns}
              data={in_progress}
              onRowClick={(row) => console.log("Go to tasks page for", row.id)}
            />
          </div>
        )}
        {activeTab === "completed" && (
          <div className="w-full">
            <h2 className="mb-6 text-2xl font-bold text-slate-700 dark:text-slate-300">
              Tasks Completed.
            </h2>
            <DataTable
              columns={taskColumns}
              data={completedTasks}
              onRowClick={(row) => console.log("Go to tasks page for", row.id)}
            />
          </div>
        )}
        {activeTab === "notes" && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300">
                Notes.
              </h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Plus size={18} />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create a new Note</DialogTitle>
                    <DialogDescription>
                      Fill in the details to add a new note to this task.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <Label htmlFor="content" className="text-sm">
                      Content
                    </Label>
                    <Textarea
                      id="content"
                      placeholder="Type your note here..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </div>

                  <DialogFooter>
                    <Button onClick={handleSubmit}>Add Note</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <DataTable
              columns={noteColumn}
              data={notes}
              onRowClick={(row) => console.log("Go to notes page for", row.id)}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default TaskPage;
