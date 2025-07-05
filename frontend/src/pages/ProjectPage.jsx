/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/DataTable.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MoreVertical, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProjectPageControls from "@/components/ProjectPageControls";
import { useProjectStore } from "@/store/useProjectStore";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function ProjectPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { projects, getAllProjects, deleteProject, updateProject} = useProjectStore();

  useEffect(() => {
    getAllProjects();
  }, [getAllProjects]);

  const filteredData = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const columns = [
    {
      accessorKey: "name",
      header: "Project",
      cell: ({ row }) => (
        <Badge
          variant={"outline"}
          className="text-purple-600 hover:underline"
          onClick={() => navigate(`/project/${row.original._id}/task`)}
        >
          {row.original.name}
        </Badge>
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
      accessorKey: "members",
      header: "Members",
      cell: ({ row }) => <span>{row.original.members}</span>,
    },
    {
      accessorKey: "createdBy",
      header: "Created By",
      cell: ({ row }) => {
        const user = row.original.createdBy;
        return (
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={user?.avatar} alt={user?.username} />
              <AvatarFallback>{user?.username?.[0] ?? "U"}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              {user?.username}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {new Date(row.original.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const projectId = row.original._id;

        const handleDeleteProject = async () => {
          try {
            await deleteProject(projectId);
          } catch (error) {
            console.error("Error deleting project:", error);
            toast.error("Failed to delete project");
          }
        };

        return (
          <>
          {/*TODO: remove this dropdown menu as it is not needed*/}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => {}}>
                  Update Member Role
                </DropdownMenuItem>
                {/* <DropdownMenuItem onClick={handleAddMember}>
                  Add Member
                </DropdownMenuItem> */}
                <DropdownMenuItem onClick={() => alert("Delete member")}>
                  Delete Member
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Dialog>
              <DialogTrigger>
                <Trash className="h-4 w-4" variant="outline">
                  Delete Project
                </Trash>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Do you really want to delete?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    the project and all associated tasks.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit" onClick={handleDeleteProject}>
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        );
      },
    },
  ];

  return (
    <div className="w-full h-screen ">
      <h2 className="mb-6 text-2xl font-bold text-slate-700 dark:text-slate-300">
        Projects
      </h2>
      <ProjectPageControls search={search} setSearch={setSearch} />
      <DataTable
        columns={columns}
        data={filteredData}       
      />
    </div>
  );
}
