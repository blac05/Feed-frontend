import {
  Users,
} from "lucide-react";

export default function RecommendedUsers({
  users = [],
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Users size={20} />
        Suggested Users
      </h2>

      {users.map(user => (
        <div
          key={user._id}
          className="flex justify-between items-center py-3 border-b"
        >
          <div className="flex items-center gap-3">
            <img
              src={
                user.avatar
              }
              alt=""
              className="w-10 h-10 rounded-full"
            />

            <span>
              {
                user.username
              }
            </span>
          </div>

          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Follow
          </button>
        </div>
      ))}
    </div>
  );
}