import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useState } from "react";
import CreateProjectForm from "./CreateProjectForm";

export default function ProjectPageControls({ search, setSearch }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
      
      {/* Search Input */}
      <Input
        type="text"
        placeholder="Search project name..."
        className="w-full md:w-1/3 border-violet-200 focus:border-violet-400 dark:border-violet-800 dark:focus:border-violet-600"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Dialog Trigger */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button variant="outline">Create Project</Button>
        </DialogTrigger>
        <DialogContent className="border-violet-200 dark:border-violet-800">
          <DialogHeader>
            <DialogTitle>Create a New Project?</DialogTitle>
            <DialogDescription>
              Please fill in the details below.
            </DialogDescription>
          </DialogHeader>
          <CreateProjectForm onClose={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
