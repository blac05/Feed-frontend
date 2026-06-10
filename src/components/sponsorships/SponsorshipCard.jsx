export default function SponsorshipCard({ sponsorship }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition-shadow duration-300">
      <h3 className="font-bold text-xl mb-2">{sponsorship.brand}</h3>
      <p className="text-gray-700 mb-4">
        Sponsorship Amount: ${sponsorship.amount}
      </p>
      <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition-colors duration-200">
        View Details
      </button>
    </div>
  );
}