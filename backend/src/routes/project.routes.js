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
import { 
    checkProjectPermission, 
    checkMemberManagementPermission,
    checkMemberLevelPermission 
} from "../middlewares/rbac.middlewares.js";

const projectRoutes = Router();

projectRoutes.get("/", isLoggedIn, getAllProjectsOfUser);

projectRoutes.get("/:id", isLoggedIn, checkProjectPermission('canViewProject'), getProjectById);

projectRoutes.post("/create-project", isLoggedIn, createProject);

projectRoutes.put("/update-project/:id", isLoggedIn, checkProjectPermission('canUpdateProject'), updateProject);

projectRoutes.delete("/delete-project/:id", isLoggedIn, checkProjectPermission('canDeleteProject'), deleteProject);

projectRoutes.post("/add-member/:id", isLoggedIn, checkMemberManagementPermission('canAddMember'), addMemberToProject);

projectRoutes.get("/get-all-members/:id", isLoggedIn, checkProjectPermission('canViewMembers'), getProjectMembers);

projectRoutes.put("/update-member-role/:id", isLoggedIn, checkMemberLevelPermission('canUpdateMemberRole'), updateMemberRole);

projectRoutes.delete("/delete-member/:id", isLoggedIn, checkMemberLevelPermission('canRemoveMember'), deleteProjectMember);

projectRoutes.get("/get-all-members-details/:id", isLoggedIn, checkProjectPermission('canViewMembers'), getAllProjectMembersDetails);

export default projectRoutes;