import { useEffect, useState } from "react";
import { getForYouFeed } from "../../services/aiService";

export default function ForYouFeed() {
  const [posts, setPosts] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getForYouFeed();
      setPosts(res.data.data.posts);
      setVideos(res.data.data.videos);
    } catch (error) {
      console.error(error);
      setError("Failed to load feed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>{error}</p>
        <button
          onClick={loadFeed}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Videos Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Recommended Videos</h2>
        {videos.length === 0 ? (
          <p className="text-gray-500">No videos available.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {videos.map((video) => (
              <div
                key={video._id}
                className="bg-white rounded-xl overflow-hidden shadow"
              >
                <img
                  src={video.thumbnail}
                  alt={video.caption || "Video thumbnail"}
                  className="w-full h-52 object-cover"
                />
                <div className="p-4">
                  {video.caption}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Posts Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Recommended Posts</h2>
        {posts.length === 0 ? (
          <p className="text-gray-500">No posts available.</p>
        ) : (
          posts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-xl p-4 shadow mb-4"
            >
              {post.content}
            </div>
          ))
        )}
      </div>
    </div>
  );
}