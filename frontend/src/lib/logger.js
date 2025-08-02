// Simple logger for frontend
const isDevelopment = import.meta.env.MODE === 'development';

const logger = {
  info: (message, ...args) => {
    if (isDevelopment) {
      console.log(`[INFO] ${new Date().toISOString()} - ${message}`, ...args);
    }
  },
  
  warn: (message, ...args) => {
    if (isDevelopment) {
      console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, ...args);
    }
  },
  
  error: (message, ...args) => {
    // Always log errors, even in production
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, ...args);
  },
  
  debug: (message, ...args) => {
    if (isDevelopment) {
      console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, ...args);
    }
  },

  // For API errors specifically
  apiError: (endpoint, error) => {
    const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
    const status = error.response?.status || 'Unknown status';
    
    if (isDevelopment) {
      console.error(`[API ERROR] ${endpoint} - ${status} - ${errorMessage}`, error);
    } else {
      // In production, log simplified version
      console.error(`[API ERROR] ${endpoint} - ${status} - ${errorMessage}`);
    }
  }
};

export default logger;
