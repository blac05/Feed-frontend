export default function BusinessCard() {
  return (
    <div className="bg-white rounded-2xl shadow p-6 max-w-sm mx-auto">
      <h2 className="text-2xl font-bold mb-2">Feed Business</h2>
      <p className="text-gray-500 mb-4">
        Manage your company profile, campaigns, and sponsorships.
      </p>
      <div className="flex space-x-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          Edit Profile
        </button>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
          View Campaigns
        </button>
      </div>
    </div>
  );
}