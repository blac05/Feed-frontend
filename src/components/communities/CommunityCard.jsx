import { Link } from "react-router-dom";

export default function CommunityCard({
  community,
}) {
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
      "
    >
      <img
        src={
          community.banner ||
          "https://via.placeholder.com/600x200"
        }
        alt=""
        className="
        h-40
        w-full
        object-cover
        "
      />

      <div className="p-4">
        <h2 className="font-bold text-xl">
          {community.name}
        </h2>

        <p className="text-gray-500 mt-2">
          {community.description}
        </p>

        <p className="text-sm mt-4">
          {community.membersCount}
          {" "}members
        </p>
      </div>
    </Link>
  );
}