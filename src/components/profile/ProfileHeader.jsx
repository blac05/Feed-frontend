import FollowButton from "./FollowButton";

export default function ProfileHeader({
  user,
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow">
      <div className="flex items-center gap-5">
        <img
          src={
            user.avatar ||
            "https://i.pravatar.cc/200"
          }
          className="h-24 w-24 rounded-full"
        />

        <div>
          <h1 className="text-2xl font-bold">
            {user.username}
          </h1>

          <p>
            {user.followers || 0}
            Followers
          </p>

          <p>
            {user.following || 0}
            Following
          </p>

          <div className="mt-3">
            <FollowButton
              userId={user._id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}