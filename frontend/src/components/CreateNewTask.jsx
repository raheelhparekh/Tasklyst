import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/DatePicker";
import { useParams } from "react-router-dom";
import { useTaskStore } from "@/store/useTaskStore";

export default function CreateNewTask({ onClose, members }) {
  const { id } = useParams();
  const { createTask } = useTaskStore();

  const [selectedFiles, setSelectedFiles] = useState([]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description || "");
    formData.append("email", data.assignedTo);
    formData.append("status", data.status || "todo");
    formData.append("priority", data.priority || "medium");
    formData.append(
      "dueDate",
      data.dueDate ? data.dueDate.toISOString() : null
    );

    if (selectedFiles.length > 0) {
      selectedFiles.forEach((file) => {
        formData.append("attachments", file);
      });
    }

    try {
      await createTask(formData, id);
      reset();
      setSelectedFiles([]);
      onClose?.();
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        placeholder="Task Title"
        {...register("title", { required: "Title is required" })}
      />
      {errors.title && (
        <span className="text-red-500 text-sm">{errors.title.message}</span>
      )}

      <Textarea
        placeholder="Description"
        rows={4}
        {...register("description")}
      />

      <Controller
        name="assignedTo"
        control={control}
        rules={{ required: "Assignee is required" }}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Assign to" />
            </SelectTrigger>
            <SelectContent>
              {members.map((member) => (
                <SelectItem key={member._id} value={member.user.email}>
                  {member.user.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {errors.assignedTo && (
        <span className="text-red-500 text-sm">
          {errors.assignedTo.message}
        </span>
      )}

      <div className="flex mt-8 gap-6">
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">Todo</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          )}
        />

        <Controller
          name="priority"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-[260px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="mt-7">
        <Controller
          name="dueDate"
          control={control}
          defaultValue={null}
          render={({ field }) => (
            <DatePicker value={field.value} onChange={field.onChange} />
          )}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="attachment">Attachments</Label>
        <Input
          id="attachment"
          type="file"
          multiple
          accept="image/*,application/pdf,.doc,.docx,.txt"
          onChange={(e) => {
            const newFiles = Array.from(e.target.files);
            const updatedFiles = [...selectedFiles, ...newFiles];
            setSelectedFiles(updatedFiles);
            setValue("attachments", updatedFiles);
          }}
        />

        {/* Display selected files */}
        <div className="mt-2 space-y-1 max-h-36 overflow-y-auto">
          {selectedFiles.map((file, idx) => (
            <div key={idx} className="flex justify-between items-center text-sm">
              <span className="truncate max-w-[240px] ml-3">{file.name}</span>
              <button
                type="button"
                onClick={() => {
                  const filtered = selectedFiles.filter((_, i) => i !== idx);
                  setSelectedFiles(filtered);
                  setValue("attachments", filtered);
                }}
                className="text-red-500 text-xs ml-2"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" onClick={onClose}>Create</Button>
      </div>
    </form>
  );
}
