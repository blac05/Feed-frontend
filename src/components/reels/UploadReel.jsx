import {
  useState,
} from "react";

import {
  uploadReel,
} from "../../services/videoService";

export default function UploadReel() {
  const [caption,
    setCaption] =
    useState("");

  const [videoUrl,
    setVideoUrl] =
    useState("");

  const submit =
    async e => {
      e.preventDefault();

      await uploadReel({
        caption,
        videoUrl,
      });

      setCaption("");
      setVideoUrl("");
    };

  return (
    <form
      onSubmit={submit}
      className="space-y-4"
    >
      <input
        placeholder="Video URL"
        value={videoUrl}
        onChange={e =>
          setVideoUrl(
            e.target.value
          )
        }
        className="w-full border p-3 rounded-lg"
      />

      <input
        placeholder="Caption"
        value={caption}
        onChange={e =>
          setCaption(
            e.target.value
          )
        }
        className="w-full border p-3 rounded-lg"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg"
      >
        Upload Reel
      </button>
    </form>
  );
}