import dotenv from "dotenv";
import app from "./app.js";
import connectDb from "./db/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import authRoutes from "./routes/auth.routes.js";
import projectRoutes from "./routes/project.routes.js";
import noteRoutes from "./routes/note.routes.js";
import taskRoutes from "./routes/task.routes.js";
import subtaskRoutes from "./routes/subtask.routes.js";
import { errorHandler } from "./middlewares/error.middlewares.js";

dotenv.config({
  path: "./.env",
});

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [process.env.FRONTEND_URL]
    : ["http://localhost:5173", "http://localhost:3000"];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(express.json()); // accepts json values
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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
    app.listen(PORT, () => console.log(`Server is running on Port : ${PORT}`));
  })
  .catch((err) => {
    console.error("mongo db connection error", err);
    process.exit(1);
  });
