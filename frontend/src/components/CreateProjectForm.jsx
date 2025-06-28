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
        required
      />
      <Textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
      />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Create</Button>
      </div>
    </form>
  );
}
