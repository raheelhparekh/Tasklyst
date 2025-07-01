import { Router } from "express";
import { AvailableUserRolesEnum, UserRolesEnums } from "../utils/constants.js";
import {
  createNote,
  deleteNote,
  getNoteById,
  getProjectNotes,
  getTaskNotes,
  updateNote,
} from "../controllers/note.controllers.js";
import {
  isLoggedIn,
  validateProjectPermission,
} from "../middlewares/auth.middlewares.js";

const noteRoutes = Router();

noteRoutes.get(
  "/n/:taskId",
  isLoggedIn,
  getTaskNotes
);

noteRoutes.get(
  "/:projectId",
  isLoggedIn,
  validateProjectPermission([UserRolesEnums.ADMIN, UserRolesEnums.MEMBER, UserRolesEnums.GUEST]),
  getProjectNotes,
);

noteRoutes.post(
  "/:projectId/n/create-note",
  isLoggedIn,
  // validateProjectPermission([UserRolesEnums.ADMIN, UserRolesEnums.MEMBER]),
  createNote,
);

noteRoutes.post(
  "/task/:taskId/create-note",
  isLoggedIn,
  createNote,
);

noteRoutes.get(
  "/:projectId/n/:noteId",
  isLoggedIn,
  validateProjectPermission(AvailableUserRolesEnum),
  getNoteById,
);

noteRoutes.put(
  "/:projectId/n/update-note/:noteId",
  isLoggedIn,
  validateProjectPermission([UserRolesEnums.ADMIN]),
  updateNote,
);

noteRoutes.delete(
  "/:projectId/n/delete-note/:noteId",
  isLoggedIn,
  validateProjectPermission([UserRolesEnums.ADMIN]),
  deleteNote,
);



export default noteRoutes;
