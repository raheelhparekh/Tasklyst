import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";
import logger from "../lib/logger";

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
      set({ authUser: res.data.data });
    } catch {
      // Silent fail for auth check - don't show toast on page load
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  login: async (userData) => {
    try {
      set({ isLoggingIn: true });
      const res = await axiosInstance.post("/auth/login", userData);
      set({ authUser: res.data.data });
      toast.success(res.data.message || "Login successful");
      logger.info("User login successful", { email: userData.email });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error logging in. Please try again.";
      toast.error(errorMessage);
      logger.apiError("/auth/login", error);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  signup: async (userData) => {
    try {
      set({ isSigninUp: true });
      const res = await axiosInstance.post("/auth/register", userData);
      toast.success(res.data.message || "Account created successfully");
      logger.info("User signup successful", { email: userData.email });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error creating account. Please try again.";
      toast.error(errorMessage);
      logger.apiError("/auth/register", error);
    } finally {
      set({ isSigninUp: false });
    }
  },

  logout: async () => {
    try {
      const res = await axiosInstance.get("/auth/logout");
      set({ authUser: null });
      toast.success(res.data.message || "Logout successful");
      logger.info("User logout successful");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error logging out. Please try again.";
      toast.error(errorMessage);
      logger.apiError("/auth/logout", error);
    }
  },

  forgotPassword: async (email) => {
    try {
      set({ isSubmitting: true });
      const res = await axiosInstance.post("/auth/forgot-password", email);
      toast.success(res.data.message || "Reset link sent to your email");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error sending reset link. Please try again.";
      toast.error(errorMessage);
    } finally {
      set({ isSubmitting: false });
    }
  },

  resetPassword: async (data, token) => {
    try {
      set({ isSubmitting: true });
      const res = await axiosInstance.post(
        `/auth/reset-password/${token}`,
        data,
      );
      toast.success(res.data.message || "Password reset successful");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error resetting password. Please try again.";
      toast.error(errorMessage);
    } finally {
      set({ isSubmitting: false });
    }
  },

  getUserProfile: async () => {
    try {
      const res = await axiosInstance.get(`/auth/profile`);
      return res.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error fetching user profile. Please try again.";
      toast.error(errorMessage);
      return null;
    }
  },
  updateUserProfile: async (data) => {
    try {
      set({ isUpdating: true });
      const res = await axiosInstance.put(`/auth/update-profile`, data);
      set({ authUser: res.data.data });
      toast.success(res.data.message || "Profile updated successfully");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error updating profile. Please try again.";
      toast.error(errorMessage);
    } finally {
      set({ isUpdating: false });
    }
  },
}));
