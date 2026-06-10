import api from "./axios";

export const sendGift = (
  liveId,
  giftId
) => {
  return api.post(
    "/gifts/send",
    {
      liveId,
      giftId,
    }
  );
};