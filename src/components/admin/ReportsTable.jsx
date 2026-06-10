import { useEffect, useState } from "react";
import { getReports } from "../../services/adminService";

export default function ReportsTable() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    try {
      setLoading(true);
      const res = await getReports();
      setReports(res.data.reports);
    } catch (err) {
      setError("Failed to load reports");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Loading reports...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <table className="w-full">
      <thead>
        <tr>
          <th>Type</th>
          <th>Reason</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {reports.length > 0 ? (
          reports.map((report) => (
            <tr key={report._id}>
              <td>{report.targetType}</td>
              <td>{report.reason}</td>
              <td>{report.status}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="3" className="text-center">
              No reports found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}