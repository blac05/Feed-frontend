import AdPerformanceChart from "../components/ads/AdPerformanceChart";

export default function RevenueAnalytics() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center md:text-left">Revenue Analytics</h2>
      <div className="bg-white rounded-lg shadow p-4">
        <AdPerformanceChart />
      </div>
    </div>
  );
}