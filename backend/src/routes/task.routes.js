import Router from "express";
import {
  createTask,
  updateTask,
  deleteTask,
  getAllTasksOfProject,
  getTaskById,
  getAllTaskAssignedToUser,
} from "../controllers/task.controllers.js";
import {isLoggedIn} from "../middlewares/auth.middlewares.js"
import upload from "../middlewares/multer.middlewares.js";

const taskRoutes = Router();

taskRoutes.post("/create-task/:projectId",isLoggedIn, upload.array('attachments',10) ,createTask);

taskRoutes.put("/update-task/:taskId", isLoggedIn, updateTask);

taskRoutes.delete("/delete-task/:taskId",isLoggedIn, deleteTask);

taskRoutes.get("/all-tasks/:projectId",isLoggedIn, getAllTasksOfProject);

taskRoutes.get("/",isLoggedIn, getAllTaskAssignedToUser);

taskRoutes.get("/:taskId",isLoggedIn, getTaskById);

export default taskRoutes;
