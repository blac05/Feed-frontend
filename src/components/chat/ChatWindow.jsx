import { useState } from "react";

export default function ChatWindow() {
  const [message, setMessage] =
    useState("");

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        Messages
      </div>

      <div className="flex gap-2">
        <input
          value={message}
          onChange={e =>
            setMessage(
              e.target.value
            )
          }
          className="flex-1 border rounded-xl p-3"
        />

        <button className="bg-blue-600 text-white px-5 rounded-xl">
          Send
        </button>
      </div>
    </div>
  );
}