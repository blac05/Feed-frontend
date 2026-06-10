import { useState } from "react";
import api from "../../Api/axios";

export default function CreatePost() {
  const [content, setContent] =
    useState("");

  const submit = async () => {
    await api.post("/posts", {
      content,
    });

    setContent("");
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow">
      <textarea
        className="w-full border rounded-lg p-3"
        placeholder="What's happening?"
        value={content}
        onChange={e =>
          setContent(e.target.value)
        }
      />

      <button
        onClick={submit}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg mt-3"
      >
        Post
      </button>
    </div>
  );
}