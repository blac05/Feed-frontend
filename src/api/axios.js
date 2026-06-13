import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://feed-er99.onrender.com/api",
  // You can add default headers here if needed
});

// Request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request error globally
    return Promise.reject(error);
  }
);

// Optional: Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally, e.g., token expiration
    if (error.response && error.response.status === 401) {
      // Handle unauthorized errors, like redirect to login
      // e.g., window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;