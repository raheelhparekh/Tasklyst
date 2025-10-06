import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileText, Plus, MessageSquareIcon } from "lucide-react";

export const TaskNotesCard = ({
  taskNotes = [],
  noteInput,
  setNoteInput,
  onNoteSubmit,
}) => {
  return (
    <Card className="border-violet-100 dark:border-violet-900 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-violet-900 dark:text-violet-100 text-xl font-bold flex items-center gap-2">
          <MessageSquareIcon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
          Notes
          <span className="text-sm font-normal bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 px-2 py-1 rounded-full">
            {taskNotes.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-0">
        {/* Add new note */}
        <div className="flex gap-2">
          <Textarea
            placeholder="Add a note to this task..."
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            className="min-h-[80px] border-violet-200 focus:border-violet-400 dark:border-violet-800 dark:focus:border-violet-600 bg-white dark:bg-gray-950 resize-none"
          />
          <Button
            onClick={onNoteSubmit}
            className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white"
            disabled={!noteInput.trim()}
            size="sm"
          >
            Add Note
          </Button>
        </div>

        {/* Display existing notes */}
        {taskNotes.length > 0 ? (
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {taskNotes.map((note) => (
              <div
                key={note._id}
                className="border border-violet-200 dark:border-violet-800 rounded-lg p-4 space-y-3 bg-gradient-to-r from-violet-50/30 to-purple-50/30 dark:from-violet-950/30 dark:to-purple-950/30 hover:from-violet-50/60 hover:to-purple-50/60 dark:hover:from-violet-950/60 dark:hover:to-purple-950/60 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 border-2 border-violet-200 dark:border-violet-800">
                    <AvatarImage src={note.createdBy?.avatar?.url} />
                    <AvatarFallback className="bg-gradient-to-r from-violet-500 to-purple-500 text-white text-sm">
                      {note.createdBy?.username?.[0]?.toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-violet-900 dark:text-violet-100">
                      {note.createdBy?.username}
                    </p>
                    <p className="text-xs ">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 pl-11">
                  {note.content}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            {/* <div className="p-4 rounded-full bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900 dark:to-purple-900 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <MessageSquareIcon className="h-8 w-8 text-violet-500" />
            </div> */}
            <p className="text-sm text-muted-foreground">
              No notes yet. Add the first note to get started.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
