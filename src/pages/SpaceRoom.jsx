import SpaceParticipants from "../components/spaces/SpaceParticipants";
import SpeakerControls from "../components/spaces/SpeakerControls";

export default function SpaceRoom() {
  return (
    <div className="max-w-5xl mx-auto p-6">

      <h1 className="text-3xl font-bold">
        Audio Space
      </h1>

      <SpaceParticipants />

      <SpeakerControls />

    </div>
  );
}