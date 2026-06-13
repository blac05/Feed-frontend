import { useState } from "react";
import api from "../../api/axios";

export default function CreatePost() {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    setError("");

    try {
      await api.post("/posts", { content });
      setContent("");
    } catch (err) {
      setError("Failed to post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow">
      <label htmlFor="postContent" className="sr-only">
        What's happening?
      </label>
      <textarea
        id="postContent"
        className="w-full border rounded-lg p-3"
        placeholder="What's happening?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isSubmitting}
        rows={4}
      />

      {error && (
        <div className="text-red-600 mt-2">{error}</div>
      )}

      <button
        onClick={submit}
        disabled={isSubmitting || !content.trim()}
        className={`bg-blue-600 text-white px-6 py-2 rounded-lg mt-3 ${
          isSubmitting || !content.trim() ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isSubmitting ? "Posting..." : "Post"}
      </button>
    </div>
  );
}