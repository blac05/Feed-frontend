import {
  useEffect,
  useState
}
from "react";

import {
  getUsers
}
from "../../services/adminService";

export default function UsersTable(){

  const [users,setUsers] =
    useState([]);

  useEffect(()=>{
    loadUsers();
  },[]);

  async function loadUsers(){

    const res =
      await getUsers();

    setUsers(
      res.data.users
    );
  }

  return(
    <table className="w-full">
      <thead>
        <tr>
          <th>User</th>
          <th>Email</th>
        </tr>
      </thead>

      <tbody>
      {users.map(user=>(
        <tr key={user._id}>
          <td>{user.username}</td>
          <td>{user.email}</td>
        </tr>
      ))}
      </tbody>
    </table>
  );
}