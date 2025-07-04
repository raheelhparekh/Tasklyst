import { body } from "express-validator";

const userRegistrationValidator = () => {
  // returns an array
  return [
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLength({ min: 3, max: 20 })
      .withMessage("Username must be between 3 and 20 characters")
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage(
        "Username can only contain letters, numbers, and underscores",
      ),

    // Email: valid format
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email address"),

    // Password: min 8 chars, at least one uppercase, one lowercase, one number, one special character
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches(/[a-z]/)
      .withMessage("Password must contain at least one lowercase letter")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter")
      .matches(/[0-9]/)
      .withMessage("Password must contain at least one number")
      .matches(/[\W_]/)
      .withMessage("Password must contain at least one special character"),
  ];
};

const userLoginValidator = () => {
  return [
    // Email: must be valid
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email address"),

    // Password: required (no need to revalidate complexity here)
    body("password").notEmpty().withMessage("Password is required"),
  ];
};

const resendVerificationEmailValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email address"),
  ];
};

const forgotPasswordRequestValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email address"),
  ];
};

const resetPasswordValidator = () => {
  return [
    body("newPassword")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches(/[a-z]/)
      .withMessage("Password must contain at least one lowercase letter")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter")
      .matches(/[0-9]/)
      .withMessage("Password must contain at least one number")
      .matches(/[\W_]/)
      .withMessage("Password must contain at least one special character"),
    body("newConfirmPassword")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches(/[a-z]/)
      .withMessage("Password must contain at least one lowercase letter")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter")
      .matches(/[0-9]/)
      .withMessage("Password must contain at least one number")
      .matches(/[\W_]/)
      .withMessage("Password must contain at least one special character"),
  ];
};

const createProjectValidator = () => {
  return [
    body("name").trim().notEmpty().withMessage("Project name is Required"),
  ];
};

//TODO: check after writing task controllers
const createTaskValidator = () => {
  return [
    body("title")
      .notEmpty()
      .withMessage("Title is Required")
      .isLength({ max: 100 })
      .withMessage("Max 100 char are allowed")
      .isString()
      .withMessage("String format is required"),
    body("assignedToUsername")
      .notEmpty()
      .withMessage("Mention to whom this task is assigned"),
    body("description")
      .optional()
      .isLength({ max: 1000 })
      .withMessage("Max 1000 char are allowed"),
    body("status")
      .optional()
      .isIn(AvailableTaskStatus)
      .withMessage("Invalid value recieved"),
  ];
};

const updateTaskStatusValidator = () => {
  return [
    body("status")
      .notEmpty()
      .withMessage("Status value is required")
      .isIn(AvailableTaskStatus)
      .withMessage("Invalid value recieved"),
  ];
};

const updateTaskValidator = () => {
  return [
    body("newTitle")
      .optional()
      .isLength({ max: 100 })
      .withMessage("Max 100 char are allowed")
      .isString()
      .withMessage("String format is required"),
    body("newDescription")
      .optional()
      .isLength({ max: 1000 })
      .withMessage("Max 1000 char are allowed"),
  ];
};

const createSubtaskValidator = () => {
  return [
    body("title")
      .notEmpty()
      .withMessage("Title is required for subtaks")
      .isLength({ max: 1000 })
      .withMessage("Max 1000 char are allowed")
      .isString()
      .withMessage("String format is required"),
    body("isCompleted")
      .optional()
      .isBoolean()
      .withMessage("Boolean value is required for task status"),
  ];
};

const updateSubtaskValidator = () => {
  return [
    body("title")
      .notEmpty()
      .withMessage("Title is required for subtaks")
      .isLength({ max: 1000 })
      .withMessage("Max 1000 char are allowed")
      .isString()
      .withMessage("String format is required"),
  ];
};

const updateSubtaskStatusValidator = () => {
  return [
    body("isCompleted")
      .notEmpty()
      .withMessage("Iscompleted value is required")
      .isBoolean()
      .withMessage("Boolean value is required for task status"),
  ];
};

export {
  userRegistrationValidator,
  userLoginValidator,
  resendVerificationEmailValidator,
  forgotPasswordRequestValidator,
  resetPasswordValidator,
  createProjectValidator,
  createTaskValidator,
  updateTaskStatusValidator,
  updateTaskValidator,
  createSubtaskValidator,
  updateSubtaskValidator,
  updateSubtaskStatusValidator,
};
