import {
  useEffect,
  useState,
} from "react";

import CommunityCard
from "../components/communities/CommunityCard";

import CreateCommunityModal
from "../components/communities/CreateCommunityModal";

import {
  getCommunities,
}
from "../services/communityService";

export default function Communities() {

  const [communities,
    setCommunities] =
    useState([]);

  const [open,
    setOpen] =
    useState(false);

  useEffect(() => {

    const fetchData =
      async () => {

        const res =
          await getCommunities();

        setCommunities(
          res.data.communities
        );
      };

    fetchData();

  }, []);

  return (
    <div
      className="
      max-w-7xl
      mx-auto
      p-6
      "
    >
      <div
        className="
        flex
        justify-between
        items-center
        mb-8
        "
      >
        <h1
          className="
          text-4xl
          font-bold
          "
        >
          Communities
        </h1>

        <button
          onClick={() =>
            setOpen(true)
          }
          className="
          bg-blue-600
          text-white
          px-5
          py-3
          rounded-xl
          "
        >
          Create Community
        </button>
      </div>

      <div
        className="
        grid
        md:grid-cols-3
        gap-6
        "
      >
        {communities.map(
          community => (
            <CommunityCard
              key={community._id}
              community={community}
            />
          )
        )}
      </div>

      <CreateCommunityModal
        open={open}
        onClose={() =>
          setOpen(false)
        }
      />
    </div>
  );
}