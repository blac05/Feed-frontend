import { Link } from "react-router-dom";

export default function PodcastCard({
  podcast,
}) {
  return (
    <Link
      to={`/podcast/${podcast._id}`}
      className="bg-white rounded-2xl shadow p-4 block"
    >
      <img
        src={podcast.coverImage}
        alt=""
        className="w-full h-48 object-cover rounded-xl"
      />

      <h2 className="font-bold text-xl mt-4">
        {podcast.title}
      </h2>

      <p className="text-gray-500">
        {podcast.description}
      </p>
    </Link>
  );
}