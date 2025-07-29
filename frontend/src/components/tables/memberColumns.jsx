import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuItem,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

export const createMemberColumns = (currentUserRole, changeMemberRole, deleteProjectMember) => [
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

      const handleMemberRoleChange = async (newRole) => {
        try {
          await changeMemberRole(userId, newRole);
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
            {/* Only show admin options to project_admin and admin users */}
            {(currentUserRole === "project_admin" ||
              currentUserRole === "admin") && (
              <>
                {currentRole !== "admin" && (
                  <DropdownMenuItem
                    onClick={() => handleMemberRoleChange("admin")}
                  >
                    Make Admin
                  </DropdownMenuItem>
                )}
                {/* project_admin role is reserved for creator only - cannot be assigned to other members */}
                {currentRole !== "member" &&
                  currentRole !== "project_admin" && (
                    <DropdownMenuItem
                      onClick={() => handleMemberRoleChange("member")}
                    >
                      Make Member
                    </DropdownMenuItem>
                  )}
                <DropdownMenuItem onClick={handleMemberDelete}>
                  Remove Member
                </DropdownMenuItem>
              </>
            )}
            {/* If user has no admin permissions, show a message or nothing */}
            {currentUserRole !== "project_admin" &&
              currentUserRole !== "admin" && (
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
