import { useState, useEffect } from "react";
import VerificationTable from "../components/admin/VerificationTable";

export default function VerificationRequests() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetch
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <section className="p-8 max-w-7xl mx-auto bg-white rounded-lg shadow-md flex justify-center items-center h-64">
        <p className="text-xl font-semibold text-gray-500">Loading verification requests...</p>
      </section>
    );
  }

  return (
    <section className="p-8 max-w-7xl mx-auto bg-white rounded-lg shadow-md">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Verification Requests
        </h1>
        <p className="text-lg text-gray-600">
          Review and manage user verification submissions efficiently.
        </p>
      </header>

      {/* Verification Table */}
      <div className="overflow-x-auto">
        <VerificationTable />
      </div>
    </section>
  );
}