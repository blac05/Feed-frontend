import axios from "./axios";

// Fetch all live streams
export const getLiveStreams = async () => {
  try {
    const response = await axios.get("/live");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Start a new live session
export const startLive = async (data) => {
  try {
    const response = await axios.post("/live/start", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Join a specific live session by ID
export const joinLive = async (id) => {
  try {
    const response = await axios.get(`/live/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};