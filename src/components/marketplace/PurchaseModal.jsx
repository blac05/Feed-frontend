export default function PurchaseModal({
  open,
  onClose,
  onConfirm,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 w-[400px]">
        <h2 className="text-2xl font-bold mb-4">
          Confirm Purchase
        </h2>

        <p>
          Do you want to buy
          this product?
        </p>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 border rounded-xl py-2"
          >
            Cancel
          </button>

          <button
            onClick={
              onConfirm
            }
            className="flex-1 bg-blue-600 text-white rounded-xl py-2"
          >
            Buy
          </button>
        </div>
      </div>
    </div>
  );
}