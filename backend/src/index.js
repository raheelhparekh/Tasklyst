import dotenv from "dotenv";
import app from "./app.js";
import connectDb from "./db/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import logger from "./utils/logger.js";

import authRoutes from "./routes/auth.routes.js";
import projectRoutes from "./routes/project.routes.js";
import noteRoutes from "./routes/note.routes.js";
import taskRoutes from "./routes/task.routes.js";
import subtaskRoutes from "./routes/subtask.routes.js";
import { errorHandler } from "./middlewares/error.middlewares.js";
import { requestLogger } from "./middlewares/request-logger.middlewares.js";

dotenv.config();

// Validate critical environment variables
const requiredEnvVars = [
  'MONGO_URI',
  'ACCESS_TOKEN_SECRET', 
  'REFRESH_TOKEN_SECRET',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
  logger.error('Missing required environment variables:', missingEnvVars);
  process.exit(1);
}

// const allowedOrigins =
//   process.env.NODE_ENV === "production"
//     ? [
//         process.env.BASE_URL,
//         "https://tasklyst-one.vercel.app", // Main domain
//         /^https:\/\/tasklyst.*\.vercel\.app$/, // Any tasklyst deployment
//         /^https:\/\/.*-raheelhparekhs-projects\.vercel\.app$/ // Your project deployments
//       ]
//     : ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"];

app.use(
  cors({
    origin: process.env.NODE_ENV === "production" 
      ? [
          process.env.BASE_URL,
          "https://tasklyst-one.vercel.app",
          /^https:\/\/tasklyst.*\.vercel\.app$/,
          /^https:\/\/.*-raheelhparekhs-projects\.vercel\.app$/
        ]
      : [
          "http://localhost:5173",
          "http://localhost:5174", 
          "http://localhost:3000"
        ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    credentials: true,
  }),
);

app.use(express.json()); // accepts json values
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Request logging middleware
app.use(requestLogger);

// Security headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

const PORT = process.env.PORT || 8000;

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/project", projectRoutes);
app.use("/api/v1/note", noteRoutes);
app.use("/api/v1/task", taskRoutes);
app.use("/api/v1/subtask", subtaskRoutes);

app.use(errorHandler);

connectDb()
  .then(() => {
    app.listen(PORT, () => logger.info(`🚀 Server is running on Port: ${PORT}`));
  })
  .catch((err) => {
    logger.error("MongoDB connection error:", err);
    process.exit(1);
  });
