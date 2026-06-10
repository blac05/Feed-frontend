import StatsCards
from "../components/admin/StatsCards";

export default function PlatformAnalytics(){
  return(
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Platform Analytics
      </h1>

      <StatsCards />
    </div>
  );
}