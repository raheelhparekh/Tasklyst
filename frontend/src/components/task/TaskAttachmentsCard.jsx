import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { FileIcon, PlusIcon, TrashIcon, DownloadIcon, UploadIcon } from "lucide-react";
import { useTaskStore } from "../../store/useTaskStore";
import { toast } from "sonner";

export default function TaskAttachmentsCard({ task }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const { addAttachmentsToTask, isUpdatingTask } = useTaskStore();

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleUploadAttachments = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select files to upload");
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("attachments", file);
    });

    try {
      await addAttachmentsToTask(task._id, formData);
      setSelectedFiles([]);
      // Reset file input
      document.getElementById("attachment-input").value = "";
    } catch (error) {
      console.error("Error uploading attachments:", error);
    }
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleViewFile = (attachment) => {
    try {
      let url = attachment.url || attachment;
      
      // Log the original URL for debugging
      console.log('Original attachment URL:', url);
      console.log('Full attachment object:', attachment);
      
      // Cloudinary URLs should already be complete, so just use them directly
      if (url) {
        // Open the file directly since Cloudinary provides complete URLs
        window.open(url, "_blank", "noopener,noreferrer");
      } else {
        toast.error("File URL not available");
      }
    } catch (error) {
      console.error("Error opening file:", error);
      toast.error("Unable to open file");
    }
  };

  return (
    <Card className="border-violet-100 dark:border-violet-900 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-violet-900 dark:text-violet-100 text-xl font-bold flex items-center gap-2">
          <FileIcon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
          Attachments
          <span className="text-sm font-normal bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 px-2 py-1 rounded-full">
            {task.attachments?.length || 0}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-0">{/* Upload Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              id="attachment-input"
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById("attachment-input").click()}
              className="flex items-center gap-2 border-violet-200 hover:border-violet-300 hover:bg-violet-50 dark:border-violet-800 dark:hover:border-violet-700 dark:hover:bg-violet-950"
            >
              <PlusIcon className="h-4 w-4" />
              Select Files
            </Button>
            {selectedFiles.length > 0 && (
              <Button
                size="sm"
                onClick={handleUploadAttachments}
                disabled={isUpdatingTask}
                className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white"
              >
                {isUpdatingTask ? (
                  <>
                    <UploadIcon className="h-4 w-4 animate-pulse" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <UploadIcon className="h-4 w-4" />
                    Upload {selectedFiles.length} file{selectedFiles.length > 1 ? "s" : ""}
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Selected Files Preview */}
          {selectedFiles.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-violet-700 dark:text-violet-300">Selected files:</p>
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-violet-50/30 to-purple-50/30 dark:from-violet-950/30 dark:to-purple-950/30 rounded-lg border border-violet-200 dark:border-violet-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-gradient-to-r from-violet-500 to-purple-500">
                      <FileIcon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <span className="text-sm font-medium truncate">{file.name}</span>
                      <p className="text-xs text-violet-600 dark:text-violet-400">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSelectedFile(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Existing Attachments */}
        {task.attachments && task.attachments.length > 0 ? (
          <div className="space-y-3">
            <p className="text-sm font-medium text-violet-700 dark:text-violet-300">Current attachments:</p>
            {task.attachments.map((attachment, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-violet-200 dark:border-violet-800 rounded-lg hover:bg-gradient-to-r hover:from-violet-50/30 hover:to-purple-50/30 dark:hover:from-violet-950/30 dark:hover:to-purple-950/30 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-gradient-to-r from-violet-500 to-purple-500">
                    <FileIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-sm truncate text-foreground">
                      {attachment.name || `Attachment ${index + 1}`}
                    </p>
                    {attachment.size && (
                      <p className="text-xs text-violet-600 dark:text-violet-400">
                        {formatFileSize(attachment.size)}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewFile(attachment)}
                  className="border-violet-200 hover:border-violet-300 hover:bg-gradient-to-r hover:from-violet-500 hover:to-purple-500 hover:text-white dark:border-violet-800 dark:hover:border-violet-700 transition-all duration-200"
                >
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  View
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            {/* <div className="p-4 rounded-full bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900 dark:to-purple-900 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FileIcon className="h-8 w-8 text-violet-500" />
            </div> */}
            <p className="text-sm text-muted-foreground">
              No attachments yet. Upload files to get started.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
