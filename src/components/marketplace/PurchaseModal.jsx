import { useEffect, useRef } from "react";

export default function PurchaseModal({ open, onClose, onConfirm, productName }) {
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    if (open && cancelButtonRef.current) {
      cancelButtonRef.current.focus();
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300"
      aria-modal="true"
      role="dialog"
      aria-labelledby="purchase-modal-title"
    >
      <div className="bg-white rounded-2xl p-6 w-[400px] relative shadow-lg">
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <h2
          id="purchase-modal-title"
          className="text-2xl font-bold mb-4"
        >
          Confirm Purchase
        </h2>

        <p className="mb-4">
          Do you want to buy <strong>{productName}</strong>?
        </p>

        <div className="flex gap-3 mt-6">
          <button
            ref={cancelButtonRef}
            onClick={onClose}
            className="flex-1 border rounded-xl py-2"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 bg-blue-600 text-white rounded-xl py-2"
          >
            Buy
          </button>
        </div>
      </div>
    </div>
  );
}