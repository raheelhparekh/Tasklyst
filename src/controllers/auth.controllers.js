import { asyncHandler } from "../utils/async-handler.js";
import { emailVerificationMailGenContent, sendMail } from "../utils/mail.js";
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
    newUser.emailVerificationToken = hashedToken;
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
  } catch (error) {}
});

const resendVerificationEmail = asyncHandler(async (req, res) => {});

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

const refreshAccessToken = asyncHandler(async (req, res) => {});

const forgotPassword = asyncHandler(async (req, res) => {});

const resetPassword = asyncHandler(async (req, res) => {});

export {
  registerUser,
  loginUser,
  logoutUser,
  resetPassword,
  getUser,
  verifyEmail,
  resendVerificationEmail,
  refreshAccessToken,
  forgotPassword,
};
