import { Router } from "express";
import {
  createNote,
  deleteNote,
  getNoteById,
  getProjectNotes,
  getTaskNotes,
  updateNote,
} from "../controllers/note.controllers.js";
import { isLoggedIn } from "../middlewares/auth.middlewares.js";
import { 
  checkProjectPermission, 
  checkNotePermission,
  checkTaskPermission 
} from "../middlewares/rbac.middlewares.js";

const noteRoutes = Router();

noteRoutes.get(
  "/n/:taskId",
  isLoggedIn,
  checkTaskPermission('canViewTask'),
  getTaskNotes
);

noteRoutes.get(
  "/:projectId",
  isLoggedIn,
  checkProjectPermission('canViewNote'),
  getProjectNotes,
);

noteRoutes.post(
  "/:projectId/n/create-note",
  isLoggedIn,
  checkProjectPermission('canCreateNote'),
  createNote,
);

noteRoutes.post(
  "/task/:taskId/create-note",
  isLoggedIn,
  checkTaskPermission('canViewTask'),
  createNote,
);

noteRoutes.get(
  "/:projectId/n/:noteId",
  isLoggedIn,
  checkNotePermission('canViewNote'),
  getNoteById,
);

noteRoutes.put(
  "/:projectId/n/update-note/:noteId",
  isLoggedIn,
  checkNotePermission('canUpdateNote'),
  updateNote,
);

noteRoutes.delete(
  "/:projectId/n/delete-note/:noteId",
  isLoggedIn,
  checkNotePermission('canDeleteNote'),
  deleteNote,
);

export default noteRoutes;
