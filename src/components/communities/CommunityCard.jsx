import { Link } from "react-router-dom";

export default function CommunityCard({ community }) {
  return (
    <Link
      to={`/community/${community._id}`}
      className="
        bg-white
        rounded-2xl
        shadow-md
        overflow-hidden
        hover:shadow-xl
        transition
        block
        focus:outline-none
        focus:ring-2
        focus:ring-blue-500
      "
    >
      <img
        src={
          community.banner ||
          "https://via.placeholder.com/600x200"
        }
        alt={community.name || "Community banner"}
        className="
          h-40
          w-full
          object-cover
        "
      />

      <div className="p-4">
        <h2 className="font-bold text-xl mb-2">
          {community.name || "Community Name"}
        </h2>

        <p className="text-gray-500 mt-2 line-clamp-2">
          {community.description || "No description available."}
        </p>

        <p className="text-sm mt-4 text-gray-600">
          {community.membersCount ?? 0} members
        </p>
      </div>
    </Link>
  );
}