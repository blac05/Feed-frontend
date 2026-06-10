import {
  useEffect,
  useState,
} from "react";

import Layout from "../src/components/layout/Layout";

import StoryCard from "../components/stories/StoryCard";

import StoryViewer from "../components/stories/StoryViewer";

import api from "../Api/axios";

export default function Stories() {
  const [stories, setStories] =
    useState([]);

  const [selectedStory,
    setSelectedStory] =
    useState(null);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories =
    async () => {
      try {
        const res =
          await api.get(
            "/stories"
          );

        setStories(
          res.data.stories
        );
      } catch (error) {
        console.error(error);
      }
    };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8">
        Stories
      </h1>

      <div className="flex flex-wrap gap-6">
        {stories.map(story => (
          <StoryCard
            key={story._id}
            story={story}
            onOpen={
              setSelectedStory
            }
          />
        ))}
      </div>

      {selectedStory && (
        <StoryViewer
          story={selectedStory}
          onClose={() =>
            setSelectedStory(
              null
            )
          }
        />
      )}
    </Layout>
  );
}