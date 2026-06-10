import { Link } from "react-router-dom";

export default function SpaceCard({ space }) {
  return (
    <Link
      to={`/spaces/${space._id}`}
      className="
        bg-white
        rounded-2xl
        shadow
        p-5
        block
        hover:shadow-lg
        transition-shadow
      "
      aria-label={`Space: ${space.title}`}
    >
      <h2 className="font-bold text-xl mb-2">
        {space.title || "Untitled Space"}
      </h2>

      <p className="text-gray-500 mb-3">
        {space.description || "No description available."}
      </p>

      <div className="flex items-center justify-between">
        {space.isLive ? (
          <span className="text-green-600 font-semibold">LIVE</span>
        ) : (
          <span className="text-gray-400">Scheduled</span>
        )}

        {space.participants !== undefined && (
          <div className="text-sm text-gray-600">
            {space.participants} participant{space.participants !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </Link>
  );
}