import { useState, useRef, useEffect } from "react";

export default function LiveChat() {
  const [messages, setMessages] = useState([
    { user: "User1", text: "Nice stream 🔥" },
    { user: "User2", text: "Hello 👋" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim() === "") return;
    setMessages([...messages, { user: "You", text: newMessage }]);
    setNewMessage("");
  };

  return (
    <div className="flex flex-col bg-white rounded-2xl p-4 h-[500px] shadow">
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <strong>{msg.user}:</strong> {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex space-x-2">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={handleSend}
          disabled={newMessage.trim() === ""}
        >
          Send
        </button>
      </div>
    </div>
  );
}