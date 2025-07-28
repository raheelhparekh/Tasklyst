import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" 
    ? "http://localhost:8000/api/v1/" 
    : import.meta.env.VITE_API_URL || "/api/v1/",
  withCredentials: true,
  timeout: 10000, // 10 second timeout
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // You can add auth tokens or other headers here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors globally
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
    } else if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access');
      // You might want to redirect to login page here
    } else if (error.response?.status >= 500) {
      console.error('Server error');
    }
    
    return Promise.reject(error);
  }
);
