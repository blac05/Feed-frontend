import axios from "./axios";

// Fetch all posts
export const getPosts = async () => {
  try {
    const response = await axios.get("/posts");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Create a new post
export const createPost = async (data) => {
  try {
    const response = await axios.post("/posts", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete a post by ID
export const deletePost = async (id) => {
  try {
    const response = await axios.delete(`/posts/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};