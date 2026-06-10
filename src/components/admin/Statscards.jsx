import {
  useEffect,
  useState
}
from "react";

export default function StatsCards(){

  const [stats,setStats] =
    useState(null);

  useEffect(()=>{
    fetchStats();
  },[]);

  async function fetchStats(){

    const res =
      await fetch(
        "/api/analytics/platform"
      );

    const data =
      await res.json();

    setStats(
      data.stats
    );
  }

  if(!stats)
    return null;

  return(
    <div className="grid md:grid-cols-3 gap-6 mt-8">

      <div className="bg-white p-6 rounded-2xl shadow">
        <h2>Users</h2>
        <p className="text-3xl font-bold">
          {stats.users}
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow">
        <h2>Posts</h2>
        <p className="text-3xl font-bold">
          {stats.posts}
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow">
        <h2>Videos</h2>
        <p className="text-3xl font-bold">
          {stats.videos}
        </p>
      </div>

    </div>
  );
}