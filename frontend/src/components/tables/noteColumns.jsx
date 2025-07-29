import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const createNoteColumns = () => [
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
