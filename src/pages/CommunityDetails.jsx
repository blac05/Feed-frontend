import {
  useEffect,
  useState,
} from "react";

import { useParams }
from "react-router-dom";

import CommunityFeed
from "../components/communities/CommunityFeed";

import CommunitySidebar
from "../components/communities/CommunitySidebar";

import {
  getCommunityPosts,
} from "../services/communityService";

export default function CommunityDetails() {

  const { id } =
    useParams();

  const [posts,
    setPosts] =
    useState([]);

  useEffect(() => {

    const fetchPosts =
      async () => {

        const res =
          await getCommunityPosts(
            id
          );

        setPosts(
          res.data.posts
        );
      };

    fetchPosts();

  }, [id]);

  return (
    <div
      className="
      max-w-7xl
      mx-auto
      p-6
      grid
      md:grid-cols-4
      gap-6
      "
    >
      <div
        className="
        md:col-span-3
        "
      >
        <CommunityFeed
          posts={posts}
        />
      </div>

      <CommunitySidebar />
    </div>
  );
}