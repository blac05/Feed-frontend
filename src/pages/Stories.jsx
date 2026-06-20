import { useEffect, useState } from "react";
import Layout from "../components/MainLayout/Layout";
import StoryCard from "../components/stories/StoriesCard";
import StoryViewer from "../components/stories/StoriesViewer";
import api from "../api/axios";

export default function Stories() {
  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/stories");
      setStories(res.data.stories);
    } catch (err) {
      console.error(err);
      setError("Failed to load stories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8 text-center">Stories</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {stories.map((story) => (
            <StoryCard
              key={story._id}
              story={story}
              onOpen={setSelectedStory}
            />
          ))}
        </div>
      )}

      {selectedStory && (
        <StoryViewer
          story={selectedStory}
          onClose={() => setSelectedStory(null)}
        />
      )}
    </Layout>
  );
}