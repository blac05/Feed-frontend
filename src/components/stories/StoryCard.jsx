export default function StoryCard({
  story,
  onOpen,
}) {
  return (
    <div
      onClick={() =>
        onOpen(story)
      }
      className="cursor-pointer flex flex-col items-center"
    >
      <img
        src={
          story.user?.avatar ||
          "https://i.pravatar.cc/150"
        }
        alt=""
        className="w-20 h-20 rounded-full border-4 border-blue-500 object-cover"
      />

      <p className="text-sm mt-2">
        {story.user?.username}
      </p>
    </div>
  );
}