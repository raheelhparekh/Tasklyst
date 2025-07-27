import { Project } from "../models/project.models.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-errors.js";
import { ApiResponse } from "../utils/api-response.js";
import { ProjectMember } from "../models/projectmember.models.js";
import { Task } from "../models/task.models.js";
import { User } from "../models/user.models.js";
import { Note } from "../models/note.models.js";
import { UserRolesEnums } from "../utils/constants.js";
import mongoose from "mongoose";

// Helper function to validate ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// get all projects of user
const getAllProjectsOfUser = asyncHandler(async (req, res) => {
  // TODO: Add pagination to avoid fetching too many projects at once
  const createdProjects = await Project.find({ createdBy: req.user.id })
    .select("name description createdBy createdAt")
    .populate("createdBy", "username email avatar");

  const projectsWithRoles = createdProjects.map((proj) => ({
    ...proj.toObject(),
    role: "project_admin",
  }));

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

  const assignedWithRoles = assignedProjects.map((item) => ({
    ...item.project.toObject(),
    role: item.role,
  }));

  const allProjects = [...projectsWithRoles, ...assignedWithRoles];
  const uniqueProjects = Array.from(
    new Map(allProjects.map((proj) => [proj._id.toString(), proj])).values(),
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        uniqueProjects,
        "All User Projects found successfully.",
      ),
    );
});

// get project by id
const getProjectById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(400, "Please provide a valid id");
  }

  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid project id format");
  }

  const project = await Project.findById(id);
  if (!project) {
    throw new ApiError(404, "Project with id not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project with id found successfully."));
});

// create project -> user who creates, role will become project_admin
const createProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    throw new ApiError(400, "All fields are required");
  }

  const nameTrimmed = name.trim();
  const existingProject = await Project.findOne({
    name: nameTrimmed,
    createdBy: req.user.id,
  });

  if (existingProject) {
    throw new ApiError(400, "Project with this name already exists.");
  }

  const projectCreated = await Project.create({
    name: nameTrimmed,
    description: description?.trim(),
    createdBy: req.user.id,
  });

  if (!projectCreated) {
    throw new ApiError(500, "Project creation failed.");
  }

  await ProjectMember.create({
    project: projectCreated._id,
    user: req.user.id,
    role: UserRolesEnums.PROJECT_ADMIN,
  });

  const project = await Project.findById(projectCreated._id)
    .select("name description createdBy createdAt")
    .populate("createdBy", "username email avatar");

  return res
    .status(201)
    .json(new ApiResponse(201, project, "Project created successfully."));
});

// update project
const updateProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const { id } = req.params;
  if (!id) {
    throw new ApiError(400, "Please provide a valid id");
  }

  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid project id format");
  }

  const project = await Project.findById(id);
  if (!project) {
    throw new ApiError(404, "Project with id not found");
  }

  // Role-based check: Only project creator or admin can update
  if (
    req.userProjectRole === "project_admin" &&
    project.createdBy.toString() !== req.user.id
  ) {
    throw new ApiError(
      403,
      "Project admins can only update projects they created",
    );
  }

  if (name) project.name = name.trim();
  if (description) project.description = description.trim();
  await project.save();

  const updated = await Project.findById(project._id)
    .select("name description createdBy createdAt")
    .populate("createdBy", "username email avatar");

  return res
    .status(200)
    .json(new ApiResponse(200, updated, "Project updated successfully."));
});

// delete project
const deleteProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(400, "Please provide a valid id");
  }

  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid project id format");
  }

  const project = await Project.findById(id);
  if (!project) {
    throw new ApiError(404, "Project with id not found");
  }

  // Role-based check: Only project creator can delete
  if (project.createdBy.toString() !== req.user.id) {
    throw new ApiError(403, "Only the project creator can delete this project");
  }

  await Project.findByIdAndDelete(id);

  await ProjectMember.deleteMany({ project: id });
  await Task.deleteMany({ project: id });
  await Note.deleteMany({ project: id });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Project deleted successfully."));
});

// add member to project
const addMemberToProject = asyncHandler(async (req, res) => {
  const { email, role } = req.body;
  const { id: projectId } = req.params;

  const user = req.user;
  console.log("User adding member:", user);

  if (!email || !projectId) {
    throw new ApiError(400, "Please provide email and projectId");
  }

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project with id not found");
  }

  const userAdding = await User.findOne({ email });
  if (!userAdding) {
    throw new ApiError(
      404,
      "User with email not found. Please invite them to create their account in Tasklyst.",
    );
  }

  // Prevent adding self to project
  if (userAdding._id.toString() === req.user.id) {
    throw new ApiError(400, "You cannot add yourself to the project.");
  }

  if (project.createdBy.toString() === userAdding._id.toString()) {
    throw new ApiError(400, "Creator is already a member of the project.");
  }

  const validRoles = [UserRolesEnums.ADMIN, UserRolesEnums.MEMBER];
  if (role && !validRoles.includes(role)) {
    throw new ApiError(400, "Invalid role provided. Only 'admin' or 'member' roles can be assigned.");
  }

  // Prevent assigning project_admin role - only the creator can have this role
  if (role === UserRolesEnums.PROJECT_ADMIN) {
    throw new ApiError(400, "project_admin role can only be held by the project creator");
  }

  // Role validation: only project_admin can assign admin role
  if (role === UserRolesEnums.ADMIN && req.userProjectRole !== UserRolesEnums.PROJECT_ADMIN && req.userProjectRole !== UserRolesEnums.ADMIN) {
    throw new ApiError(403, "Only project_admin or existing admins can assign admin role");
  }

  const existingMember = await ProjectMember.findOne({
    user: userAdding._id,
    project: projectId,
  });
  if (existingMember) {
    throw new ApiError(400, "User is already a member of this project.");
  }

  const newMember = await ProjectMember.create({
    user: userAdding._id,
    project: projectId,
    role: role || "member",
  });

  if (!newMember) {
    throw new ApiError(400, "Failed to add member to project.");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(201, newMember, "Member added to project successfully."),
    );
});

