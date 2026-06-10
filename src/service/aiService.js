import api from "../api/axios";

export const generateCaption =
  text =>
    api.post("/ai/caption", {
      text,
    });

export const getForYouFeed =
  () =>
    api.get(
      "/recommendations/feed"
    );