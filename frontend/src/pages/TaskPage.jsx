import ProjectSidebar from "@/components/ProjectSidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DataTable } from "@/components/ui/DataTable";
import {
  DropdownMenuItem,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProjectStore } from "@/store/useProjectStore";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useTaskStore } from "@/store/useTaskStore";
import { useNoteStore } from "@/store/useNoteStore";

function TaskPage() {
  const {
    getAllProjects,
    members,
    getAllMembersDetails,
    changeMemberRole,
    deleteProjectMember,
  } = useProjectStore();
  const [activeTab, setActiveTab] = useState("todo"); // default could be "todo"
  const { id } = useParams();
  const {
    getAllTodoTasks,
    getAllCompletedTasks,
    getAllPendingTasks,
    todoTasks,
    completedTasks,
    in_progress,
  } = useTaskStore();
  const { getAllProjectNotes, notes } = useNoteStore();
  const navigate = useNavigate();

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
              <DropdownMenuItem onClick={() => alert(`Remove ${task.title}`)}>
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

  return (
    <div className="flex">
      <ProjectSidebar
        onClose={() => navigate("/project")}
        setActiveTab={setActiveTab}
        activeTab={activeTab}
        members={members}
      />

      <main className="flex-1 p-6">
        {activeTab === "members" && (
          <div className="w-full">
            <h2 className="mb-6 text-2xl font-bold text-slate-700 dark:text-slate-300">
              Members.
            </h2>
            <DataTable
              columns={columns}
              data={members || []}
              onRowClick={(row) => console.log("Clicked member:", row.user._id)}
            />
          </div>
        )}
        {activeTab === "todo" && (
          <div className="w-full">
            <h2 className="mb-6 text-2xl font-bold text-slate-700 dark:text-slate-300">
              Tasks To Do.
            </h2>
            <DataTable
              columns={taskColumns}
              data={todoTasks}
              onRowClick={(row) => console.log("Go to tasks page for", row.id)}
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
          <div className="w-full">
            <h2 className="mb-6 text-2xl font-bold text-slate-700 dark:text-slate-300">
              Notes.
            </h2>
            <DataTable
              columns={noteColumn}
              data={notes}
              onRowClick={(row) => console.log("Go to notes page for", row.id)}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default TaskPage;
