import CampaignCard from "../components/ads/CampaignCard";

export default function AdsManager() {
  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-8">
        Ads Manager
      </h1>

      <CampaignCard />
    </div>
  );
}