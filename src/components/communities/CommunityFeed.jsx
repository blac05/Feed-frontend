export default function CommunityFeed({ posts }) {
  return (
    <div className="space-y-5">
      {posts.map((post) => (
        <div
          key={post._id}
          className="
            bg-white
            rounded-2xl
            shadow
            p-5
            hover:shadow-lg
            transition
          "
        >
          <div className="flex items-center gap-3 mb-4">
            <img
              src={post.author?.avatar || "https://via.placeholder.com/40"}
              alt={`${post.author?.username || "User"} avatar`}
              className="w-10 h-10 rounded-full object-cover"
            />

            <span className="font-semibold">
              {post.author?.username || "Anonymous"}
            </span>
          </div>

          <p className="text-gray-800">{post.content}</p>
        </div>
      ))}
    </div>
  );
}