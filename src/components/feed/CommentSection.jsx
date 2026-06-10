import { useState } from "react";

export default function CommentSection({ onCommentSubmit }) {
  const [comment, setComment] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && comment.trim()) {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (comment.trim()) {
      if (onCommentSubmit) {
        onCommentSubmit(comment);
      }
      setComment("");
    }
  };

  return (
    <div className="mt-4">
      <div className="flex">
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write a comment..."
          aria-label="Write a comment"
          className="border p-2 rounded-xl w-full"
        />
        <button
          onClick={handleSubmit}
          className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-xl"
        >
          Post
        </button>
      </div>
    </div>
  );
}