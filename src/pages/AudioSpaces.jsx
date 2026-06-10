import { useEffect, useState } from "react";
import SpaceCard from "../components/spaces/SpaceCard";
import api from "../api/axios";

export default function AudioSpaces() {

  const [spaces, setSpaces] =
    useState([]);

  useEffect(() => {
    fetchSpaces();
  }, []);

  const fetchSpaces = async () => {
    const res =
      await api.get("/spaces");

    setSpaces(res.data.spaces);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">

      <h1 className="text-4xl font-bold mb-8">
        Audio Spaces
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {spaces.map((space) => (
          <SpaceCard
            key={space._id}
            space={space}
          />
        ))}
      </div>

    </div>
  );
}