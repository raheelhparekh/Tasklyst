import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/api-errors.js";

export const isLoggedIn = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = req.cookies || {};

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    let user;

    // CASE 1: Access token exists
    if (accessToken) {
      try {
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        user = await User.findById(decoded._id);
        if (!user) throw new ApiError(401, "No user found with this access token.");
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
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        user = await User.findById(decoded._id);
        if (!user) throw new ApiError(401, "No user found with this refresh token.");

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
