import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CommunityFeed from "../components/communities/CommunityFeed";
import CommunitySidebar from "../components/communities/CommunitySidebar";
import { getCommunityPosts } from "../services/communityService";

export default function CommunityDetails() {
  const { id } = useParams();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch posts when component mounts or id changes
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getCommunityPosts(id);
        setPosts(res.data.posts);
      } catch (err) {
        setError("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [id]);

  // Optional: function to refresh posts after creating/deleting a post
  const refreshPosts = () => {
    fetchPosts();
  };

  return (
    <div className="max-w-7xl mx-auto p-6 grid md:grid-cols-4 gap-6">
      <div className="md:col-span-3">
        {/* Show loading indicator */}
        {loading && (
          <div className="text-center my-4 text-gray-600">Loading posts...</div>
        )}
        {/* Show error message */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>
        )}
        {/* Show message if no posts */}
        {!loading && posts.length === 0 && (
          <div className="text-center text-gray-600">No posts available.</div>
        )}
        {/* Show posts */}
        {!loading && !error && (
          <CommunityFeed posts={posts} />
        )}
      </div>

      <CommunitySidebar />
    </div>
  );
}