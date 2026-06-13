import api from "../api/axios";

// Generate a caption based on input text
export const generateCaption = async (text) => {
  try {
    const response = await api.post("/ai/caption", { text });
    return response.data;
  } catch (error) {
    console.error("Error generating caption:", error);
    throw error;
  }
};

// Fetch the "For You" feed
export const getForYouFeed = async () => {
  try {
    const response = await api.get("/recommendations/feed");
    return response.data;
  } catch (error) {
    console.error("Error fetching the feed:", error);
    throw error;
  }
};