// get count of all project members, admins
const getProjectMembers = asyncHandler(async (req, res) => {
  const { id: projectId } = req.params;
  if (!projectId) {
    throw new ApiError(400, "Please provide a valid project id");
  }

  const membersCount = await ProjectMember.countDocuments({
    project: projectId,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, membersCount, "Project members found successfully."),
    );
});

// update member role in project -> only project admins can update member roles
const updateMemberRole = asyncHandler(async (req, res) => {
  const { id: memberId } = req.params;
  const { role } = req.body;
  if (!memberId || !role) {
    throw new ApiError(400, "Please provide memberId and role");
  }

  // Use pre-fetched member if available (from middleware), otherwise fetch it
  const member = req.targetMember || await ProjectMember.findById(memberId);
  if (!member) {
    throw new ApiError(404, "Project member with id not found");
  }

  const validRoles = [UserRolesEnums.ADMIN, UserRolesEnums.MEMBER];
  if (!validRoles.includes(role)) {
    throw new ApiError(400, "Invalid role provided. Only 'admin' or 'member' roles can be assigned.");
  }

  // Prevent assigning project_admin role - only the creator can have this role
  if (role === UserRolesEnums.PROJECT_ADMIN) {
    throw new ApiError(400, "project_admin role can only be held by the project creator");
  }

  // Get the project to check if the member being updated is the creator
  const project = await Project.findById(member.project);
  if (project && project.createdBy.toString() === member.user.toString()) {
    throw new ApiError(400, "Cannot modify the role of the project creator");
  }

  // Role validation: only project_admin or existing admins can assign admin role
  if (role === UserRolesEnums.ADMIN && req.userProjectRole !== UserRolesEnums.PROJECT_ADMIN && req.userProjectRole !== UserRolesEnums.ADMIN) {
    throw new ApiError(403, "Only project_admin or existing admins can assign admin role");
  }

  // Prevent self-role modification for safety
  if (member.user.toString() === req.user.id) {
    throw new ApiError(400, "You cannot modify your own role");
  }

  member.role = role;
  await member.save();
  return res
    .status(200)
    .json(
      new ApiResponse(200, member, "Project member role updated successfully."),
    );
});

// delete member from project
const deleteProjectMember = asyncHandler(async (req, res) => {
  const { id: memberId } = req.params;

  if (!memberId) {
    throw new ApiError(400, "Please provide a valid member id");
  }

  // Use pre-fetched member if available (from middleware), otherwise fetch it
  const member = req.targetMember || await ProjectMember.findById(memberId);
  if (!member) {
    throw new ApiError(404, "Project member with id not found");
  }

  if (member.user.toString() === req.user.id) {
    throw new ApiError(400, "You cannot remove yourself from the project.");
  }

  // Check if trying to remove project creator
  const project = await Project.findById(member.project);
  if (project && project.createdBy.toString() === member.user.toString()) {
    throw new ApiError(400, "Cannot remove project creator from the project.");
  }

  await ProjectMember.findByIdAndDelete(memberId);

  await Task.deleteMany({
    project: member.project,
    assignedTo: member.user,
  });

  await Note.deleteMany({
    project: member.project,
    createdBy: member.user,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Project member deleted successfully."));
});

// get all project members details -> username, email, avatar, project role
const getAllProjectMembersDetails = asyncHandler(async (req, res) => {
  const { id: projectId } = req.params;
  if (!projectId) {
    throw new ApiError(400, "Please provide a valid project id");
  }

  // Permission already checked by middleware

  const members = await ProjectMember.find({ project: projectId }).populate(
    "user",
    "username email avatar",
  );

  // Add project creator as admin if not already in members
  const project = await Project.findById(projectId).populate(
    "createdBy",
    "username email avatar",
  );

  const creatorAsMember = members.find(
    (m) => m.user._id.toString() === project.createdBy._id.toString(),
  );

  if (!creatorAsMember && project.createdBy) {
    // Add creator as project_admin if not in members list
    const creatorMemberData = {
      _id: null, // No actual ProjectMember document
      user: project.createdBy,
      role: "project_admin",
      project: projectId,
      isCreator: true,
    };
    members.unshift(creatorMemberData);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, members, "Project members found successfully."));
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
