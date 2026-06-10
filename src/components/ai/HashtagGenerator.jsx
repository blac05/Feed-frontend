import {
  useState,
} from "react";

export default function HashtagGenerator() {
  const [text, setText] =
    useState("");

  const [hashtags,
    setHashtags] =
    useState([]);

  const generate =
    () => {
      const words =
        text
          .split(" ")
          .filter(Boolean)
          .slice(0, 6);

      setHashtags(
        words.map(
          word =>
            `#${word}`
        )
      );
    };

  return (
    <div className="bg-white rounded-2xl p-6 shadow">
      <h2 className="text-xl font-bold mb-4">
        Hashtag Generator
      </h2>

      <input
        value={text}
        onChange={e =>
          setText(
            e.target.value
          )
        }
        placeholder="Enter keywords"
        className="w-full border p-3 rounded-lg"
      />

      <button
        onClick={generate}
        className="mt-4 bg-purple-600 text-white px-5 py-3 rounded-xl"
      >
        Generate
      </button>

      <div className="flex flex-wrap gap-2 mt-4">
        {hashtags.map(
          tag => (
            <span
              key={tag}
              className="bg-purple-100 px-3 py-2 rounded-full"
            >
              {tag}
            </span>
          )
        )}
      </div>
    </div>
  );
}