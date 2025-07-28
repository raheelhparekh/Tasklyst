import ProjectSidebar from "@/components/ProjectSidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useProjectStore } from "@/store/useProjectStore";
import { useTaskStore } from "@/store/useTaskStore";
import { useNoteStore } from "@/store/useNoteStore";
import { useTaskPermissions } from "@/hooks/useTaskPermissions";
import { useTaskOperations } from "@/hooks/useTaskOperations";
import { createMemberColumns } from "@/components/tables/memberColumns";
import { createTaskColumns } from "@/components/tables/taskColumns";
import { createNoteColumns } from "@/components/tables/noteColumns";
import { DeleteTaskDialog } from "@/components/dialogs/DeleteTaskDialog";
import { MembersTab } from "@/components/tabs/MembersTab";
import { TasksTab } from "@/components/tabs/TasksTab";
import { NotesTab } from "@/components/tabs/NotesTab";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function TaskPage() {
  const {
    project,
    members,
    getAllMembersDetails,
    changeMemberRole,
    deleteProjectMember,
    addMemberToProject,
  } = useProjectStore();

  const {
    getAllTodoTasks,
    getAllCompletedTasks,
    getAllPendingTasks,
    todoTasks,
    completedTasks,
    in_progress,
  } = useTaskStore();

  const { getAllProjectNotes, notes, createProjectNote } = useNoteStore();
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("todo");
  const [content, setContent] = useState("");
  const [email, setEmail] = useState("");

  // Use custom hooks
  const { currentUserRole, canManageTask, canDeleteTask } = useTaskPermissions(members, project);
  const {
    taskToDelete,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isDeletingTask,
    handleTaskStatusChange,
    openDeleteDialog,
    handleDeleteTask,
  } = useTaskOperations(id);

  // Create table columns
  const memberColumns = createMemberColumns(currentUserRole, changeMemberRole, deleteProjectMember);
  const taskColumns = createTaskColumns(navigate, canManageTask, canDeleteTask, handleTaskStatusChange, openDeleteDialog);
  const noteColumns = createNoteColumns();

  // Handler functions
  const handleSubmit = async () => {
    try {
      await createProjectNote(content, id);
      setContent("");
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  const handleAddMember = async () => {
    try {
      await addMemberToProject(id, { email, role: "member" });
      setEmail("");
    } catch (error) {
      console.error("Error adding member:", error);
    }
  };

  useEffect(() => {
    getAllTodoTasks(id);
    getAllCompletedTasks(id);
    getAllPendingTasks(id);
    getAllMembersDetails(id);
    getAllProjectNotes(id);
  }, [
    id,
    getAllTodoTasks,
    getAllCompletedTasks,
    getAllPendingTasks,
    getAllMembersDetails,
    getAllProjectNotes,
  ]);

  return (
    <div className="flex h-screen w-full">
      <ProjectSidebar
        onClose={() => navigate("/projects")}
        setActiveTab={setActiveTab}
        activeTab={activeTab}
        members={members}
      />

      <main className="flex-1 p-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink 
                onClick={() => navigate("/")}
                className="text-violet-600 hover:text-violet-800 dark:text-violet-400 dark:hover:text-violet-200 font-medium cursor-pointer transition-colors"
              >
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-violet-400" />
            <BreadcrumbItem>
              <BreadcrumbLink 
                onClick={() => navigate("/projects")}
                className="text-violet-600 hover:text-violet-800 dark:text-violet-400 dark:hover:text-violet-200 font-medium cursor-pointer transition-colors"
              >
                Projects
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-violet-400" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-violet-900 dark:text-violet-100 font-semibold">
                {project?.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {activeTab === "members" && (
          <MembersTab
            members={members}
            columns={memberColumns}
            email={email}
            setEmail={setEmail}
            onAddMember={handleAddMember}
          />
        )}

        {activeTab === "todo" && (
          <TasksTab
            title="Tasks To Do."
            data={todoTasks}
            columns={taskColumns}
          />
        )}

        {activeTab === "in_progress" && (
          <TasksTab
            title="Tasks In Progress."
            data={in_progress}
            columns={taskColumns}
          />
        )}

        {activeTab === "completed" && (
          <TasksTab
            title="Tasks Completed."
            data={completedTasks}
            columns={taskColumns}
          />
        )}

        {activeTab === "notes" && (
          <NotesTab
            notes={notes}
            columns={noteColumns}
            content={content}
            setContent={setContent}
            onCreateNote={handleSubmit}
          />
        )}
      </main>

      <DeleteTaskDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        taskToDelete={taskToDelete}
        onConfirm={handleDeleteTask}
        isDeleting={isDeletingTask}
      />
    </div>
  );
}

export default TaskPage;
