import React from "react";

export default function SpaceParticipants({ participants }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow mt-6">
      <h3 className="text-xl font-semibold mb-4">Participants</h3>
      {participants && participants.length > 0 ? (
        <ul className="space-y-3">
          {participants.map((participant) => (
            <li key={participant.id} className="flex items-center space-x-3">
              <img
                src={participant.avatarUrl}
                alt={`${participant.name}'s avatar`}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="font-medium">{participant.name}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No participants yet.</p>
      )}
    </div>
  );
}