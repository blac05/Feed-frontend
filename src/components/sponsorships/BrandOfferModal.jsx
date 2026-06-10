import { useState } from "react";

export default function BrandOfferModal({ open, onClose }) {
  const [offerDetails, setOfferDetails] = useState("");

  if (!open) return null;

  const handleSend = () => {
    // Handle submission logic here
    console.log("Offer sent:", offerDetails);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Stop propagation to prevent closing when clicking inside modal */}
      <div
        className="bg-white rounded-2xl p-6 w-[450px]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modalTitle"
      >
        <h2
          id="modalTitle"
          className="text-2xl font-bold mb-4"
        >
          Sponsorship Offer
        </h2>

        <textarea
          placeholder="Offer Details"
          className="border p-3 rounded-lg w-full"
          rows={4}
          value={offerDetails}
          onChange={(e) => setOfferDetails(e.target.value)}
        />

        <div className="flex justify-end space-x-3 mt-4">
          <button
            onClick={onClose}
            className="bg-gray-300 text-black px-4 py-2 rounded-xl"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white px-5 py-3 rounded-xl"
          >
            Send Offer
          </button>
        </div>
      </div>
    </div>
  );
}