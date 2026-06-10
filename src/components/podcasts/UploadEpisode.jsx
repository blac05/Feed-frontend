import { useState } from "react";

export default function UploadEpisode() {
  const [title, setTitle] =
    useState("");

  const [audio, setAudio] =
    useState("");

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <input
        placeholder="Episode Title"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
        className="border p-3 rounded-xl w-full"
      />

      <input
        type="file"
        onChange={(e) =>
          setAudio(e.target.files[0])
        }
        className="mt-4"
      />

      <button
        className="
        mt-4
        bg-blue-600
        text-white
        px-5
        py-3
        rounded-xl
        "
      >
        Upload
      </button>
    </div>
  );
}