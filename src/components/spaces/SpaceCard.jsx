import { Link } from "react-router-dom";

export default function SpaceCard({
  space,
}) {
  return (
    <Link
      to={`/spaces/${space._id}`}
      className="
      bg-white
      rounded-2xl
      shadow
      p-5
      block
      "
    >
      <h2 className="font-bold text-xl">
        {space.title}
      </h2>

      <p className="text-gray-500">
        {space.description}
      </p>

      <span className="text-green-600">
        LIVE
      </span>
    </Link>
  );
}