import { useState } from "react";
import { generateCaption } from "../../services/aiService";

export default function CaptionGenerator() {
  const [text, setText] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await generateCaption(text);
      setCaption(res.data.caption);
    } catch (err) {
      console.error(err);
      setError("Failed to generate caption. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow">
      <h2 className="text-xl font-bold mb-4">AI Caption Generator</h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Describe your post..."
        className="w-full border p-3 rounded-lg mb-4"
        rows={4}
      />
      <button
        onClick={handleGenerate}
        disabled={loading}
        className={`mt-4 bg-blue-600 text-white px-5 py-3 rounded-xl ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Generating..." : "Generate Caption"}
      </button>
      {error && (
        <div className="mt-4 text-red-500">{error}</div>
      )}
      {caption && !error && (
        <div className="mt-4 p-4 bg-gray-100 rounded-xl">
          {caption}
        </div>
      )}
    </div>
  );
}