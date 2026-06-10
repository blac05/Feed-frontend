import {
  useEffect,
  useState
}
from "react";

import {
  getVerificationRequests
}
from "../../services/adminService";

export default function VerificationTable(){

  const [requests,setRequests] =
    useState([]);

  useEffect(()=>{
    loadRequests();
  },[]);

  async function loadRequests(){

    const res =
      await getVerificationRequests();

    setRequests(
      res.data.requests
    );
  }

  return(
    <table className="w-full">
      <thead>
        <tr>
          <th>User</th>
          <th>Name</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
      {requests.map(item=>(
        <tr key={item._id}>
          <td>
            {item.user?.username}
          </td>

          <td>
            {item.fullName}
          </td>

          <td>
            {item.status}
          </td>
        </tr>
      ))}
      </tbody>
    </table>
  );
}