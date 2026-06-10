import { useState, useEffect } from "react";

import { getComments, addComment } from "../../services/videoService";

export default function VideoComments({ videoId, onClose }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    setLoadingComments(true);
    setError(null);
    try {
      const res = await getComments(videoId);
      setComments(res.data.comments);
    } catch (err) {
      console.error("Failed to load comments:", err);
      setError("Failed to load comments.");
    } finally {
      setLoadingComments(false);
    }
  };

  const handleSubmit = async () => {
    if (!text || submitting) return;

    setSubmitting(true);
    setError(null);
    try {
      await addComment(videoId, text);
      setText("");
      loadComments();
    } catch (err) {
      console.error("Failed to add comment:", err);
      setError("Failed to add comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-end">
      <div className="bg-white w-full md:w-[500px] rounded-t-3xl p-4 h-[70vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="mb-4"
          aria-label="Close comments"
        >
          Close
        </button>

        {loadingComments ? (
          <p>Loading comments...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="mb-3">
              <strong>{comment.user?.username}</strong>
              <p>{comment.text}</p>
            </div>
          ))
        )}

        <div className="flex gap-2 mt-4">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border flex-1 p-2 rounded-lg"
            placeholder="Add comment..."
            aria-label="Add comment"
            disabled={submitting}
          />

          <button
            onClick={handleSubmit}
            className={`px-4 py-2 bg-blue-600 text-white rounded-lg ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={submitting}
            aria-disabled={submitting}
          >
            {submitting ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}