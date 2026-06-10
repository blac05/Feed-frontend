import BusinessStats from "../components/business/BusinessStats";
import BusinessCard from "../components/business/BusinessCard";

export default function BusinessDashboard() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">
        Business Dashboard
      </h1>

      <BusinessStats />

      <div className="mt-8">
        <BusinessCard />
      </div>
    </div>
  );
}