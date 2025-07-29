import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useProjectStore } from "@/store/useProjectStore";

export default function CreateProjectForm({ onClose }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { createProject } = useProjectStore();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      await createProject({ name, description });
      setName("");
      setDescription("");
      onClose();
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Project Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border-violet-200 focus:border-violet-400 dark:border-violet-800 dark:focus:border-violet-600"
        required
      />
      <Textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border-violet-200 focus:border-violet-400 dark:border-violet-800 dark:focus:border-violet-600 resize-none"
        rows={4}
      />
      <div className="flex justify-end gap-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onClose}
          className="border-violet-200 hover:border-violet-300 hover:bg-violet-50 dark:border-violet-800 dark:hover:border-violet-700 dark:hover:bg-violet-950"
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white"
        >
          Create
        </Button>
      </div>
    </form>
  );
}
