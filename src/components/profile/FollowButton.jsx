import api from "../../Api/axios";

export default function FollowButton({
  userId,
}) {
  const follow = async () => {
    await api.post(
      `/users/${userId}/follow`
    );
  };

  return (
    <button
      onClick={follow}
      className="bg-blue-600 text-white px-5 py-2 rounded-xl"
    >
      Follow
    </button>
  );
}