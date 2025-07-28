import { RolePermissions, UserRolesEnums } from "../utils/constants.js";
import { ApiError } from "../utils/api-errors.js";
import { ProjectMember } from "../models/projectmember.models.js";
import { Project } from "../models/project.models.js";
import { Task } from "../models/task.models.js";
import { Note } from "../models/note.models.js";
import mongoose from "mongoose";

/**
 * Get user's role in a specific project
 */
export const getUserProjectRole = async (userId, projectId) => {
  try {
    // Ensure we're working with string representations for comparison
    const userIdStr = userId.toString();
    const projectIdStr = projectId.toString();

    console.log("getUserProjectRole called:", { userIdStr, projectIdStr });

    // Check if user is the project creator (automatically project_admin)
    const project = await Project.findById(projectIdStr);
    console.log("Project found:", project ? { createdBy: project.createdBy.toString() } : "null");
    
    if (project && project.createdBy.toString() === userIdStr) {
      console.log("User is project creator - returning PROJECT_ADMIN");
      return UserRolesEnums.PROJECT_ADMIN;
    }

    // Check if user is a member with specific role
    const member = await ProjectMember.findOne({
      user: userIdStr,
      project: projectIdStr
    });
    console.log("Member found:", member ? { role: member.role } : "null");

    if (member) {
      console.log("Returning member role:", member.role);
      return member.role;
    }

    console.log("No role found - returning null");
    return null;
  } catch (error) {
    console.error("Error getting user project role:", error);
    return null;
  }
};

/**
 * Check if user has specific permission in a project
 */
export const hasPermission = (userRole, permission) => {
  if (!userRole || !RolePermissions[userRole]) {
    return false;
  }
  return RolePermissions[userRole][permission] || false;
};

/**
 * Middleware to check project-level permissions
 */
export const checkProjectPermission = (permission) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;
      const projectId = req.params.id || req.params.projectId || req.body.projectId;

      if (!projectId) {
        throw new ApiError(400, "Project ID is required");
      }

      if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new ApiError(400, "Invalid project ID format");
      }

      // Get user's role in this project
      const userRole = await getUserProjectRole(userId, projectId);
      
      if (!userRole) {
        throw new ApiError(403, "You are not a member of this project");
      }

      // Check if user has the required permission
      if (!hasPermission(userRole, permission)) {
        throw new ApiError(403, `Insufficient permissions. Required: ${permission}`);
      }

      // Add role to request object for further use
      req.userProjectRole = userRole;
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware to check task-level permissions
 */
export const checkTaskPermission = (permission) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;
      const taskId = req.params.id || req.params.taskId;

      if (!taskId) {
        throw new ApiError(400, "Task ID is required");
      }

      if (!mongoose.Types.ObjectId.isValid(taskId)) {
        throw new ApiError(400, "Invalid task ID format");
      }

      // Get the task to find its project
      const task = await Task.findById(taskId);
      if (!task) {
        throw new ApiError(404, "Task not found");
      }

      // Get user's role in the task's project
      const userRole = await getUserProjectRole(userId, task.project);
      
      if (!userRole) {
        throw new ApiError(403, "You are not a member of this project");
      }

      // Special case for members - they can update/delete only their own tasks or assigned tasks
      if (userRole === UserRolesEnums.MEMBER) {
        if (permission === 'canUpdateTask' || permission === 'canDeleteTask') {
          const isTaskOwner = task.assignedBy.toString() === userId;
          const isAssignedUser = task.assignedTo.toString() === userId;
          
          if (!isTaskOwner && !isAssignedUser) {
            throw new ApiError(403, "You can only modify your own tasks or tasks assigned to you");
          }
        }
      }

      // Check if user has the required permission
      if (!hasPermission(userRole, permission)) {
        throw new ApiError(403, `Insufficient permissions. Required: ${permission}`);
      }

      req.userProjectRole = userRole;
      req.task = task;
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware to check note-level permissions
 */
export const checkNotePermission = (permission) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;
      const noteId = req.params.id || req.params.noteId;
      const projectId = req.params.projectId;

      if (!noteId && !projectId) {
        throw new ApiError(400, "Note ID or Project ID is required");
      }

      let note, userRole;

      if (noteId) {
        if (!mongoose.Types.ObjectId.isValid(noteId)) {
          throw new ApiError(400, "Invalid note ID format");
        }

        note = await Note.findById(noteId);
        if (!note) {
          throw new ApiError(404, "Note not found");
        }

        userRole = await getUserProjectRole(userId, note.project);
      } else {
        userRole = await getUserProjectRole(userId, projectId);
      }

      if (!userRole) {
        throw new ApiError(403, "You are not a member of this project");
      }

      // Special case for members - they can update/delete only their own notes
      if (note && userRole === UserRolesEnums.MEMBER) {
        if (permission === 'canUpdateNote' || permission === 'canDeleteNote') {
          const isNoteOwner = note.createdBy.toString() === userId;
          
          if (!isNoteOwner) {
            throw new ApiError(403, "You can only modify your own notes");
          }
        }
      }

      // Check if user has the required permission
      if (!hasPermission(userRole, permission)) {
        throw new ApiError(403, `Insufficient permissions. Required: ${permission}`);
      }

      req.userProjectRole = userRole;
      if (note) req.note = note;
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware to check if user can manage project members
 */
export const checkMemberManagementPermission = (permission) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;
      const projectId = req.params.id || req.params.projectId;

      console.log("checkMemberManagementPermission called:", { userId, projectId, permission });

      if (!projectId) {
        throw new ApiError(400, "Project ID is required");
      }

      const userRole = await getUserProjectRole(userId, projectId);
      console.log("User role found:", userRole);
      
      if (!userRole) {
        throw new ApiError(403, "You are not a member of this project");
      }

      // Only admins and project_admins can manage members
      const hasRequiredPermission = hasPermission(userRole, permission);
      console.log("Permission check:", { userRole, permission, hasRequiredPermission });
      
      if (!hasRequiredPermission) {
        throw new ApiError(403, "You don't have permission to manage project members");
      }

      req.userProjectRole = userRole;
      next();
    } catch (error) {
      console.error("Error in checkMemberManagementPermission:", error);
      next(error);
    }
  };
};

/**
 * Middleware to check if user can manage a specific project member
 * This is for routes where :id refers to memberId, not projectId
 */
export const checkMemberLevelPermission = (permission) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;
      const memberId = req.params.id;

      console.log("checkMemberLevelPermission called:", { userId, memberId, permission });

      if (!memberId) {
        throw new ApiError(400, "Member ID is required");
      }

      // Get the member to find the project
      const member = await ProjectMember.findById(memberId);
      if (!member) {
        throw new ApiError(404, "Project member not found");
      }

      const projectId = member.project;
      console.log("Found project ID from member:", projectId);

      const userRole = await getUserProjectRole(userId, projectId);
      console.log("User role found:", userRole);
      
      if (!userRole) {
        throw new ApiError(403, "You are not a member of this project");
      }

      // Only admins and project_admins can manage members
      const hasRequiredPermission = hasPermission(userRole, permission);
      console.log("Permission check:", { userRole, permission, hasRequiredPermission });
      
      if (!hasRequiredPermission) {
        throw new ApiError(403, "You don't have permission to manage project members");
      }

      req.userProjectRole = userRole;
      req.targetMember = member; // Pass the member info to the controller
      next();
    } catch (error) {
      console.error("Error in checkMemberLevelPermission:", error);
      next(error);
    }
  };
};

export { RolePermissions, UserRolesEnums };
