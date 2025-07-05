import Router from "express";
import {
  createSubtask,
  getAllSubtasks,
  getSubtaskById,
  updateSubtask,
  deleteSubtask,
} from "../controllers/subtask.controllers.js";
import { isLoggedIn } from "../middlewares/auth.middlewares.js";


const subtaskRoutes = Router();

subtaskRoutes.post(
  "/create-subtask/:taskId",
  isLoggedIn,
  createSubtask,
);

subtaskRoutes.get("/all-subtasks/:taskId", isLoggedIn, getAllSubtasks);

subtaskRoutes.get("/subtask/:id", isLoggedIn, getSubtaskById);

subtaskRoutes.put(
  "/update-subtask/:id",
  isLoggedIn,
  updateSubtask,
);

subtaskRoutes.delete("/delete-subtask/:id", isLoggedIn, deleteSubtask);

export default subtaskRoutes;
