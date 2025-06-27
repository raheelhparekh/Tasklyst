import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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
    <div className="flex flex-col items-center justify-start">
      <Routes>
        {/* <Route path="/" element={<Layout />}>
            <Route
              index
              element={authUser ? <HomePage /> : <Navigate to={"/login"} />}
            />
          </Route> */}
        <Route path="/" element={<HomePage />} />

        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignupPage /> : <Navigate to={"/"} />}
        />

        <Route path="/profile" element={<ProfilePage />} />

        <Route path="/projects" element={<ProjectPage />} />
        <Route path="/tasks" element={<TaskPage />} />
      </Routes>
    </div>
  );
}

export default App;
