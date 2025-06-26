import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "./layout/Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import { useAuthStore } from "./store/useAuthStore.js";
import { useEffect } from "react";
import { Loader } from "lucide-react";

function App() {
  const { authUser, isCheckingAuth, checkAuth } = useAuthStore();

  // console.log("authUser", authUser);

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
    <>
      
        <Toaster />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route
              index
              element={authUser ? <HomePage /> : <Navigate to={"/login"} />}
            />
          </Route>
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to={"/"} />}
          />
          <Route
            path="/signup"
            element={!authUser ? <SignupPage /> : <Navigate to={"/"} />}
          />

          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
    
    </>
  );
}

export default App;
