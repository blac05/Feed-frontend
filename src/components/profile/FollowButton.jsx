import { useState } from "react";
import api from "../../api/axios";

export default function FollowButton({ userId }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [error, setError] = useState(null);
  const [followed, setFollowed] = useState(false);

  const follow = async () => {
    try {
      setIsFollowing(true);
      await api.post(`/users/${userId}/follow`);
      setFollowed(true);
    } catch (err) {
      setError("Failed to follow. Please try again.");
    } finally {
      setIsFollowing(false);
    }
  };

  return (
    <button
      onClick={follow}
      disabled={isFollowing || followed}
      aria-label={followed ? "Unfollow user" : "Follow user"}
      className={`bg-blue-600 text-white px-5 py-2 rounded-xl disabled:bg-gray-400 disabled:cursor-not-allowed`}
    >
      {followed ? "Following" : isFollowing ? "Following..." : "Follow"}
    </button>
  );
}