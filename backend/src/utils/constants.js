export const UserRolesEnums = {
  ADMIN: "admin",
  PROJECT_ADMIN: "project_admin",
  MEMBER: "member",
};

export const AvailableUserRolesEnum = Object.values(UserRolesEnums);

// Role-based permissions configuration
export const RolePermissions = {
  [UserRolesEnums.ADMIN]: {
    // Project permissions
    canCreateProject: true,
    canUpdateProject: true,
    canDeleteProject: true,
    canViewProject: true,

    // Member permissions
    canAddMember: true,
    canRemoveMember: true,
    canUpdateMemberRole: true,
    canViewMembers: true,

    // Task permissions
    canCreateTask: true,
    canUpdateTask: true,
    canDeleteTask: true,
    canAssignTask: true,
    canViewTask: true,

    // Note permissions
    canCreateNote: true,
    canUpdateNote: true,
    canDeleteNote: true,
    canViewNote: true,

    // Subtask permissions
    canCreateSubtask: true,
    canUpdateSubtask: true,
    canDeleteSubtask: true,
    canViewSubtask: true,
  },

  [UserRolesEnums.PROJECT_ADMIN]: {
    // Project permissions - only for projects they created
    canCreateProject: true,
    canUpdateProject: true, // own projects only
    canDeleteProject: true, // own projects only
    canViewProject: true,

    // Member permissions
    canAddMember: true,
    canRemoveMember: true,
    canUpdateMemberRole: true,
    canViewMembers: true,

    // Task permissions
    canCreateTask: true,
    canUpdateTask: true,
    canDeleteTask: true,
    canAssignTask: true,
    canViewTask: true,

    // Note permissions
    canCreateNote: true,
    canUpdateNote: true, // own notes or if admin
    canDeleteNote: true, // own notes or if admin
    canViewNote: true,

    // Subtask permissions
    canCreateSubtask: true,
    canUpdateSubtask: true,
    canDeleteSubtask: true,
    canViewSubtask: true,
  },

  [UserRolesEnums.MEMBER]: {
    // Project permissions
    canCreateProject: true,
    canUpdateProject: false,
    canDeleteProject: false,
    canViewProject: true,

    // Member permissions
    canAddMember: false,
    canRemoveMember: false,
    canUpdateMemberRole: false,
    canViewMembers: true,

    // Task permissions
    canCreateTask: true,
    canUpdateTask: true, // only assigned tasks or own tasks
    canDeleteTask: false, // only own tasks
    canAssignTask: false,
    canViewTask: true,

    // Note permissions
    canCreateNote: true,
    canUpdateNote: true, // own notes only
    canDeleteNote: true, // own notes only
    canViewNote: true,

    // Subtask permissions
    canCreateSubtask: true,
    canUpdateSubtask: true, // own subtasks or assigned tasks
    canDeleteSubtask: true, // own subtasks only
    canViewSubtask: true,
  },
};

export const TaskStatusEnum = {
  TODO: "todo",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
};

export const AvailableTaskStatusEnum = Object.values(TaskStatusEnum);
