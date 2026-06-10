import ReportsTable
from "../components/admin/ReportsTable";

export default function Reports(){
  return(
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Reports
      </h1>

      <ReportsTable />
    </div>
  );
}