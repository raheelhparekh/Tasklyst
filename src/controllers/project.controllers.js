import { asyncHandler } from "../utils/async-handler.js";

const getProject = asyncHandler(async (req, res) => {});

const getProjectById = asyncHandler(async (req, res) => {});

const createProject = asyncHandler(async (req, res) => {});

const updateProject = asyncHandler(async (req, res) => {});

const deleteProject = asyncHandler(async (req, res) => {});

const addMemberToProject = asyncHandler(async (req, res) => {});

const getProjectMembers = asyncHandler(async (req, res) => {});

const updateProjectMembers = asyncHandler(async (req, res) => {});

const updateMemberRole = asyncHandler(async (req, res) => {});

const deleteMemberRole = asyncHandler(async (req, res) => {});

export {
  getProject,
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
