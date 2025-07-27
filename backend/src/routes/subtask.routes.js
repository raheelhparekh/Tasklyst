import Router from "express";
import {
  createSubtask,
  getAllSubtasks,
  getSubtaskById,
  updateSubtask,
  deleteSubtask,
} from "../controllers/subtask.controllers.js";
import { isLoggedIn } from "../middlewares/auth.middlewares.js";
import { checkTaskPermission } from "../middlewares/rbac.middlewares.js";

const subtaskRoutes = Router();

subtaskRoutes.post(
  "/create-subtask/:taskId",
  isLoggedIn,
  checkTaskPermission('canCreateSubtask'),
  createSubtask,
);

subtaskRoutes.get(
  "/all-subtasks/:taskId", 
  isLoggedIn, 
  checkTaskPermission('canViewSubtask'),
  getAllSubtasks
);

subtaskRoutes.get(
  "/subtask/:id", 
  isLoggedIn, 
  // Note: This would need a specific subtask permission middleware
  getSubtaskById
);

subtaskRoutes.put(
  "/update-subtask/:id",
  isLoggedIn,
  // Note: This would need specific subtask permission checking
  updateSubtask,
);

subtaskRoutes.delete(
  "/delete-subtask/:id", 
  isLoggedIn, 
  // Note: This would need specific subtask permission checking
  deleteSubtask
);

export default subtaskRoutes;
