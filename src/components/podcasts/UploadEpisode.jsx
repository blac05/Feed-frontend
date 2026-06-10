import { useState } from "react";

export default function UploadEpisode() {
  const [title, setTitle] = useState("");
  const [audio, setAudio] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = () => {
    if (!title || !audio) return;
    setIsUploading(true);
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      setMessage("Episode uploaded successfully!");
      setTitle("");
      setAudio(null);
    }, 2000);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow max-w-md mx-auto">
      <div className="mb-4">
        <label className="block mb-1 font-semibold" htmlFor="title">
          Episode Title
        </label>
        <input
          id="title"
          placeholder="Episode Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-3 rounded-xl w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-semibold" htmlFor="audio">
          Upload Audio
        </label>
        <input
          id="audio"
          type="file"
          accept="audio/*"
          onChange={(e) => setAudio(e.target.files[0])}
          className="w-full"
        />
        {audio && <p className="mt-2 text-gray-600">Selected file: {audio.name}</p>}
      </div>

      <button
        onClick={handleUpload}
        disabled={!title || !audio || isUploading}
        className={`mt-4 bg-blue-600 text-white px-5 py-3 rounded-xl disabled:bg-gray-400 disabled:cursor-not-allowed`}
      >
        {isUploading ? "Uploading..." : "Upload"}
      </button>

      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
}