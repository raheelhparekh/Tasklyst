import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { File, Plus, Trash } from "lucide-react";

export const TaskSubtasksCard = ({ 
  subtasks = [], 
  subtaskInput, 
  setSubtaskInput, 
  onAddSubtask,
  updateSubtask,
  deleteSubtask,
  isFetchingSubtasks 
}) => {
  const handleSubtaskToggle = async (subtask) => {
    try {
      await updateSubtask(subtask._id, {
        isCompleted: !subtask.isCompleted,
      });
    } catch (error) {
      console.error("Error updating subtask:", error);
    }
  };

  const handleDeleteSubtask = async (subtaskId) => {
    try {
      await deleteSubtask(subtaskId);
    } catch (error) {
      console.error("Error deleting subtask:", error);
    }
  };

  return (
    <Card className="border-violet-100 dark:border-violet-900 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-violet-900 dark:text-violet-100 text-xl font-bold flex items-center gap-2">
          <File className="h-5 w-5 text-violet-600 dark:text-violet-400" />
          Subtasks
          <span className="text-sm font-normal bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 px-2 py-1 rounded-full">
            {subtasks.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-0">
        {/* Add new subtask */}
        <div className="flex gap-2">
          <Input
            placeholder="Add a subtask..."
            value={subtaskInput}
            onChange={(e) => setSubtaskInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && subtaskInput.trim()) {
                onAddSubtask();
              }
            }}
            className="border-violet-200 focus:border-violet-400 dark:border-violet-800 dark:focus:border-violet-600"
          />
          <Button
            onClick={onAddSubtask}
            size="sm"
            disabled={!subtaskInput.trim()}
            className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Display subtasks */}
        {isFetchingSubtasks ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-center space-y-4">
              <div className="w-8 h-8 mx-auto rounded-full bg-gradient-to-r from-violet-500 to-purple-500 animate-pulse"></div>
              <p className="text-violet-700 dark:text-violet-300 font-medium text-sm">
                Loading subtasks...
              </p>
            </div>
          </div>
        ) : subtasks.length > 0 ? (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {subtasks.map((subtask) => (
              <div
                key={subtask._id}
                className="flex items-center gap-3 p-3 border border-violet-200 dark:border-violet-800 rounded-lg hover:bg-gradient-to-r hover:from-violet-50/30 hover:to-purple-50/30 dark:hover:from-violet-950/30 dark:hover:to-purple-950/30 transition-all duration-200"
              >
                <input
                  type="checkbox"
                  checked={subtask.isCompleted}
                  onChange={() => handleSubtaskToggle(subtask)}
                  className="rounded border-violet-300 text-violet-500 focus:ring-violet-500 dark:border-violet-700"
                />
                <span
                  className={`flex-1 text-sm ${
                    subtask.isCompleted
                      ? "line-through text-muted-foreground"
                      : "text-foreground"
                  }`}
                >
                  {subtask.title}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteSubtask(subtask._id)}
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="p-4 rounded-full bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900 dark:to-purple-900 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <File className="h-8 w-8 text-violet-500" />
            </div>
            <p className="text-sm text-muted-foreground">
              No subtasks added yet. Add the first subtask to get started.
            </p>
          </div>
        )}

        {/* Progress indicator */}
        {subtasks.length > 0 && (
          <div className="pt-4 border-t border-violet-200 dark:border-violet-800">
            <div className="flex justify-between text-xs text-violet-600 dark:text-violet-400 mb-2">
              <span className="font-medium">Progress</span>
              <span>
                {subtasks.filter((s) => s.isCompleted).length} / {subtasks.length} completed
              </span>
            </div>
            <div className="w-full bg-violet-100 dark:bg-violet-900 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-violet-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    (subtasks.filter((s) => s.isCompleted).length / subtasks.length) * 100
                  }%`,
                }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
