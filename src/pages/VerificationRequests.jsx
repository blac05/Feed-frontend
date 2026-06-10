import VerificationTable
from "../components/admin/VerificationTable";

export default function VerificationRequests(){
  return(
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Verification Requests
      </h1>

      <VerificationTable />
    </div>
  );
}