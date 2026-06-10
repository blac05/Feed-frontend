import StatsCards
from "../components/admin/StatsCards";

export default function AdminDashboard(){
  return(
    <div className="p-8">
      <h1 className="text-4xl font-bold">
        Admin Dashboard
      </h1>

      <StatsCards />
    </div>
  );
}