import { useProjectStore } from "@/store/useProjectStore";
import { useAuthStore } from "@/store/useAuthStore";

// Role permissions configuration (should match backend)
export const RolePermissions = {
  admin: {
    canCreateProject: true,
    canUpdateProject: true,
    canDeleteProject: true,
    canViewProject: true,
    canAddMember: true,
    canRemoveMember: true,
    canUpdateMemberRole: true,
    canViewMembers: true,
    canCreateTask: true,
    canUpdateTask: true,
    canDeleteTask: true,
    canAssignTask: true,
    canViewTask: true,
    canCreateNote: true,
    canUpdateNote: true,
    canDeleteNote: true,
    canViewNote: true,
    canCreateSubtask: true,
    canUpdateSubtask: true,
    canDeleteSubtask: true,
    canViewSubtask: true
  },
  
  project_admin: {
    canCreateProject: true,
    canUpdateProject: true, // own projects only
    canDeleteProject: true, // own projects only
    canViewProject: true,
    canAddMember: true,
    canRemoveMember: true,
    canUpdateMemberRole: true,
    canViewMembers: true,
    canCreateTask: true,
    canUpdateTask: true,
    canDeleteTask: true,
    canAssignTask: true,
    canViewTask: true,
    canCreateNote: true,
    canUpdateNote: true,
    canDeleteNote: true,
    canViewNote: true,
    canCreateSubtask: true,
    canUpdateSubtask: true,
    canDeleteSubtask: true,
    canViewSubtask: true
  },
  
  member: {
    canCreateProject: true,
    canUpdateProject: false,
    canDeleteProject: false,
    canViewProject: true,
    canAddMember: false,
    canRemoveMember: false,
    canUpdateMemberRole: false,
    canViewMembers: true,
    canCreateTask: true,
    canUpdateTask: true, // only assigned/own tasks
    canDeleteTask: false, // only own tasks
    canAssignTask: false,
    canViewTask: true,
    canCreateNote: true,
    canUpdateNote: true, // own notes only
    canDeleteNote: true, // own notes only
    canViewNote: true,
    canCreateSubtask: true,
    canUpdateSubtask: true, // own subtasks or assigned tasks
    canDeleteSubtask: true, // own subtasks only
    canViewSubtask: true
  }
};

/**
 * Hook to check user permissions
 */
export const usePermissions = () => {
  const { authUser } = useAuthStore();
  
  // Get user's role in current project context
  const getUserRole = (projectId, projectCreatorId, members = []) => {
    if (!authUser) return null;
    
    // Check if user is project creator
    if (projectCreatorId === authUser._id) {
      return 'project_admin';
    }
    
    // Check user's role in project members
    const member = members.find(m => m.user?._id === authUser._id || m.user === authUser._id);
    return member?.role || null;
  };
  
  // Check if user has specific permission
  const hasPermission = (permission, userRole) => {
    if (!userRole || !RolePermissions[userRole]) {
      return false;
    }
    return RolePermissions[userRole][permission] || false;
  };
  
  // Check project-specific permissions
  const canPerformAction = (action, project, members = [], additionalChecks = {}) => {
    if (!authUser || !project) return false;
    
    const userRole = getUserRole(project._id, project.createdBy?._id || project.createdBy, members);
    
    if (!userRole) return false;
    
    const hasBasePermission = hasPermission(action, userRole);
    
    // Additional role-specific checks
    if (userRole === 'member') {
      switch (action) {
        case 'canUpdateProject':
        case 'canDeleteProject':
          return false; // Members can never update/delete projects
        
        case 'canUpdateTask':
        case 'canDeleteTask':
          if (additionalChecks.task) {
            const isOwner = additionalChecks.task.assignedBy === authUser._id;
            const isAssigned = additionalChecks.task.assignedTo === authUser._id;
            return hasBasePermission && (isOwner || isAssigned);
          }
          return hasBasePermission;
        
        case 'canUpdateNote':
        case 'canDeleteNote':
          if (additionalChecks.note) {
            const isOwner = additionalChecks.note.createdBy === authUser._id;
            return hasBasePermission && isOwner;
          }
          return hasBasePermission;
          
        default:
          return hasBasePermission;
      }
    }
    
    if (userRole === 'project_admin') {
      switch (action) {
        case 'canUpdateProject':
        case 'canDeleteProject':
          // Project admins can only modify projects they created
          return hasBasePermission && (project.createdBy?._id === authUser._id || project.createdBy === authUser._id);
          
        default:
          return hasBasePermission;
      }
    }
    
    return hasBasePermission;
  };
  
  return {
    getUserRole,
    hasPermission,
    canPerformAction,
    authUser
  };
};

/**
 * Hook for project-specific permissions
 */
export const useProjectPermissions = (projectId) => {
  const { project, members } = useProjectStore();
  const { canPerformAction } = usePermissions();
  
  const currentProject = project && project._id === projectId ? project : null;
  
  return {
    canUpdate: canPerformAction('canUpdateProject', currentProject, members),
    canDelete: canPerformAction('canDeleteProject', currentProject, members),
    canAddMember: canPerformAction('canAddMember', currentProject, members),
    canRemoveMember: canPerformAction('canRemoveMember', currentProject, members),
    canUpdateMemberRole: canPerformAction('canUpdateMemberRole', currentProject, members),
    canCreateTask: canPerformAction('canCreateTask', currentProject, members),
    canAssignTask: canPerformAction('canAssignTask', currentProject, members),
    canCreateNote: canPerformAction('canCreateNote', currentProject, members),
  };
};

/**
 * Hook for task-specific permissions
 */
export const useTaskPermissions = (task, projectId) => {
  const { project, members } = useProjectStore();
  const { canPerformAction } = usePermissions();
  
  const currentProject = project && project._id === projectId ? project : null;
  
  return {
    canUpdate: canPerformAction('canUpdateTask', currentProject, members, { task }),
    canDelete: canPerformAction('canDeleteTask', currentProject, members, { task }),
    canCreateSubtask: canPerformAction('canCreateSubtask', currentProject, members),
  };
};

/**
 * Hook for note-specific permissions
 */
export const useNotePermissions = (note, projectId) => {
  const { project, members } = useProjectStore();
  const { canPerformAction } = usePermissions();
  
  const currentProject = project && project._id === projectId ? project : null;
  
  return {
    canUpdate: canPerformAction('canUpdateNote', currentProject, members, { note }),
    canDelete: canPerformAction('canDeleteNote', currentProject, members, { note }),
  };
};
