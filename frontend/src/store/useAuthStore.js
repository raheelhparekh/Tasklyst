import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigninUp: false,
  isLoggingIn: false,
  isCheckingAuth: false,
  isSubmitting: false,
  isUpdating: false,

  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true });
      const res = await axiosInstance.get("/auth/check-auth");
      console.log("checkAuth response", res.data);

      set({ authUser: res.data.data });
      // toast.success("User authenticated successfully");
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

  forgotPassword: async (email) => {
    try {
      set({ isSubmitting: true });
      const res = await axiosInstance.post("/auth/forgot-password", email);
      console.log("forgotPassword response", res.data);
      toast.success(res.data.message || "Reset link sent to your email");
    } catch (error) {
      console.error("Forgot password error", error);
      toast.error("Error sending reset link. Please try again.");
    } finally {
      set({ isSubmitting: false });
    }
  },

  resetPassword: async (data, token) => {
    try {
      set({ isSubmitting: true });
      console.log("Resetting password with data:", data);
      const res = await axiosInstance.post(
        `/auth/reset-password/${token}`,
        data,
      );
      console.log("resetPassword response", res.data);
      toast.success(res.data.message || "Password reset successful");
    } catch (error) {
      console.error("Reset password error", error);
      toast.error("Error resetting password. Please try again.");
    } finally {
      set({ isSubmitting: false });
    }
  },

  getUserProfile: async () => {
    try {
      const res = await axiosInstance.get(`/auth/profile`);
      console.log("getUserProfile response", res.data);
      return res.data.data;
    } catch (error) {
      console.error("Error fetching user profile", error);
      toast.error("Error fetching user profile. Please try again.");
      return null;
    }
  },
  updateUserProfile: async (data) => {
    try {
      set({ isUpdating: true });
      const res = await axiosInstance.put(`/auth/update-profile`, data);
      console.log("updateUserProfile response", res.data);
      set({ authUser: res.data.data });
      toast.success(res.data.message || "Profile updated successfully");
    } catch (error) {
      console.error("Error updating user profile", error);
      toast.error("Error updating profile. Please try again.");
    } finally {
      set({ isUpdating: false });
    }
  },
}));
