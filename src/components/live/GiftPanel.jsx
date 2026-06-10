import { useState } from "react";
import { sendGift } from "../../Api/giftApi";

const gifts = [
  { emoji: "🌹", id: 1 },
  { emoji: "❤️", id: 2 },
  { emoji: "☕", id: 3 },
  { emoji: "🚀", id: 4 },
  { emoji: "💎", id: 5 },
  { emoji: "🏰", id: 6 },
];

export default function GiftPanel() {
  const [loadingGiftId, setLoadingGiftId] = useState(null);
  const [message, setMessage] = useState("");

  const handleGift = async (giftId) => {
    setLoadingGiftId(giftId);
    setMessage("");
    try {
      await sendGift("live-id", giftId);
      setMessage("Gift sent!");
    } catch (error) {
      setMessage("Failed to send gift. Please try again.");
    } finally {
      setLoadingGiftId(null);
    }
  };

  return (
    <div>
      {message && <p className="mb-2 text-center text-green-600">{message}</p>}
      <div className="grid grid-cols-3 gap-3">
        {gifts.map((gift) => (
          <button
            key={gift.id}
            onClick={() => handleGift(gift.id)}
            disabled={loadingGiftId === gift.id}
            className={`bg-blue-600 text-white p-4 rounded-xl text-3xl transition-opacity ${
              loadingGiftId === gift.id ? "opacity-50 cursor-not-allowed" : ""
            }`}
            aria-busy={loadingGiftId === gift.id}
            aria-label={`Send ${gift.emoji} gift`}
          >
            {gift.emoji}
          </button>
        ))}
      </div>
    </div>
  );
}