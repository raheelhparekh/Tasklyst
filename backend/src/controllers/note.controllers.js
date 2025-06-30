import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-errors.js";
import { ApiResponse } from "../utils/api-response.js";
import { Project } from "../models/project.models.js";
import { Note } from "../models/note.models.js";
import mongoose from "mongoose";

const getProjectNotes = asyncHandler(async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!projectId) {
      throw new ApiError(400, "Please provide a valid project ID");
    }

    const project = await Project.findById(projectId);
    if (!project) {
      throw new ApiError(404, "Project with id not found");
    }

    const notes = await Note.find({
      project: new mongoose.Types.ObjectId(projectId),
    }).populate("createdBy", "username email avatar");

    return res
      .status(200)
      .json(new ApiResponse(200,  notes, "Notes retrieved successfully"));
  } catch (error) {
    console.error("Error getting notes:", error);
    throw new ApiError(500, "Internal server error while getting notes.");
  }
});

const getNoteById = asyncHandler(async (req, res) => {
  try {
    const { noteId } = req.params;

    if (!noteId) {
      throw new ApiError(400, "Please provide a valid note ID");
    }

    const note = await Note.findById(noteId).populate(
      "createdBy",
      "username email avatar",
    );
    // if (!note) {
    //   throw new ApiError(404, "Note not found");
    // }

    return res
      .status(200)
      .json(new ApiResponse(200, note, "Note retrieved successfully" ));
  } catch (error) {
    console.error("Error getting note by ID:", error);
    throw new ApiError(500, "Internal server error while getting note by ID.");
  }
});

const createNote = asyncHandler(async (req, res) => {
  try {
    const { projectId } = req.params;
    const { content } = req.body;

    if (!projectId || !content) {
      throw new ApiError(400, "Project ID and content are required");
    }

    const project = await Project.findById(projectId);
    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    const note = await Note.create({
      project: new mongoose.Types.ObjectId(projectId),
      createdBy: new mongoose.Types.ObjectId(req.user.id),
      content,
    });

    const createdNote = await Note.findById(note._id).populate(
      "createdBy",
      "username email avatar",
    );

    return res
      .status(200)
      .json(new ApiResponse(200, createdNote, "Note created successfully" ));
  } catch (error) {
    console.error("Error creating note:", error);
    throw new ApiError(500, "Internal server error while creating note.");
  }
});

const updateNote = asyncHandler(async (req, res) => {
  try {
    const { noteId } = req.params;
    const { content } = req.body;

    if (!noteId) {
      throw new ApiError(400, "Please provide a valid note ID");
    }

    const existingNote = await Note.findById(noteId);
    if (!existingNote) {
      throw new ApiError(404, "Note not found");
    }

    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      { content },
      { new: true }, // will return the updated data with note
    ).populate("createdBy", "username email avatar");

    return res
      .status(200)
      .json(new ApiResponse(200,  updatedNote, "Note updated successfully"));
  
    } catch (error) {
    console.error("Error updating note:", error);
    throw new ApiError(500, "Internal server error while updating note.");
  }
});

const deleteNote = asyncHandler(async (req, res) => {
  try {
    const { noteId } = req.params;

    if (!noteId) {
      throw new ApiError(400, "Please provide a valid note ID");
    }

    const existingNote = await Note.findById(noteId);
    if (!existingNote) {
      throw new ApiError(404, "Note not found");
    }

    await Note.findByIdAndDelete(noteId);
    return res
      .status(200)
      .json(new ApiResponse(200, "Note deleted successfully"));
  
    } catch (error) {
    console.error("Error deleting note:", error);
    throw new ApiError(500, "Internal server error while deleting note.");
  }
});

export {
  getProjectNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
};
