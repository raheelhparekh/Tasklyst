import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuItem,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { MoreVertical } from "lucide-react";

export const createTaskColumns = (
  navigate,
  canManageTask,
  canDeleteTask,
  handleTaskStatusChange,
  openDeleteDialog
) => [
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
      const canUpdate = canManageTask(task);
      const canDelete = canDeleteTask(task);

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {canUpdate && (
              <>
                <DropdownMenuItem asChild>
                  <div className="flex items-center gap-2 px-2 py-1">
                    <span className="text-sm">Status:</span>
                    <Select
                      value={task.status}
                      onValueChange={(newStatus) =>
                        handleTaskStatusChange(task._id, newStatus)
                      }
                    >
                      <SelectTrigger className="h-6 w-24 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">Todo</SelectItem>
                        <SelectItem value="in_progress">
                          In Progress
                        </SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </DropdownMenuItem>
              </>
            )}
            {canDelete && (
              <DropdownMenuItem onClick={() => openDeleteDialog(task)}>
                Remove Task
              </DropdownMenuItem>
            )}
            {!canUpdate && !canDelete && (
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
