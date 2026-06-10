import {
  useEffect,
  useState,
} from "react";

import {
  getForYouFeed,
} from "../../services/aiService";

export default function ForYouFeed() {
  const [posts,
    setPosts] =
    useState([]);

  const [videos,
    setVideos] =
    useState([]);

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed =
    async () => {
      try {
        const res =
          await getForYouFeed();

        setPosts(
          res.data.data.posts
        );

        setVideos(
          res.data.data.videos
        );
      } catch (error) {
        console.error(error);
      }
    };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">
          Recommended Videos
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          {videos.map(
            video => (
              <div
                key={
                  video._id
                }
                className="bg-white rounded-xl overflow-hidden shadow"
              >
                <img
                  src={
                    video.thumbnail
                  }
                  alt=""
                  className="w-full h-52 object-cover"
                />

                <div className="p-4">
                  {
                    video.caption
                  }
                </div>
              </div>
            )
          )}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">
          Recommended Posts
        </h2>

        {posts.map(
          post => (
            <div
              key={
                post._id
              }
              className="bg-white rounded-xl p-4 shadow mb-4"
            >
              {
                post.content
              }
            </div>
          )
        )}
      </div>
    </div>
  );
}