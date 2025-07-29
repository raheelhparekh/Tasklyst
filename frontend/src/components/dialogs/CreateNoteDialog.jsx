import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";

export const CreateNoteDialog = ({
  content,
  setContent,
  onCreateNote,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="hover:bg-violet-100 dark:hover:bg-violet-900 text-violet-600 dark:text-violet-400"
        >
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
          <Button 
            onClick={onCreateNote}
            className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white"
          >
            Add Note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
