export default function StoryCard({ story, onOpen }) {
  return (
    <div
      onClick={() => onOpen(story)}
      className="cursor-pointer flex flex-col items-center hover:scale-105 transform transition-transform duration-200"
      role="button"
      aria-label={`Open story of ${story.user?.username}`}
    >
      <div className="relative">
        <img
          src={story.user?.avatar || "https://i.pravatar.cc/150"}
          alt={`${story.user?.username}'s avatar`}
          className="w-20 h-20 rounded-full border-4 border-blue-500 object-cover"
        />
        {/* Optional: Indicator for new story */}
        {story.isNew && (
          <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-red-500 border-2 border-white"></span>
        )}
      </div>
      <p className="text-sm mt-2 font-medium text-center">{story.user?.username}</p>
    </div>
  );
}