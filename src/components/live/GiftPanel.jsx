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
  const handleGift = async (
    giftId
  ) => {
    await sendGift(
      "live-id",
      giftId
    );
  };

  return (
    <div className="grid grid-cols-3 gap-3">
      {gifts.map(gift => (
        <button
          key={gift.id}
          onClick={() =>
            handleGift(gift.id)
          }
          className="bg-blue-600 text-white p-4 rounded-xl text-3xl"
        >
          {gift.emoji}
        </button>
      ))}
    </div>
  );
}