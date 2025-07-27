import { asyncHandler } from "../utils/async-handler.js";
import {
  emailVerificationMailGenContent,
  forgotPasswordMailGenContent,
  sendMail,
} from "../utils/mail.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/api-errors.js";
import { ApiResponse } from "../utils/api-response.js";
import bcrypt from "bcryptjs";

const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const trimmedEmail = email.trim();
  const trimmedUsername = username.trim();
  const trimmedPassword = password.trim();

  // check if user already exists
  const existingUser = await User.findOne({ email: trimmedEmail });
  if (existingUser) {
    throw new ApiError(401, "User already exists. Please login");
  }

  const hashedPassword = await bcrypt.hash(trimmedPassword, 10);
  // console.log("hashed pass", hashedPassword);

  // create new user
  const newUser = await User.create({
    email: trimmedEmail,
    username: trimmedUsername,
    password: hashedPassword,
  });

  // send verification email
  const { hashedToken, unHashedToken, tokenExpiry } =
    await newUser.generateTemporaryToken();

  // save the token in the database
  newUser.emailVerificationToken = unHashedToken;
  newUser.emailVerificationExpiry = tokenExpiry;

  await newUser.save();

  // sending email to the user
  console.log("sending email");

  await sendMail({
    email: newUser.email, // ✅ required
    subject: "Verify your email", // ✅ required
    mailGenContent: emailVerificationMailGenContent(
      newUser.username,
      `${process.env.BASE_URL}/api/v1/auth/verify-email?token=${unHashedToken}`,
    ),
  });

  console.log("email sent");

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        email: newUser.email,
        role: newUser.role,
        username: newUser.username,
      },
      "User registered successfully",
    ),
  );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Please provide all required fields.");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, "User does not exist.");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid credentials.");
  }

  // if (!user.isEmailVerified) {
  //   throw new ApiError(400, "Please verify your email before logging in.");
  // }

  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction, // false in dev, true in prod
    maxAge: 30 * 24 * 60 * 60 * 1000,
    sameSite: isProduction ? "strict" : "lax", // lax allows smoother local dev
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProduction,
    maxAge: 30 * 24 * 60 * 60 * 1000,
    sameSite: isProduction ? "strict" : "lax",
  });

  user.refreshToken = refreshToken;
  await user.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      "User logged in successfully.",
    ),
  );
});

const logoutUser = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(401, "Unauthorized access.");
  }

  // Clear cookies
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,
  });

  // Remove refresh token from database
  user.refreshToken = null;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "User logged out successfully."));
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  if (!token) {
    throw new ApiError(400, "Please provide a valid token.");
  }

  const user = await User.findOne({
    emailVerificationToken: token,
    emailVerificationExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired token.");
  }

  user.emailVerificationToken = undefined;
  user.emailVerificationExpiry = undefined;
  user.isEmailVerified = true;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Email verified successfully."));
});

const resendVerificationEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Please provide an email address.");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found with this email.");
  }

  if (user.isEmailVerified) {
    throw new ApiError(400, "Email is already verified.");
  }

  const { hashedToken, unHashedToken, tokenExpiry } =
    await user.generateTemporaryToken();

  // save the token in the database
  user.emailVerificationToken = unHashedToken;
  user.emailVerificationExpiry = tokenExpiry;
  await user.save();

  // sending email to the user
  console.log("sending email");

  await sendMail({
    email: user.email, // ✅ required
    subject: "Verify your email", // ✅ required
    mailGenContent: emailVerificationMailGenContent(
      user.username,
      `${process.env.BASE_URL}/api/v1/auth/verify-email?token=${unHashedToken}`,
    ),
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Email verification sent successfully."));
});

const getUser = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(401, "Unauthorised");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { email: user.email, role: user.role, username: user.username },
        "Profile fetched succesfully",
      ),
    );
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User does not exist with this email");
  }

  const { hashedToken, unHashedToken, tokenExpiry } =
    await user.generateTemporaryToken();

  // save the token in the database
  user.forgotPasswordToken = unHashedToken;
  user.forgotPasswordExpiry = tokenExpiry;
  await user.save();

  // sending email to the user
  console.log("sending email");

  await sendMail({
    email: user.email, // ✅ required
    subject: "Reset your password", // ✅ required
    mailGenContent: forgotPasswordMailGenContent(
      user.username,
      `${process.env.BASE_URL}/reset-password/${unHashedToken}`,
    ),
  });

  console.log("email sent");

  return res
    .status(200)
    .json(
      new ApiResponse(200, null, "Password reset email sent successfully."),
    );
});

const resetPassword = asyncHandler(async (req, res) => {
  const { newPassword, newConfirmPassword } = req.body;
  const { token } = req.params;

  if (!newPassword || !newConfirmPassword) {
    throw new ApiError(400, "Please provide all required fields");
  }

  if (newPassword !== newConfirmPassword) {
    throw new ApiError(400, "Passwords do not match");
  }

  const user = await User.findOne({
    forgotPasswordToken: token,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired token.");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;

  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Password reset successfully."));
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const { username } = req.body;

  const user = req.user;
  if (!user) {
    throw new ApiError(401, "Unauthorized access.");
  }

  const myUser = await User.findById(user._id).select(
    "-password -emailVerificationToken -emailVerificationExpiry -forgotPasswordToken -forgotPasswordExpiry -refreshToken",
  );

  if (!myUser) {
    throw new ApiError(404, "User not found.");
  }

  // Update user profile
  if (username) {
    myUser.username = username.trim() || myUser.username;
  }

  if (req.file && req.file.path) {
    myUser.avatar.url = req.file.path; // Cloudinary URL
    console.log("Avatar URL:", myUser.avatar.url);
  }
  await myUser.save();

  return res
    .status(200)
    .json(new ApiResponse(200, myUser, "Profile updated successfully."));
});

const check = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "You are authenticated."));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  updateUserProfile,
  check,
};
