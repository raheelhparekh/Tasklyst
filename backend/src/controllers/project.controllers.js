import { Project } from "../models/project.models.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-errors.js";
import { ApiResponse } from "../utils/api-response.js";
import { ProjectMember } from "../models/projectmember.models.js";

// get all projects of user
const getAllProjectsOfUser = asyncHandler(async (req, res) => {
  try {
    const projects = await Project.find({ createdBy: req.user.id })
      .select("name description createdBy") // only return these fields
      .populate("createdBy", "username email avatar"); // populate only these fields from User;

    // console.log("projects from backend:", projects);

    if (!projects || projects.length === 0) {
      throw new ApiError(404, "No projects found for this user");
    }

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

// get project by id
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

// create project
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

// update project
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

// delete project
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

// add member to project
const addMemberToProject = asyncHandler(async (req, res) => {
  try {
    const { userId, role } = req.body;
    const { id: projectId } = req.params;

    if (!userId || !projectId) {
      throw new ApiError(400, "Please provide userId and projectId");
    }

    const project = await Project.findById(projectId);
    if (!project) {
      throw new ApiError(404, "Project with id not found");
    }

    const newMember = await ProjectMember.create({
      user: userId,
      project: projectId,
      role: role || "MEMBER",
    });

    if (!newMember) {
      throw new ApiError(400, "Failed to add member to project.");
    }

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          newMember,
          "Member added to project successfully.",
        ),
      );
  } catch (error) {
    console.error("Error adding member to project:", error);
    throw new ApiError(
      500,
      "Internal server error while adding member to project.",
    );
  }
});

// get all members of project
const getProjectMembers = asyncHandler(async (req, res) => {
  try {
    const { id: projectId } = req.params;
    if (!projectId) {
      throw new ApiError(400, "Please provide a valid project id");
    }

    const membersCount = await ProjectMember.countDocuments({
      project: projectId,
    });
    console.log(`total project member count in ${projectId}: ${membersCount}`);

    // if (!membersCount || membersCount.length === 0) {
    //   throw new ApiError(404, "No members found for this project");
    // }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          membersCount,
          "Project members found successfully.",
        ),
      );
  } catch (error) {
    console.error("Error getting project members:", error);
    throw new ApiError(
      500,
      "Internal server error while getting project members.",
    );
  }
});

// update member role in project
const updateMemberRole = asyncHandler(async (req, res) => {
  try {
    const { id: memberId } = req.params;
    const { role } = req.body;
    if (!memberId || !role) {
      throw new ApiError(400, "Please provide memberId and role");
    }

    const member = await ProjectMember.findById(memberId);
    if (!member) {
      throw new ApiError(404, "Project member with id not found");
    }

    member.role = role;
    await member.save();
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          member,
          "Project member role updated successfully.",
        ),
      );
  } catch (error) {
    console.error("Error updating project members:", error);
    throw new ApiError(
      500,
      "Internal server error while updating project members.",
    );
  }
});

// delete member
const deleteProjectMember = asyncHandler(async (req, res) => {
  try {
    const { id: memberId } = req.params;

    if (!memberId) {
      throw new ApiError(400, "Please provide a valid member id");
    }

    const member = await ProjectMember.findByIdAndDelete(memberId);

    if (!member) {
      throw new ApiError(404, "Project member with id not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Project member deleted successfully."));
  } catch (error) {
    console.error("Error deleting project member:", error);
    throw new ApiError(
      500,
      "Internal server error while deleting project member.",
    );
  }
});

export {
  getAllProjectsOfUser,
  getProjectMembers,
  getProjectById,
  deleteProjectMember,
  deleteProject,
  updateMemberRole,
  addMemberToProject,
  createProject,
  updateProject,
};
