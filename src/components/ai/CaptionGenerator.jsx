import {
  useState,
} from "react";

import {
  generateCaption,
} from "../../services/aiService";

export default function CaptionGenerator() {
  const [text, setText] =
    useState("");

  const [caption,
    setCaption] =
    useState("");

  const handleGenerate =
    async () => {
      try {
        const res =
          await generateCaption(
            text
          );

        setCaption(
          res.data.caption
        );
      } catch (error) {
        console.error(error);
      }
    };

  return (
    <div className="bg-white rounded-2xl p-6 shadow">
      <h2 className="text-xl font-bold mb-4">
        AI Caption Generator
      </h2>

      <textarea
        value={text}
        onChange={e =>
          setText(
            e.target.value
          )
        }
        placeholder="Describe your post..."
        className="w-full border p-3 rounded-lg"
      />

      <button
        onClick={
          handleGenerate
        }
        className="mt-4 bg-blue-600 text-white px-5 py-3 rounded-xl"
      >
        Generate Caption
      </button>

      {caption && (
        <div className="mt-4 p-4 bg-gray-100 rounded-xl">
          {caption}
        </div>
      )}
    </div>
  );
}