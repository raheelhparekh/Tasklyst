import { Router } from "express";
import {
  userRegistrationValidator,
  userLoginValidator,
} from "../validators/index.js";
import { validate } from "../middlewares/validator.middlewares.js";
import {
  forgotPassword,
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  resendVerificationEmail,
  resetPassword,
  verifyEmail,
} from "../controllers/auth.controllers.js";
import { isLoggedIn } from "../middlewares/auth.middlewares.js";

const authRoutes = Router();

authRoutes.post("/register",userRegistrationValidator(),validate,registerUser);
authRoutes.post("/login", userLoginValidator(), validate, loginUser);
authRoutes.get("/logout", isLoggedIn, logoutUser);
authRoutes.get("/profile", isLoggedIn, getUser);

authRoutes.get("/verify-email/:token", verifyEmail);
authRoutes.post("/resend-verify-email", resendVerificationEmail);

authRoutes.post("/forgot-password", forgotPassword);
authRoutes.post("/reset-password/:token", resetPassword);

export default authRoutes;
