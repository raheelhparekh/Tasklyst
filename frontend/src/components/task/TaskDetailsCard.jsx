import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon, UserIcon } from "lucide-react";

export const TaskDetailsCard = ({ task, status, onStatusChange }) => {
  if (!task) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "in_progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "todo":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "in_progress":
        return "In Progress";
      case "todo":
        return "To Do";
      default:
        return "Unknown";
    }
  };

  return (
    <Card className="border-violet-100 dark:border-violet-900 shadow-lg">
      <CardHeader className="pb-4">
        {/* Header with Title and Badges */}
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="text-violet-900 dark:text-violet-100 text-xl font-bold flex-1">
            {task.title}
          </CardTitle>
          
          {/* Priority and Status Badges */}
          <div className="flex gap-2 flex-shrink-0">
            <Badge className={getPriorityColor(task.priority)} variant="secondary">
              {task.priority}
            </Badge>
            <Select value={status} onValueChange={onStatusChange}>
              <SelectTrigger className="w-auto h-auto p-0 border-0 bg-transparent focus:ring-0">
                <Badge className={getStatusColor(status)} variant="secondary">
                  {getStatusLabel(status)}
                </Badge>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6 pt-0">
        {/* Description */}
        <div>
          <p className="text-muted-foreground">
            {task.description || "No description provided"}
          </p>
        </div>

        <Separator className="bg-violet-200 dark:bg-violet-800" />

        {/* Assignment Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-violet-900 dark:text-violet-100 flex items-center gap-2">
              <UserIcon className="h-4 w-4 text-violet-600 dark:text-violet-400" />
              Assigned To
            </h4>
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 border-2 border-violet-200 dark:border-violet-800">
                <AvatarImage src={task.assignedTo?.avatar?.url} />
                <AvatarFallback className="bg-gradient-to-r from-violet-500 to-purple-500 text-white">
                  {task.assignedTo?.username?.[0]?.toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{task.assignedTo?.username}</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-violet-900 dark:text-violet-100 flex items-center gap-2">
              <UserIcon className="h-4 w-4 text-violet-600 dark:text-violet-400" />
              Assigned By
            </h4>
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 border-2 border-violet-200 dark:border-violet-800">
                <AvatarImage src={task.assignedBy?.avatar?.url} />
                <AvatarFallback className="bg-gradient-to-r from-violet-500 to-purple-500 text-white">
                  {task.assignedBy?.username?.[0]?.toUpperCase() ?? "A"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{task.assignedBy?.username}</span>
            </div>
          </div>
        </div>

        <Separator className="bg-violet-200 dark:bg-violet-800" />

        {/* Due Date */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-violet-900 dark:text-violet-100 flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-violet-600 dark:text-violet-400" />
            Due Date
          </h4>
          <p className="text-sm text-muted-foreground">
            {task.dueDate ? formatDate(task.dueDate) : "No due date set"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
