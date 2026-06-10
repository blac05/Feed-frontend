import { useState } from "react";

export default function Messages() {
  // Sample messages data
  const [messages, setMessages] = useState([
    { id: 1, sender: "Alice", text: "Hi there!" },
    { id: 2, sender: "You", text: "Hello! How are you?" },
    { id: 3, sender: "Alice", text: "I'm good, thanks for asking." },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 p-6 flex flex-col items-center justify-start">
      {/* Header with animated entrance */}
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 animate-slideInFromTop drop-shadow-lg">
        Messages
      </h1>

      {/* Message container */}
      <div className="w-full max-w-2xl bg-white bg-opacity-90 rounded-lg shadow-lg p-4 animate-fadeInUp transition-transform duration-300 ease-in-out">
        {/* Messages list */}
        <div className="h-96 overflow-y-auto mb-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.sender === "You"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <p className="font-semibold">{msg.sender}</p>
                <p>{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input area for new messages (optional) */}
        {/* You can add message input functionality here */}
      </div>
    </div>
  );
}