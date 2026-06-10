import {
  useEffect,
  useState
}
from "react";

import {
  getReports
}
from "../../services/adminService";

export default function ReportsTable(){

  const [reports,setReports] =
    useState([]);

  useEffect(()=>{
    loadReports();
  },[]);

  async function loadReports(){

    const res =
      await getReports();

    setReports(
      res.data.reports
    );
  }

  return(
    <table className="w-full">
      <thead>
        <tr>
          <th>Type</th>
          <th>Reason</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
      {reports.map(report=>(
        <tr key={report._id}>
          <td>{report.targetType}</td>
          <td>{report.reason}</td>
          <td>{report.status}</td>
        </tr>
      ))}
      </tbody>
    </table>
  );
}