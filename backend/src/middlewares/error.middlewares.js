import mongoose from "mongoose";
import logger from "../utils/logger.js";

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Log the error with appropriate level
  if (statusCode >= 500) {
    logger.error(`${req.method} ${req.url} - ${statusCode} - ${message}`, {
      error: err.stack,
      body: req.body,
      user: req.user?.email
    });
  } else {
    logger.warn(`${req.method} ${req.url} - ${statusCode} - ${message}`, {
      user: req.user?.email
    });
  }

  // Handle specific types of errors
  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = Object.values(err.errors).map(error => error.message).join(', ');
  } else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = "Invalid ID format";
  } else if (err.code === 11000) {
    // Duplicate key error
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = "Invalid token";
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = "Token expired";
  }

  // Log error for debugging (but don't expose sensitive information)
  if (process.env.NODE_ENV === "development") {
  }

  return res.status(statusCode).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export { errorHandler };