import { Users } from "lucide-react";

export default function RecommendedUsers({ users = [] }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Users size={20} />
        Suggested Users
      </h2>

      {users.length === 0 ? (
        <p className="text-gray-500">No suggestions available.</p>
      ) : (
        users.map((user) => (
          <div
            key={user._id}
            className="flex justify-between items-center py-3 border-b last:border-b-0"
          >
            <div className="flex items-center gap-3">
              <img
                src={user.avatar || "https://i.pravatar.cc/40"}
                alt={`${user.username}'s avatar`}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="font-medium">{user.username}</span>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Follow
            </button>
          </div>
        ))
      )}
    </div>
  );
}