import api from "./axios";

// Send a gift during a live session
export const sendGift = async (liveId, giftId) => {
  try {
    const response = await api.post("/gifts/send", {
      liveId,
      giftId,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};