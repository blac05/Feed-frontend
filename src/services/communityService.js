import api from "../api/axios";

// Fetch list of communities
export const getCommunities = async () => {
  try {
    const response = await api.get("/communities");
    return response.data;
  } catch (error) {
    console.error("Error fetching communities:", error);
    throw error;
  }
};

// Create a new community
export const createCommunity = async (data) => {
  try {
    const response = await api.post("/communities", data);
    return response.data;
  } catch (error) {
    console.error("Error creating community:", error);
    throw error;
  }
};

// Join a community by ID
export const joinCommunity = async (id) => {
  try {
    const response = await api.post(`/communities/${id}/join`);
    return response.data;
  } catch (error) {
    console.error(`Error joining community with ID ${id}:`, error);
    throw error;
  }
};

// Get posts of a specific community
export const getCommunityPosts = async (id) => {
  try {
    const response = await api.get(`/communities/${id}/posts`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching posts for community ID ${id}:`, error);
    throw error;
  }
};

// Create a post in a community
export const createCommunityPost = async (id, data) => {
  try {
    const response = await api.post(`/communities/${id}/posts`, data);
    return response.data;
  } catch (error) {
    console.error(`Error creating post in community ID ${id}:`, error);
    throw error;
  }
};