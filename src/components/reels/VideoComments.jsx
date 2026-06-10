import {
  useState,
  useEffect,
} from "react";

import {
  getComments,
  addComment,
} from "../../services/videoService";

export default function VideoComments({
  videoId,
  onClose,
}) {
  const [comments,
    setComments] =
    useState([]);

  const [text, setText] =
    useState("");

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments =
    async () => {
      const res =
        await getComments(
          videoId
        );

      setComments(
        res.data.comments
      );
    };

  const handleSubmit =
    async () => {
      if (!text) return;

      await addComment(
        videoId,
        text
      );

      setText("");

      loadComments();
    };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-end">
      <div className="bg-white w-full md:w-[500px] rounded-t-3xl p-4 h-[70vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="mb-4"
        >
          Close
        </button>

        {comments.map(
          comment => (
            <div
              key={
                comment._id
              }
              className="mb-3"
            >
              <strong>
                {
                  comment.user
                    ?.username
                }
              </strong>

              <p>
                {
                  comment.text
                }
              </p>
            </div>
          )
        )}

        <div className="flex gap-2 mt-4">
          <input
            value={text}
            onChange={e =>
              setText(
                e.target.value
              )
            }
            className="border flex-1 p-2 rounded-lg"
            placeholder="Add comment..."
          />

          <button
            onClick={
              handleSubmit
            }
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}