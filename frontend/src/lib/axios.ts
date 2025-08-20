/**
 * Axios configuration - handles API requests with authentication and error handling
 */

import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

// Validate environment variable
if (!baseURL) {
  throw new Error("VITE_API_URL is not set");
}

// Create axios instance with base configuration
const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - adds JWT token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handles authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Redirect to login on 401 (missing/invalid token)
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default api;
