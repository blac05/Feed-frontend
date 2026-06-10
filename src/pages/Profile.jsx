import { useEffect, useState } from "react";

import Layout from "../src/components/layout/Layout";
import ProfileHeader from "../components/profile/ProfileHeader";
import api from "../Api/axios";

export default function Profile() {
  const [user, setUser] =
    useState(null);

  useEffect(() => {
    api
      .get("/users/me")
      .then(res =>
        setUser(res.data.user)
      );
  }, []);

  if (!user)
    return <div>Loading...</div>;

  return (
    <Layout>
      <ProfileHeader
        user={user}
      />
    </Layout>
  );
}