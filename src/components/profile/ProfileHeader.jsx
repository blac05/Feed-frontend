import FollowButton from "./FollowButton";

export default function ProfileHeader({ user }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow max-w-3xl mx-auto">
      <div className="flex items-center gap-5">
        <img
          src={user.avatar || "https://i.pravatar.cc/200"}
          alt={`${user.username}'s avatar`}
          className="h-24 w-24 rounded-full object-cover"
        />

        <div>
          <h1 className="text-2xl font-bold mb-2">{user.username}</h1>

          <div className="flex space-x-4 mb-3">
            <div>
              <p className="font-semibold">{user.followers ?? 0}</p>
              <p className="text-gray-600 text-sm">Followers</p>
            </div>
            <div>
              <p className="font-semibold">{user.following ?? 0}</p>
              <p className="text-gray-600 text-sm">Following</p>
            </div>
          </div>

          <div className="mt-3">
            <FollowButton userId={user._id} />
          </div>
        </div>
      </div>
    </div>
  );
}