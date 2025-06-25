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
  try {
    if (!email || !username || !password) {
      throw new ApiError(400, "All fields are required");
    }

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(401, "User already exists. Please login");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("hashed pass", hashedPassword);

    // create new user
    const newUser = await User.create({
      email,
      username,
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
  } catch (error) {
    console.error("Error registering user:", error);
    throw new ApiError(500, "Error occured registering user", error);
  }
});

const loginUser = asyncHandler(async (req, res) => {
  try {
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

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
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
  } catch (error) {
    console.error("Error logging in user:", error);
    throw new ApiError(500, "Internal server error while logging in.", error);
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  try {
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
  } catch (error) {
    console.error("Error logging out user:", error);
    throw new ApiError(500, "Internal server error while logging out.", error);
  }
});

const verifyEmail = asyncHandler(async (req, res) => {
  try {
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
  } catch (error) {
    console.error("Error verifying email:", error);
    throw new ApiError(500, "Internal server error while verifying email.");
  }
});

const resendVerificationEmail = asyncHandler(async (req, res) => {
  try {
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
      .json(
        new ApiResponse(200, null, "Email verification sent successfully."),
      );
  } catch (error) {
    console.error("Error resending verification email:", error);
    throw new ApiError(500, "Internal server error while resending email.");
  }
});

const getUser = asyncHandler(async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error(401, "Unauthorised");
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
  } catch (error) {
    console.error("Error occured while fetching profile", error);
    throw new ApiError(500, "Error occuring fetching user profile", error);
  }
});

const forgotPassword = asyncHandler(async (req, res) => {
  try {
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
        `${process.env.BASE_URL}/api/v1/auth/reset-password/${unHashedToken}`,
      ),
    });
    console.log("email sent");

    return res
      .status(200)
      .json(
        new ApiResponse(200, null, "Password reset email sent successfully."),
      );
  } catch (error) {
    console.error("Error occured while fetching profile", error);
    throw new ApiError(500, "Error occuring fetching user profile", error);
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  try {
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
  } catch (error) {
    console.error("Error resetting password:", error);
    throw new ApiError(
      500,
      "Internal server error while resetting password.",
      error,
    );
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  try {
    const { username } = req.body;

    const user = req.user;
    if (!user) {
      throw new ApiError(401, "Unauthorized access.");
    }

    const myUser = await User.findById(user._id).select("-password -emailVerificationToken -emailVerificationExpiry -forgotPasswordToken -forgotPasswordExpiry -refreshToken");
    
    if (!myUser) {
      throw new ApiError(404, "User not found.");
    }

    // Update user profile
    if (username) {
      myUser.username = username || myUser.username;
    }

    if (req.file && req.file.path) {
      myUser.avatar.url = req.file.path; // Cloudinary URL
      console.log("Avatar URL:", myUser.avatar.url);
    }
    await myUser.save();

    return res
      .status(200)
      .json(new ApiResponse(200, myUser, "Profile updated successfully."));
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw new ApiError(
      500,
      "Internal server error while updating profile.",
      error,
    );
  }
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
};
