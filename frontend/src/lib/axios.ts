import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3500",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request  interceptor

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      // redirect to login page
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default api;
