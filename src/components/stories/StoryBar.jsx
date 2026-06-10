export default function StoryBar({ stories }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-3 px-2">
      {stories.map((story) => (
        <div
          key={story._id}
          className="flex flex-col items-center cursor-pointer hover:scale-105 transform transition-transform duration-200"
          aria-label={`Story of ${story.user.username}`}
        >
          <div className="relative">
            <img
              src={story.user.avatar}
              className="h-16 w-16 rounded-full border-4 border-blue-500"
              alt={`${story.user.username}'s avatar`}
            />
            {/* Optional: Add a small indicator for new stories */}
            {story.isNew && (
              <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-red-500 border-2 border-white"></span>
            )}
          </div>
          <span className="mt-2 text-sm font-medium text-center">{story.user.username}</span>
        </div>
      ))}
    </div>
  );
}