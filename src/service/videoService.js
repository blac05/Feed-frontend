import api from "../Api/axios";

// Fetch the video feed
export const getReels = async () => {
  try {
    const response = await api.get("/videos/feed");
    return response.data;
  } catch (error) {
    console.error("Error fetching reels:", error);
    throw error;
  }
};

// Upload a new reel/video
export const uploadReel = async (data) => {
  try {
    const response = await api.post("/videos", data);
    return response.data;
  } catch (error) {
    console.error("Error uploading reel:", error);
    throw error;
  }
};

// Like a video
export const likeVideo = async (videoId) => {
  try {
    const response = await api.post("/video-likes", { videoId });
    return response.data;
  } catch (error) {
    console.error(`Error liking video ${videoId}:`, error);
    throw error;
  }
};

// Get likes for a specific video
export const getVideoLikes = async (videoId) => {
  try {
    const response = await api.get(`/video-likes/${videoId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching likes for video ${videoId}:`, error);
    throw error;
  }
};

// Get comments for a specific video
export const getComments = async (videoId) => {
  try {
    const response = await api.get(`/video-comments/${videoId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching comments for video ${videoId}:`, error);
    throw error;
  }
};

// Add a comment to a video
export const addComment = async (videoId, text) => {
  try {
    const response = await api.post("/video-comments", {
      videoId,
      text,
    });
    return response.data;
  } catch (error) {
    console.error(`Error adding comment to video ${videoId}:`, error);
    throw error;
  }
};

// Delete a comment by ID
export const deleteComment = async (commentId) => {
  try {
    const response = await api.delete(`/video-comments/${commentId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting comment ${commentId}:`, error);
    throw error;
  }
};