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

//TODO: after creating task the button should close automatically.
export default function CreateNewTask({ onClose, members }) {
  const { id } = useParams();
  const { createTask } = useTaskStore();

  const {
    register,
    handleSubmit,
    control,
    reset,
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
      data.dueDate ? data.dueDate.toISOString() : null,
    );

    if (data.attachments && data.attachments.length > 0) {
      Array.from(data.attachments).forEach((file) => {
        formData.append("attachments", file);
      });
    }

    console.log("Final form data:", Object.fromEntries(formData));

    try {
      await createTask(formData, id);
      console.log("Task created successfully");
      reset();
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
        <Label htmlFor="attachment">Attachment</Label>
        <Input
          id="attachment"
          type="file"
          accept="image/*,application/pdf,.doc,.docx,.txt"
          multiple
          {...register("attachments")}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Create</Button>
      </div>
    </form>
  );
}
