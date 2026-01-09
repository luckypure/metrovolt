import axios from "axios";

// Get API URL from environment or use default
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 10000, // 10 second timeout
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Enhanced error logging
    if (err.code === "ECONNREFUSED" || err.code === "ERR_NETWORK") {
      console.error("❌ Cannot connect to backend server!");
      console.error("💡 Make sure backend is running on http://localhost:5000");
      console.error("💡 Run: cd backend && npm run dev");
    } else if (err.request) {
      console.error("❌ Network Error:", err.message);
      console.error("Request URL:", err.config?.url);
      console.error("Full error:", err);
    } else if (err.response) {
      console.error("API Error:", err.response.status, err.response.data);
    } else {
      console.error("Error:", err.message);
    }
    return Promise.reject(err);
  }
);

export default api;
