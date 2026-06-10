import { useState } from "react";
import { uploadReel } from "../../services/videoService";

export default function UploadReel() {
  const [caption, setCaption] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    if (!videoUrl || !caption) {
      setErrorMessage("Please provide both video URL and caption.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await uploadReel({ caption, videoUrl });
      setCaption("");
      setVideoUrl("");
      setSuccessMessage("Reel uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      setErrorMessage("Failed to upload reel. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4 max-w-md mx-auto p-4 border rounded-lg shadow">
      {successMessage && (
        <div className="text-green-600">{successMessage}</div>
      )}
      {errorMessage && (
        <div className="text-red-600">{errorMessage}</div>
      )}

      <input
        placeholder="Video URL"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        className="w-full border p-3 rounded-lg"
        disabled={isSubmitting}
      />

      <input
        placeholder="Caption"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="w-full border p-3 rounded-lg"
        disabled={isSubmitting}
      />

      <button
        type="submit"
        className={`bg-blue-600 text-white px-6 py-3 rounded-lg ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Uploading..." : "Upload Reel"}
      </button>
    </form>
  );
}