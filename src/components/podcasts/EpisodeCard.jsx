export default function EpisodeCard({
  episode,
}) {
  return (
    <div className="bg-white rounded-2xl shadow p-5">
      <h3 className="font-bold text-lg">
        {episode.title}
      </h3>

      <p className="text-gray-500 mt-2">
        {episode.description}
      </p>

      <audio
        controls
        className="w-full mt-4"
      >
        <source
          src={episode.audioUrl}
        />
      </audio>
    </div>
  );
}