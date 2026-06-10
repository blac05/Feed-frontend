import { useState } from "react";

export default function HashtagGenerator() {
  const [text, setText] = useState("");
  const [hashtags, setHashtags] = useState([]);

  const generate = () => {
    const words = text
      .split(" ")
      .filter(Boolean)
      .slice(0, 6); // Limit to first 6 words

    setHashtags(words.map((word) => `#${word}`));
  };

  const copyHashtags = () => {
    const allTags = hashtags.join(" ");
    navigator.clipboard.writeText(allTags).then(() => {
      alert("Hashtags copied to clipboard!");
    });
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow">
      <h2 className="text-xl font-bold mb-4">Hashtag Generator</h2>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter keywords"
        className="w-full border p-3 rounded-lg mb-4"
      />
      <button
        onClick={generate}
        className="mt-4 bg-purple-600 text-white px-5 py-3 rounded-xl"
      >
        Generate
      </button>
      {hashtags.length > 0 && (
        <>
          <div className="flex flex-wrap gap-2 mt-4">
            {hashtags.map((tag) => (
              <span
                key={tag}
                className="bg-purple-100 px-3 py-2 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          <button
            onClick={copyHashtags}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded-xl"
          >
            Copy All
          </button>
        </>
      )}
    </div>
  );
}