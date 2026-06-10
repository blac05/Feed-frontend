import { useEffect, useState } from "react";
import { getVerificationRequests } from "../../services/adminService";

export default function VerificationTable() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    try {
      setLoading(true);
      const res = await getVerificationRequests();
      if (res.data && res.data.requests) {
        setRequests(res.data.requests);
      } else {
        setRequests([]);
      }
    } catch (err) {
      setError("Failed to load verification requests");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="p-4 text-center">Loading verification requests...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  if (requests.length === 0) {
    return <div className="p-4 text-center text-gray-500">No verification requests found.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow" role="table" aria-label="Verification Requests">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
              User
            </th>
            <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {requests.map((item) => (
            <tr key={item._id} className="hover:bg-gray-100 cursor-pointer">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.user?.username}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.fullName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}