import api from "../api/axios";

export const getCommunities = () =>
  api.get("/communities");

export const createCommunity = data =>
  api.post("/communities", data);

export const joinCommunity = id =>
  api.post(`/communities/${id}/join`);

export const getCommunityPosts = id =>
  api.get(`/communities/${id}/posts`);

export const createCommunityPost = (
  id,
  data
) =>
  api.post(
    `/communities/${id}/posts`,
    data
  );