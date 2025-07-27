import Router from "express";
import {
  createTask,
  updateTaskStatus,
  deleteTask,
  addAttachmentsToTask,
  getAllTasksOfProject,
  getTaskById,
  getAllTaskAssignedToUser,
} from "../controllers/task.controllers.js";
import { isLoggedIn } from "../middlewares/auth.middlewares.js";
import { 
  checkProjectPermission, 
  checkTaskPermission 
} from "../middlewares/rbac.middlewares.js";
import upload from "../middlewares/multer.middlewares.js";

const taskRoutes = Router();

taskRoutes.post(
  "/create-task/:projectId",
  isLoggedIn,
  checkProjectPermission('canCreateTask'),
  upload.array("attachments", 10),
  createTask,
);

taskRoutes.put(
  "/update-task-status/:taskId",
  isLoggedIn,
  checkTaskPermission('canUpdateTask'),
  updateTaskStatus,
);

taskRoutes.delete(
  "/delete-task/:taskId", 
  isLoggedIn,
  checkTaskPermission('canDeleteTask'),
  deleteTask
);

taskRoutes.post(
  "/add-attachments/:taskId",
  isLoggedIn,
  checkTaskPermission('canUpdateTask'),
  upload.array("attachments", 10),
  addAttachmentsToTask,
);

taskRoutes.get(
  "/assigned-to-user", 
  isLoggedIn, 
  getAllTaskAssignedToUser
);

taskRoutes.get(
  "/all-tasks/:projectId", 
  isLoggedIn,
  checkProjectPermission('canViewTask'),
  getAllTasksOfProject
);

taskRoutes.get(
  "/:taskId", 
  isLoggedIn,
  checkTaskPermission('canViewTask'),
  getTaskById
);

export default taskRoutes;
