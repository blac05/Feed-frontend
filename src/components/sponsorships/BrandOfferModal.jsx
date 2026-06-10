export default function BrandOfferModal({
  open,
  onClose
}) {

  if(!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

      <div className="bg-white rounded-2xl p-6 w-[450px]">

        <h2 className="text-2xl font-bold mb-4">
          Sponsorship Offer
        </h2>

        <textarea
          placeholder="Offer Details"
          className="border p-3 rounded-lg w-full"
        />

        <button
          onClick={onClose}
          className="mt-4 bg-blue-600 text-white px-5 py-3 rounded-xl"
        >
          Send Offer
        </button>

      </div>

    </div>
  );
}
