import axios from "./axios";

// Login user
export const login = async (data) => {
  try {
    const response = await axios.post("/auth/login", data);
    // Optionally store token here if returned
    return response.data;
  } catch (error) {
    // Handle error gracefully
    throw error.response?.data || error.message;
  }
};

// Register user
export const register = async (data) => {
  try {
    const response = await axios.post("/auth/register", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get current user info
export const getMe = async () => {
  try {
    const response = await axios.get("/auth/me");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};