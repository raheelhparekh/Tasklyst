import { Router } from "express";
import { 
    addMemberToProject, 
    createProject, 
    deleteProject, 
    deleteProjectMember, 
    getAllProjectsOfUser, 
    getProjectById, 
    getProjectMembers, 
    updateMemberRole, 
    updateProject,
    getAllProjectMembersDetails
 } from "../controllers/project.controllers.js";

import { isLoggedIn } from "../middlewares/auth.middlewares.js";

const projectRoutes= Router();

projectRoutes.get("/", isLoggedIn, getAllProjectsOfUser);

projectRoutes.get("/:id", isLoggedIn, getProjectById);

projectRoutes.post("/create-project", isLoggedIn, createProject);

projectRoutes.put("/update-project/:id", isLoggedIn, updateProject);

projectRoutes.delete("/delete-project/:id", isLoggedIn, deleteProject);

projectRoutes.post("/add-member/:id", isLoggedIn, addMemberToProject);

projectRoutes.get("/get-all-members/:id", isLoggedIn, getProjectMembers);

projectRoutes.put("/update-member-role/:id", isLoggedIn, updateMemberRole);

projectRoutes.delete("/delete-member/:id", isLoggedIn, deleteProjectMember);

projectRoutes.get("/get-all-members-details/:id", isLoggedIn, getAllProjectMembersDetails);

export default projectRoutes;