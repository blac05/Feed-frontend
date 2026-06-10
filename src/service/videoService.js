import api from "../src/Api/axios";

export const getReels = () =>
  api.get("/videos/feed");

export const uploadReel = data =>
  api.post("/videos", data);

export const likeVideo = videoId =>
  api.post("/video-likes", {
    videoId,
  });

export const getVideoLikes =
  videoId =>
    api.get(
      `/video-likes/${videoId}`
    );

export const getComments =
  videoId =>
    api.get(
      `/video-comments/${videoId}`
    );

export const addComment = (
  videoId,
  text
) =>
  api.post(
    "/video-comments",
    {
      videoId,
      text,
    }
  );

export const deleteComment =
  commentId =>
    api.delete(
      `/video-comments/${commentId}`
    );