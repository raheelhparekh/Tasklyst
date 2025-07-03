import { Project } from "../models/project.models.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-errors.js";
import { ApiResponse } from "../utils/api-response.js";
import { ProjectMember } from "../models/projectmember.models.js";
import { Task } from "../models/task.models.js";
import { User } from "../models/user.models.js";

// get all projects of user
const getAllProjectsOfUser = asyncHandler(async (req, res) => {
  try {
    // Projects created by user
    const createdProjects = await Project.find({ createdBy: req.user.id })
      .select("name description createdBy createdAt")
      .populate("createdBy", "username email avatar");

    // Add role = "ADMIN" to created projects manually
    const projectsWithRoles = createdProjects.map((proj) => ({
      ...proj.toObject(),
      role: "admin",
    }));

    // console.log("projectsWithRoles", projectsWithRoles);

    // Assigned projects
    const assignedProjects = await ProjectMember.find({
      user: req.user.id,
    })
      .populate({
        path: "project",
        select: "name description createdBy createdAt",
        populate: {
          path: "createdBy",
          select: "username email avatar",
        },
      })
      .select("project user role");

    // Add role from ProjectMember to project
    const assignedWithRoles = assignedProjects.map((item) => ({
      ...item.project.toObject(),
      role: item.role,
    }));

    // console.log("assignedWithRoles", assignedWithRoles);

    // Merge and deduplicate by project ID
    const allProjects = [...projectsWithRoles, ...assignedWithRoles];
    const uniqueProjects = Array.from(
      new Map(allProjects.map((proj) => [proj._id.toString(), proj])).values(),
    );

    // console.log("uniqueProjects", uniqueProjects);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          uniqueProjects,
          "All User Projects found successfully.",
        ),
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

    // Check if project with the same name already exists
    const existingProject = await Project.findOne({
      name,
      createdBy: req.user.id,
    });
    if (existingProject) {
      throw new ApiError(400, "Project with this name already exists.");
    }

    // Create the project
    const projectCreated = await Project.create({
      name,
      description,
      createdBy: req.user.id,
    });

    if (!projectCreated) {
      throw new ApiError(400, "Project creation failed.");
    }

    // Automatically add the creator as a member of the project
    await ProjectMember.create({
      project: projectCreated._id,
      user: req.user.id,
      role: "admin",
    });

    const project = await Project.findById(projectCreated._id)
      .select("name description createdBy createdAt")
      .populate("createdBy", "username email avatar");

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

    const projectUpdated = await Project.findById(id);
    if (!project) {
      throw new ApiError(404, "Project with id not found");
    }

    projectUpdated.name = name;
    projectUpdated.description = description;
    await projectUpdated.save();

    const project = await Project.findById(projectUpdated._id)
      .select("name description createdBy createdAt")
      .populate("createdBy", "username email avatar");

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

    // delete all project members associated with this project and their tasks and thier notes
    await ProjectMember.deleteMany({ project: id });
    await Task.deleteMany({ project: id });
    await Note.deleteMany({ project: id });

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Project deleted successfully."));
  } catch (error) {
    console.error("Error deleting project:", error);
    throw new ApiError(500, "Internal server error while deleting project.");
  }
});

// add member to project, add member by entering email and role
const addMemberToProject = asyncHandler(async (req, res) => {
  try {
    const { email, role } = req.body;
    const { id: projectId } = req.params;

    if (!email || !projectId) {
      throw new ApiError(400, "Please provide email and projectId");
    }

    const project = await Project.findById(projectId);
    if (!project) {
      throw new ApiError(404, "Project with id not found");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "User with email not found");
    }

    // check if user is already a member of the project
    const existingMember = await ProjectMember.findOne({
      user: user._id,
      project: projectId,
    });
    if (existingMember) {
      throw new ApiError(400, "User is already a member of this project.");
    }

    const newMember = await ProjectMember.create({
      user: user._id,
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
    // console.log(`total project member count in ${projectId}: ${membersCount}`);

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

// delete member from project
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

    // console.log("member deleted:", member.project);
    // console.log("member user:", member.user);
    // console.log("member user id:", member.user._id);

    // delete the tasks also associated with this member
    await Task.deleteMany({
      project: member.project,
      assignedTo: member.user,
    });

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

// get all project members details - username, email, avatar
const getAllProjectMembersDetails = asyncHandler(async (req, res) => {
  try {
    const { id: projectId } = req.params;
    if (!projectId) {
      throw new ApiError(400, "Please provide a valid project id");
    }

    const members = await ProjectMember.find({ project: projectId }).populate(
      "user",
      "username email avatar",
    );

    // console.log(`Project members for ${projectId}:`, members);

    return res
      .status(200)
      .json(
        new ApiResponse(200, members, "Project members found successfully."),
      );
  } catch (error) {
    console.error("Error getting project members:", error);
    throw new ApiError(
      500,
      "Internal server error while getting project members.",
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
  getAllProjectMembersDetails,
};
