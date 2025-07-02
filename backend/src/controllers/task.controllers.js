/*
--------Tasks---------
createTask: anyone
updateTask: (title, desc, attachments) only creater can + admin + project_admin
deleteTask: only creater access + admin + project_admin
updateTaskStatus: jisko assign kiya gya h vhi update kr skta h + admin + project_admin
getTasks: admin and project admin can see all tasks, 
getAssignedTasks: all can see their assigned tasks
getCreatedTasks: all can see their assignedBy tasks
*/

import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-errors.js";
import { ApiResponse } from "../utils/api-response.js";
import { Task } from "../models/task.models.js";
import { User } from "../models/user.models.js";
import { Note } from "../models/note.models.js";

const createTask = asyncHandler(async (req, res) => {
  try {
    const {
      title,
      description,
      email,
      status,
      dueDate,
      priority,
      attachments,
    } = req.body;
    const { projectId } = req.params;

    const user = req.user;
    // console.log("user",user);
    console.log("this task is created by user name:", user.username);

    if (!title || !email) {
      throw new ApiError(400, "Title, Assigned To are required fields.");
    }

    const userAssignedTo = await User.findOne({ email });
    if (!userAssignedTo) {
      throw new ApiError(404, "User with this email not found.");
    }

    console.log("userAssignedTo", userAssignedTo);
    console.log("task is assigned to user name :", userAssignedTo.username);

    // upload attachments if provided
    if (attachments && attachments.length > 0) {
      attachments.forEach((attachment) => {
        if (!attachment.url || !attachment.mimeType || !attachment.size) {
          throw new ApiError(400, "Invalid attachment format");
        }
      });
    }

    const task = await Task.create({
      title,
      description,
      project: projectId,
      assignedTo: userAssignedTo,
      status: status || "todo", // Default status is TODO
      priority: priority || "medium", // Default priority is Medium
      dueDate: null, // Default due date is null
      assignedBy: user,
      attachments: attachments || [],
    });

    if (!task) {
      throw new ApiError(500, "Failed to create task.");
    }

    return res
      .status(201)
      .json(new ApiResponse(201, task, "Task created successfully"));
  } catch (error) {
    console.error("Error creating task:", error);
    throw new ApiError(500, "Internal Server Error while creating task");
  }
});

const updateTask = asyncHandler(async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, email, attachments } = req.body;

    const user = req.user;
    console.log("this task is updated by user name:", user.username);

    const task = await Task.findById(taskId);
    if (!task) {
      throw new ApiError(404, "Task not found");
    }
    console.log("task details------", task);

    const assignedTo = await User.findOne({ email });
    console.log("userAssignedTo", assignedTo);
    console.log("task is assigned to user name :", assignedTo.username);

    // Check if the user is authorized to update the task , only the creator can update or the project admin
    if (
      task.assignedBy.toString() !== req.user.id &&
      req.user.role !== "ADMIN"
    ) {
      throw new ApiError(403, "You are not authorized to update this task");
    }

    const updateTask = await Task.findByIdAndUpdate(
      taskId,
      {
        title: title || task.title,
        description: description || task.description,
        assignedTo: assignedTo || task.assignedTo,
        attachments: attachments || task.attachments,
      },
      { new: true },
    );

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task: updateTask,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    throw new ApiError(500, "Internal Server Error while updating task");
  }
});

const deleteTask = asyncHandler(async (req, res) => {
  try {
    const { taskId } = req.params;
    const user = req.user;
    console.log("this task is deleted by username:", user.username);

    const task = await Task.findById(taskId);
    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    // Check if the user is authorized to delete the task, only the creator can delete or the project admin
    if (
      task.assignedBy.toString() !== req.user.id &&
      req.user.role !== "ADMIN"
    ) {
      throw new ApiError(403, "You are not authorized to delete this task");
    }

    await Task.findByIdAndDelete(taskId);

    // delete notes associated with this task if any
    await Note.deleteMany({ task: taskId });

    //TODO: delete attachments from cloud storage if any. write the delete logic in middlewares
    
    return res
      .status(200)
      .json(new ApiResponse(200, "Task deleted successfully"));
  } catch (error) {
    console.error("Error deleting task:", error);
    throw new ApiError(500, "Internal Server Error while deleting task");
  }
});

const getAllTasksOfProject = asyncHandler(async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status } = req.query;

    const filter = { project: projectId };
    if (status) {
      filter.status = status;
    }

    const tasks = await Task.find(filter)
      .populate("assignedTo", "username email avatar")
      .populate("assignedBy", "username email avatar");

    // console.log("tasks of project", tasks);

    // if (!tasks || tasks.length === 0) {
    //   throw new ApiError(404, "No tasks found for this project");
    // }

    return res
      .status(200)
      .json(new ApiResponse(200, tasks, "Tasks fetched successfully"));
  } catch (error) {
    console.error("Error fetching tasks of project:", error);
    throw new ApiError(
      500,
      "Internal Server Error while fetching tasks of project",
    );
  }
});

const getTaskById = asyncHandler(async (req, res) => {
  try {
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
  } catch (error) {
    console.error("Error fetching task by ID:", error);
    throw new ApiError(500, "Internal Server Error while fetching task by ID");
  }
});

const getAllTaskAssignedToUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;

    const tasks = await Task.find({ assignedTo: userId })
      .populate("assignedTo", "name email avatar")
      .populate("assignedBy", "name email avatar");

    if (!tasks || tasks.length === 0) {
      throw new ApiError(404, "No tasks assigned to this user");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, tasks, "Tasks fetched successfully"));
  } catch (error) {
    console.error("Error fetching all tasks of user:", error);
    throw new ApiError(
      500,
      "Internal Server Error while fetching all tasks of user",
    );
  }
});

export {
  createTask,
  updateTask,
  deleteTask,
  getAllTasksOfProject,
  getTaskById,
  getAllTaskAssignedToUser,
};
