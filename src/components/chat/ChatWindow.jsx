import { useState } from "react";

export default function ChatWindow() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSend = () => {
    if (message.trim() === "") return; // Prevent empty messages
    setMessages([...messages, { text: message, id: Date.now() }]);
    setMessage(""); // Clear input
  };

  return (
    <div className="h-full flex flex-col border border-gray-300 rounded-lg p-4 bg-gray-50">
      {/* Messages display */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="bg-white p-2 rounded-xl shadow text-gray-800 max-w-xs"
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input and button */}
      <div className="flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border rounded-xl p-3"
          placeholder="Type a message..."
        />

        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-5 py-2 rounded-xl"
        >
          Send
        </button>
      </div>
    </div>
  );
}