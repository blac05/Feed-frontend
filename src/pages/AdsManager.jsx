import CampaignCard from "../components/ads/CampaignCard";

export default function AdsManager() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <h1 className="text-4xl font-bold mb-4 text-gray-800">Ads Manager</h1>
      
      {/* Optional Description */}
      <p className="mb-8 text-gray-600">
        Manage your advertising campaigns efficiently. Create, edit, and monitor your campaigns here.
      </p>
      
      {/* Campaign Card Section */}
      <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
        <CampaignCard />
      </div>
      
      {/* Future: You can add a list of campaigns or filters below */}
    </div>
  );
}