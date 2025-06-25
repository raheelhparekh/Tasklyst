import { Router } from "express";
import {
  userRegistrationValidator,
  userLoginValidator,
  resendVerificationEmailValidator,
  forgotPasswordRequestValidator,
  resetPasswordValidator,
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
  updateUserProfile,
  verifyEmail,
} from "../controllers/auth.controllers.js";
import { isLoggedIn } from "../middlewares/auth.middlewares.js";
import  upload  from "../middlewares/multer.middlewares.js";

const authRoutes = Router();

authRoutes.post("/register",userRegistrationValidator(),validate,registerUser);
authRoutes.post("/login", userLoginValidator(), validate, loginUser);
authRoutes.get("/logout", isLoggedIn, logoutUser);
authRoutes.get("/profile", isLoggedIn, getUser);

authRoutes.get("/verify-email/:token",  verifyEmail);
authRoutes.post("/resend-verify-email", resendVerificationEmailValidator(), validate, resendVerificationEmail);

authRoutes.post("/forgot-password", forgotPasswordRequestValidator(), validate, forgotPassword);
authRoutes.post("/reset-password/:token", resetPasswordValidator(), validate, resetPassword);

authRoutes.post("/update-profile", isLoggedIn, upload.single('avatar') ,updateUserProfile);

export default authRoutes;
