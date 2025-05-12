import { body } from "express-validator";

const userRegistrationValidator = () => {
  // returns an array
  return [
    body("username")
      .trim()
      .notEmpty().withMessage("Username is required")
      .isLength({ min: 3, max: 20 }).withMessage("Username must be between 3 and 20 characters")
      .matches(/^[a-zA-Z0-9_]+$/).withMessage("Username can only contain letters, numbers, and underscores"),

    // Email: valid format
    body("email")
      .trim()
      .notEmpty().withMessage("Email is required")
      .isEmail().withMessage("Invalid email address"),

    // Password: min 8 chars, at least one uppercase, one lowercase, one number, one special character
    body("password")
      .notEmpty().withMessage("Password is required")
      .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
      .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
      .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
      .matches(/[0-9]/).withMessage("Password must contain at least one number")
      .matches(/[\W_]/).withMessage("Password must contain at least one special character"),
  ];
};

const userLoginValidator = () => {
    return [
         // Email: must be valid
        body('email')
            .trim()
            .notEmpty().withMessage('Email is required')
            .isEmail().withMessage('Invalid email address'),

        // Password: required (no need to revalidate complexity here)
        body('password')
            .notEmpty().withMessage('Password is required'),
    ]
};

export { userRegistrationValidator, userLoginValidator };
