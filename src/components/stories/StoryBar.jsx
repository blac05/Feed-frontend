export default function StoryBar({
  stories,
}) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-3">
      {stories.map(story => (
        <div
          key={story._id}
          className="flex flex-col items-center"
        >
          <img
            src={story.user.avatar}
            className="h-16 w-16 rounded-full border-4 border-blue-500"
          />

          <span>
            {story.user.username}
          </span>
        </div>
      ))}
    </div>
  );
}