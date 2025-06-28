import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigninUp: false,
  isLoggingIn: false,
  isCheckingAuth: false,

  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true });
      const res = await axiosInstance.get("/auth/check-auth");
      console.log("checkAuth response", res.data);

      set({ authUser: res.data.data });
      toast.success("User authenticated successfully");
    } catch (error) {
      console.error("Error checking auth", error);
      toast.error("Error checking auth. Please try again.");
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  login: async (data) => {
    try {
      set({ isLoggingIn: true });
      const res = await axiosInstance.post("/auth/login", data);

      console.log("login response", res.data.data);

      set({ authUser: res.data.data });
      toast.success(res.data.message || "Login successful");
    } catch (error) {
      console.error("Login error", error);
      toast.error("Error logging in. Please try again.");

      set({ authUser: null });
    } finally {
      set({ isLoggingIn: false });
    }
  },

  signup: async (data) => {
    try {
      set({ isSigninUp: true });
      const res = await axiosInstance.post("/auth/register", data);
      console.log("signup response", res.data.data);
      set({ authUser: res.data.data });
      toast.success(res.data.message || "Signup successful");
    } catch (error) {
      console.error("Signup error", error);
      toast.error("Error signing up. Please try again.");
      set({ authUser: null });
    } finally {
      set({ isSigninUp: false });
    }
  },

  logout: async () => {
    try {
      const res = await axiosInstance.get("/auth/logout");
      console.log("logout response", res.data);
      set({ authUser: null });
      toast.success(res.data.message || "Logout successful");
    } catch (error) {
      console.error("Logout error", error);
      toast.error("Error logging out. Please try again.");
    }
  },
}));
