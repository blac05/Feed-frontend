export default function SpeakerControls() {
  return (
    <div className="flex gap-4 mt-6">
      <button className="bg-red-500 text-white px-4 py-2 rounded-xl">
        Mute
      </button>

      <button className="bg-green-500 text-white px-4 py-2 rounded-xl">
        Speak
      </button>
    </div>
  );
}