import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/api-errors.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ProjectMember } from "../models/projectmember.models.js";
import mongoose from "mongoose";
import { Task } from "../models/task.models.js";

export const isLoggedIn = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = req.cookies || {};

    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction, // false in dev, true in prod
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: isProduction ? "strict" : "lax", // lax allows smoother local dev
    };

    let user;

    // CASE 1: Access token exists
    if (accessToken) {
      try {
        const decoded = jwt.verify(
          accessToken,
          process.env.ACCESS_TOKEN_SECRET,
        );
        user = await User.findById(decoded._id);
        if (!user)
          throw new ApiError(401, "No user found with this access token.");
      } catch (err) {
        // If access token fails, try refresh token fallback
        if (!refreshToken) {
          throw new ApiError(401, "Session expired. Please log in again.");
        }
      }
    }

    // CASE 2: Access token missing or invalid, use refresh token
    if (!user && refreshToken) {
      try {
        const decoded = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET,
        );
        user = await User.findById(decoded._id);
        if (!user)
          throw new ApiError(401, "No user found with this refresh token.");

        // Generate new tokens
        const newAccessToken = await user.generateAccessToken();
        const newRefreshToken = await user.generateRefreshToken();
        user.refreshToken = newRefreshToken;
        await user.save();

        res.cookie("accessToken", newAccessToken, cookieOptions);
        res.cookie("refreshToken", newRefreshToken, cookieOptions);
      } catch (err) {
        throw new ApiError(401, "Invalid or expired refresh token.");
      }
    }

    if (!user) {
      throw new ApiError(401, "Unauthorized. Please log in.");
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    const status = err.statuscode || 500;
    return res.status(status).json({
      success: false,
      message: err.message || "Authentication failed.",
    });
  }
};

export const validateProjectPermission = (roles = []) =>
  asyncHandler(async (req, res, next) => {
    let projectId = req.params.projectId;

    // Try to resolve projectId from task/note/subtask if not directly present
    if (!projectId) {
      const taskId  = req.params.taskId;
      console.log("Task ID:", taskId);

      let task;
      if (taskId ) {
        task = await Task.findById(taskId).select("project");
        if(!task) {
          throw new ApiError(404, "Task not found with this id");
        }
        console.log("Task:", task);
      }

      if (task?.project) {
        projectId = task.project.toString();
      }
    }

    // if (!projectId) {
    //   throw new ApiError(400, "Project ID could not be resolved.");
    // }

    const projectMember = await ProjectMember.findOne({
      project: new mongoose.Types.ObjectId(projectId),
      user: new mongoose.Types.ObjectId(req.user.id),
    });

    // console.log("Project Member:", projectMember);

    if (!projectMember) {
      throw new ApiError(403, "You are not a member of this project");
    }

    const givenRole = projectMember.role;
    req.projectMemberRole = givenRole;  // clearer than req.projectMember
    req.projectId = projectId;
    if (!roles.includes(givenRole)) {
      throw new ApiError(
        403,
        "You do not have permission to perform this action"
      );
    }

    next();
});
