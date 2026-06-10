import { useEffect, useState } from "react";
import { getUsers } from "../../services/adminService";

export default function UsersTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);
      const res = await getUsers();
      if (res.data && res.data.users) {
        setUsers(res.data.users);
      } else {
        setUsers([]);
      }
    } catch (err) {
      setError("Failed to load users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (users.length === 0) {
    return <div>No users found.</div>;
  }

  return (
    <table className="w-full">
      <thead>
        <tr>
          <th>User</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user._id}>
            <td>{user.username}</td>
            <td>{user.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}