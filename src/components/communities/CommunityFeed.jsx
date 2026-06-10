export default function CommunityFeed({
  posts,
}) {
  return (
    <div className="space-y-5">

      {posts.map(post => (
        <div
          key={post._id}
          className="
          bg-white
          rounded-2xl
          shadow
          p-5
          "
        >
          <div className="flex items-center gap-3">
            <img
              src={post.author?.avatar}
              alt=""
              className="
              w-10
              h-10
              rounded-full
              "
            />

            <span className="font-semibold">
              {post.author?.username}
            </span>
          </div>

          <p className="mt-4">
            {post.content}
          </p>
        </div>
      ))}

    </div>
  );
}