import { SubTask } from "../models/subtask.models.js";
import { ApiError } from "../utils/api-errors.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

// create a subtask
const createSubtask = asyncHandler(async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title } = req.body;
    const user = req.user;

    if (!title || !taskId) {
      throw new ApiError(400, "Title, Task are required fields.");
    }

    // Create the subtask
    const subtask = await SubTask.create({
      title,
      task: taskId,
      createdBy: user._id,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, subtask, "Subtask created successfully"));
  } catch (error) {
    throw new ApiError(500, "Internal server error while creating subtask.");
  }
});

// getAllSubtasks - Get all subtasks for a task
const getAllSubtasks = asyncHandler(async (req, res) => {
  try {
    const { taskId } = req.params;

    // Fetch all subtasks for the given task
    const subtasks = await SubTask.find({ task: taskId })
      .populate("createdBy", "username email avatar")
      .sort({ createdAt: -1 });

    return res
      .status(200)
      .json(new ApiResponse(200, subtasks, "Subtasks fetched successfully"));
  } catch (error) {
    throw new ApiError(500, "Internal server error while fetching subtasks.");
  }
});

// getSubtaskById - Get a subtask by its ID
const getSubtaskById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the subtask by its ID
    const subtask = await SubTask.findById(id).populate(
      "createdBy",
      "username email avatar",
    );

    if (!subtask) {
      throw new ApiError(404, "Subtask not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, subtask, "Subtask fetched successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      "Internal server error while fetching subtask by ID.",
    );
  }
});

// updateSubtask - Update a subtask
const updateSubtask = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { isCompleted } = req.body;

    // Fetch the subtask by its ID
    const subtask = await SubTask.findById(id);

    if (!subtask) {
      throw new ApiError(404, "Subtask not found");
    }

    // Update the subtask
    subtask.isCompleted = isCompleted || false;
    await subtask.save();

    return res
      .status(200)
      .json(new ApiResponse(200, subtask, "Subtask updated successfully"));
  } catch (error) {
    throw new ApiError(500, "Internal server error while updating subtask.");
  }
});

// deleteSubtask - Delete a subtask
const deleteSubtask = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the subtask by its ID
    const subtask = await SubTask.findById(id);

    if (!subtask) {
      throw new ApiError(404, "Subtask not found");
    }

    // Delete the subtask
    await SubTask.findByIdAndDelete(id);

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Subtask deleted successfully"));
  } catch (error) {
    throw new ApiError(500, "Internal server error while deleting subtask.");
  }
});

export {
  createSubtask,
  getAllSubtasks,
  getSubtaskById,
  updateSubtask,
  deleteSubtask,
};
