import ProjectPage from "./pages/ProjectPage";
import TaskPage from "./pages/TaskPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import { useAuthStore } from "./store/useAuthStore.js";
import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import Layout from "./components/Layout";
import TaskByIdPage from "./pages/TaskByIdPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin " />
      </div>
    );
  }

  return (
    <Routes>
      {/* Layout-wrapped routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/project/:id/task" element={<TaskPage />} />
        <Route path="/task/:id" element={<TaskByIdPage />} />
        <Route path="/projects" element={<ProjectPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Standalone pages (like auth) */}
      <Route
        path="/login"
        element={!authUser ? <LoginPage /> : <Navigate to={"/"} />}
      />
      <Route
        path="/signup"
        element={!authUser ? <SignupPage /> : <Navigate to={"/"} />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/reset-password/:token"
        element={<ResetPassword />}
      />
    </Routes>
  );
}

export default App;
