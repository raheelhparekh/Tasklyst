/**
 * Validation utilities for frontend forms
 */

export const validators = {
  // Email validation
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return null;
  },

  // Password validation
  password: (password) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters long";
    if (password.length > 128) return "Password must be less than 128 characters";
    return null;
  },

  // Username validation
  username: (username) => {
    if (!username) return "Username is required";
    if (username.length < 3) return "Username must be at least 3 characters long";
    if (username.length > 30) return "Username must be less than 30 characters";
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return "Username can only contain letters, numbers, and underscores";
    return null;
  },

  // Project name validation
  projectName: (name) => {
    if (!name) return "Project name is required";
    if (name.trim().length < 2) return "Project name must be at least 2 characters long";
    if (name.trim().length > 100) return "Project name must be less than 100 characters";
    return null;
  },

  // Task title validation
  taskTitle: (title) => {
    if (!title) return "Task title is required";
    if (title.trim().length < 3) return "Task title must be at least 3 characters long";
    if (title.trim().length > 200) return "Task title must be less than 200 characters";
    return null;
  },

  // Description validation (optional field)
  description: (description) => {
    if (description && description.length > 1000) return "Description must be less than 1000 characters";
    return null;
  },

  // Due date validation
  dueDate: (date) => {
    if (!date) return null; // Optional field
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) return "Due date cannot be in the past";
    return null;
  },

  // Priority validation
  priority: (priority) => {
    const validPriorities = ['low', 'medium', 'high'];
    if (!priority) return "Priority is required";
    if (!validPriorities.includes(priority)) return "Invalid priority selected";
    return null;
  },

  // Required field validation
  required: (value, fieldName) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return `${fieldName} is required`;
    }
    return null;
  },

  // Role validation
  role: (role) => {
    const validRoles = ['admin', 'project_admin', 'member'];
    if (!role) return "Role is required";
    if (!validRoles.includes(role)) return "Invalid role selected";
    return null;
  },

  // Member email validation (for adding members)
  memberEmail: (email, currentUserEmail) => {
    const emailError = validators.email(email);
    if (emailError) return emailError;
    
    if (email === currentUserEmail) {
      return "You cannot add yourself to the project";
    }
    return null;
  }
};

/**
 * Sanitization utilities
 */
export const sanitizers = {
  // Basic HTML sanitization (removes HTML tags)
  html: (input) => {
    if (!input) return '';
    return input.replace(/<[^>]*>/g, '');
  },

  // Trim whitespace
  trim: (input) => {
    if (!input) return '';
    return input.trim();
  },

  // Remove extra whitespace
  normalizeSpaces: (input) => {
    if (!input) return '';
    return input.replace(/\s+/g, ' ').trim();
  },

  // Sanitize for search queries
  searchQuery: (input) => {
    if (!input) return '';
    return input.replace(/[<>]/g, '').trim();
  }
};

/**
 * Form validation helper
 */
export const validateForm = (data, rules) => {
  const errors = {};
  
  for (const [field, validationRules] of Object.entries(rules)) {
    const value = data[field];
    
    for (const rule of validationRules) {
      const error = rule(value);
      if (error) {
        errors[field] = error;
        break; // Stop at first error for this field
      }
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Sanitize form data
 */
export const sanitizeFormData = (data, sanitizationRules) => {
  const sanitized = { ...data };
  
  for (const [field, sanitizer] of Object.entries(sanitizationRules)) {
    if (sanitized[field] !== undefined) {
      sanitized[field] = sanitizer(sanitized[field]);
    }
  }
  
  return sanitized;
};
