import { useAuthStore } from "@/store/useAuthStore";

export const useTaskPermissions = (members, project) => {
  const { authUser } = useAuthStore();

  // Helper function to get current user's role in the project
  const getCurrentUserRole = () => {
    if (!authUser || !members || !project) return null;

    // Check if user is project creator
    if (
      project.createdBy?._id === authUser._id ||
      project.createdBy === authUser._id
    ) {
      return "project_admin";
    }

    // Find user in members list
    const userMember = members.find(
      (member) =>
        member.user._id === authUser._id ||
        member.user._id.toString() === authUser._id.toString(),
    );

    return userMember ? userMember.role : "member";
  };

  const currentUserRole = getCurrentUserRole();

  // Helper function to check if user can manage a specific task
  const canManageTask = (task) => {
    if (!authUser) return false;

    // Project admin and admin can manage all tasks
    if (currentUserRole === "project_admin" || currentUserRole === "admin") {
      return true;
    }

    // Task creator can manage their own tasks
    if (
      task.assignedBy?._id === authUser._id ||
      task.assignedBy === authUser._id
    ) {
      return true;
    }

    // Assigned user can update status but not delete
    if (
      task.assignedTo?._id === authUser._id ||
      task.assignedTo === authUser._id
    ) {
      return true;
    }

    return false;
  };

  // Helper function to check if user can delete a specific task
  const canDeleteTask = (task) => {
    if (!authUser) return false;

    // Project admin and admin can delete all tasks
    if (currentUserRole === "project_admin" || currentUserRole === "admin") {
      return true;
    }

    // Task creator can delete their own tasks
    if (
      task.assignedBy?._id === authUser._id ||
      task.assignedBy === authUser._id
    ) {
      return true;
    }

    return false;
  };

  return {
    currentUserRole,
    canManageTask,
    canDeleteTask,
  };
};
