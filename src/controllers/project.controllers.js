import { Project } from "../models/project.models.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-errors.js";
import { ApiResponse } from "../utils/api-response.js";

const getAllProjectsOfUser = asyncHandler(async (req, res) => {
  try {
    const projects = await Project.find({ createdBy: req.user.id });
    return res
      .status(200)
      .json(
        new ApiResponse(200, projects, "All User Projects found successfully."),
      );
  } catch (error) {
    console.error("Error getting projects:", error);
    throw new ApiError(500, "Internal server error while getting projects.");
  }
});

const getProjectById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new ApiError(400, "Please provide a valid id");
    }

    const project = await Project.findById(id);
    if (!project) {
      throw new ApiError(404, "Project with id not found");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, project, "Project with id found successfully."),
      );
  } catch (error) {
    console.error("Error getting project by id:", error);
    throw new ApiError(
      500,
      "Internal server error while getting project with id.",
    );
  }
});

const createProject = asyncHandler(async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      throw new ApiError(400, "Please provide all required fields");
    }

    const project = await Project.create({
      name,
      description,
      createdBy: req.user.id,
    });
    if (!project) {
      throw new ApiError(400, "Project creation failed.");
    }

    return res
      .status(201)
      .json(new ApiResponse(201, project, "Project created successfully."));
  } catch (error) {
    console.error("Error creating project:", error);
    throw new ApiError(500, "Internal server error while creating project.");
  }
});

const updateProject = asyncHandler(async (req, res) => {
  try {
    const { name, description } = req.body;
    const { id } = req.params;
    if (!id) {
      throw new ApiError(400, "Please provide a valid id");
    }

    const project = await Project.findById(id);
    if (!project) {
      throw new ApiError(404, "Project with id not found");
    }

    project.name = name;
    project.description = description;
    await project.save();

    return res
      .status(200)
      .json(new ApiResponse(200, project, "Project updated successfully."));
  } catch (error) {
    console.error("Error updating project:", error);
    throw new ApiError(500, "Internal server error while updating project.");
  }
});

const deleteProject = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new ApiError(400, "Please provide a valid id");
    }

    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      throw new ApiError(404, "Project with id not found");
    }
    
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Project deleted successfully."));
  } catch (error) {
    console.error("Error deleting project:", error);
    throw new ApiError(500, "Internal server error while deleting project.");
  }
});

const addMemberToProject = asyncHandler(async (req, res) => {});

const getProjectMembers = asyncHandler(async (req, res) => {});

const updateProjectMembers = asyncHandler(async (req, res) => {});

const updateMemberRole = asyncHandler(async (req, res) => {});

const deleteMemberRole = asyncHandler(async (req, res) => {});

export {
  getAllProjectsOfUser,
  getProjectMembers,
  getProjectById,
  deleteMemberRole,
  deleteProject,
  updateMemberRole,
  updateProjectMembers,
  updateMemberRole,
  addMemberToProject,
  createProject,
  updateProject,
};
