import { useState } from "react";

export default function SpeakerControls() {
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const toggleMute = () => setIsMuted(prev => !prev);
  const toggleSpeak = () => setIsSpeaking(prev => !prev);

  return (
    <div className="flex gap-4 mt-6">
      <button
        onClick={toggleMute}
        className={`px-4 py-2 rounded-xl transition-colors ${
          isMuted ? "bg-gray-400" : "bg-red-500 text-white"
        }`}
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? "Unmute" : "Mute"}
      </button>

      <button
        onClick={toggleSpeak}
        className={`px-4 py-2 rounded-xl transition-colors ${
          isSpeaking ? "bg-gray-400" : "bg-green-500 text-white"
        }`}
        aria-label={isSpeaking ? "Stop Speaking" : "Speak"}
      >
        {isSpeaking ? "Stop" : "Speak"}
      </button>
    </div>
  );
}