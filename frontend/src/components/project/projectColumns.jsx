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
import { MoreVertical, Trash, Loader2, Edit, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const createProjectColumns = (navigate, canPerformAction, deleteProject, isDeletingProject) => [
  {
    accessorKey: "name",
    header: "Project Name",
    cell: ({ row }) => (
      <button
        className="hover:underline hover:text-blue-600 font-medium text-left"
        onClick={() => navigate(`/project/${row.original._id}`)}
      >
        {row.original.name}
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
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.role;
      const roleColors = {
        project_admin: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
        admin: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        member: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      };
      
      return (
        <Badge className={roleColors[role] || "bg-gray-100 text-gray-800"}>
          {role === "project_admin" ? "Owner" : role}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdBy",
    header: "Created By",
    cell: ({ row }) => {
      const user = row.original.createdBy;
      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} alt={user.username} />
            <AvatarFallback>{user.username?.[0] ?? "U"}</AvatarFallback>
          </Avatar>
          <span className="text-sm">{user.username}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {new Date(row.original.createdAt).toLocaleDateString()}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const project = row.original;
      const projectId = project._id;

      const canDelete = canPerformAction('canDeleteProject', project);
      const canUpdate = canPerformAction('canUpdateProject', project);
      const canManageMembers = canPerformAction('canAddMember', project);

      const handleDeleteProject = async () => {
        try {
          await deleteProject(projectId);
          toast.success("Project deleted successfully");
        } catch (error) {
          console.error("Error deleting project:", error);
          toast.error("Failed to delete project");
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
            {canUpdate && (
              <DropdownMenuItem onClick={() => navigate(`/project/${projectId}/edit`)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Project
              </DropdownMenuItem>
            )}
            
            {canManageMembers && (
              <DropdownMenuItem onClick={() => navigate(`/project/${projectId}`)}>
                <Users className="mr-2 h-4 w-4" />
                Manage Members
              </DropdownMenuItem>
            )}

            {canDelete && (
              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Trash className="mr-2 h-4 w-4" />
                    Delete Project
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Project</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete "{project.name}"? This action cannot be undone. 
                      This will permanently delete the project and all associated tasks, notes, and subtasks.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button 
                      type="submit" 
                      onClick={handleDeleteProject}
                      disabled={isDeletingProject}
                      className="flex items-center gap-2 bg-red-500 hover:bg-red-600"
                    >
                      {isDeletingProject && <Loader2 className="h-4 w-4 animate-spin" />}
                      {isDeletingProject ? "Deleting..." : "Delete"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            {!canUpdate && !canDelete && !canManageMembers && (
              <DropdownMenuItem disabled>
                No actions available
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
