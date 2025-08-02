/*
createTask: project admins, admins can create tasks
updateTaskStatus: only creater + admin + project_admin
deleteTask: only creater + admin + project_admin
getAllTasksOfProject: based on todo, in-progress, done
getAllTaskAssignedToUser: user can see all tasks assigned to them
getTaskById: anyone can see task details
*/

import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-errors.js";
import { ApiResponse } from "../utils/api-response.js";
import { Task } from "../models/task.models.js";
import { User } from "../models/user.models.js";
import { Note } from "../models/note.models.js";
import { SubTask } from "../models/subtask.models.js";

const createTask = asyncHandler(async (req, res) => {
  const { title, description, email, status, dueDate, priority } = req.body;
  const { projectId } = req.params;

  const user = req.user;

  if (!title || !email) {
    throw new ApiError(
      400,
      "Title, User Task Assigned To are required fields.",
    );
  }

  const userAssignedTo = await User.findOne({ email }).select(
    "username email avatar _id",
  );
  if (!userAssignedTo) {
    throw new ApiError(404, "User with this email not found. Invalid email.");
  }
  if (userAssignedTo._id.toString() === user._id.toString()) {
    throw new ApiError(400, "You cannot assign a task to yourself.");
  }

  // Process uploaded attachments
  const attachments =
    req.files?.map((file) => ({
      url: file.path,
      mimeType: file.mimetype,
      size: file.size,
      name: file.originalname,
    })) || [];

  const task = await Task.create({
    title,
    description,
    project: projectId,
    assignedTo: userAssignedTo,
    status: status || "todo", // Default status is TODO
    priority: priority || "medium", // Default priority is Medium
    dueDate: dueDate || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Optional due date or 3 days from now
    assignedBy: user,
    attachments: attachments || [],
  });

  if (!task) {
    throw new ApiError(500, "Failed to create task.");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, task, "Task created successfully"));
});

const updateTaskStatus = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;
  const user = req.user;

  const task = await Task.findById(taskId);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  // only user assigned to and admins can update the task status
  const isAssignedUser = task.assignedTo.toString() === user._id.toString();
  const isAdmin = req.userProjectRole === "admin" || req.userProjectRole === "project_admin";
  if (!isAssignedUser && !isAdmin) {
    throw new ApiError(403, "You are not authorized to update this task");
  }

  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    { status: status || task.status },
    { new: true },
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedTask, "Task status updated successfully"),
    );
});

const deleteTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const user = req.user;

  const task = await Task.findById(taskId);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  // Only the creator (assignedBy) or project admin can delete
  if (
    task.assignedBy.toString() !== user.id &&
    !(req.userProjectRole === "admin" || req.userProjectRole === "project_admin")
  ) {
    throw new ApiError(403, "You are not authorized to delete this task");
  }

  await Task.findByIdAndDelete(taskId);
  await Note.deleteMany({ task: taskId });
  await SubTask.deleteMany({ task: taskId });

  return res
    .status(200)
    .json(new ApiResponse(200, "Task deleted successfully"));
});

// Add attachments to existing task
const addAttachmentsToTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.findById(taskId);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  // Process uploaded attachments
  const newAttachments =
    req.files?.map((file) => ({
      url: file.path,
      mimeType: file.mimetype,
      size: file.size,
      name: file.originalname,
    })) || [];

  if (newAttachments.length === 0) {
    throw new ApiError(400, "No files uploaded");
  }

  // Add new attachments to existing ones
  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    { 
      $push: { 
        attachments: { $each: newAttachments } 
      } 
    },
    { new: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200, 
        updatedTask, 
        "Attachments added successfully"
      )
    );
});

const getAllTasksOfProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { status } = req.query;

  const filter = { project: projectId };
  if (status) {
    filter.status = status;
  }

  const tasks = await Task.find(filter)
    .populate("assignedTo", "username email avatar")
    .populate("assignedBy", "username email avatar");

  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "Tasks fetched successfully"));
});

const getTaskById = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.findById(taskId)
    .populate("assignedTo", "username email avatar")
    .populate("assignedBy", "username email avatar");

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task fetched successfully"));
});

const getAllTaskAssignedToUser = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const tasks = await Task.find({ assignedTo: userId })
    .populate("assignedTo", "username email avatar")
    .populate("assignedBy", "username email avatar");

  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "Tasks fetched successfully"));
});

export {
  createTask,
  updateTaskStatus,
  deleteTask,
  addAttachmentsToTask,
  getAllTasksOfProject,
  getTaskById,
  getAllTaskAssignedToUser,
};
