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
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

export const AddMemberDialog = ({
  email,
  setEmail,
  onAddMember,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Plus size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="border-violet-200 dark:border-violet-800">
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
            className="border-violet-200 focus:border-violet-400 dark:border-violet-800 dark:focus:border-violet-600"
          />
        </div>
        <DialogFooter>
          <Button 
            onClick={onAddMember}
            className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white"
          >
            Add Member
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
