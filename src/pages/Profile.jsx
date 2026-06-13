import { useEffect, useState } from "react";

import Layout from "../components/layout/Layout";
import ProfileHeader from "../components/profile/ProfileHeader";
import api from "../api/axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/users/me")
      .then(res => {
        setUser(res.data.user);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load user data");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error)
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded">
        {error}
      </div>
    );

  return (
    <Layout>
      <ProfileHeader user={user} />
    </Layout>
  );
}