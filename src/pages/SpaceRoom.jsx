import SpaceParticipants from "../components/spaces/SpaceParticipants";
import SpeakerControls from "../components/spaces/SpeakerControls";

export default function SpaceRoom() {
  return (
    <div className="max-w-6xl mx-auto p-8 bg-gray-50 rounded-lg shadow-lg flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-8">
      
      {/* Header */}
      <header className="w-full mb-4 md:mb-0 md:flex-shrink-0">
        <h1 className="text-4xl font-extrabold text-center md:text-left text-gray-800">
          Audio Space
        </h1>
        <p className="mt-2 text-center md:text-left text-gray-600 text-lg">
          Engage in live discussions and listen to speakers.
        </p>
      </header>

      {/* Participants Section */}
      <section className="flex-1 bg-white p-6 rounded-lg shadow-md overflow-y-auto max-h-[70vh]">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Participants</h2>
        <SpaceParticipants />
      </section>

      {/* Speaker Controls */}
      <section className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Controls</h2>
        <SpeakerControls />
      </section>
      
    </div>
  );
}