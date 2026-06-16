import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Search } from "lucide-react";

const contacts = [
  { id: 1, name: "Alice", avatar: "https://i.pravatar.cc/150?img=1", last: "Hey there!", time: "2m", unread: 2 },
  { id: 2, name: "Bob", avatar: "https://i.pravatar.cc/150?img=2", last: "See you later!", time: "1h", unread: 0 },
  { id: 3, name: "Sarah", avatar: "https://i.pravatar.cc/150?img=3", last: "Thanks a lot!", time: "3h", unread: 1 },
];

const initMessages = [
  { id: 1, from: "Alice", text: "Hi there!", time: "10:00 AM" },
  { id: 2, from: "You", text: "Hello! How are you?", time: "10:01 AM" },
  { id: 3, from: "Alice", text: "I'm good, thanks for asking!", time: "10:02 AM" },
];

export default function Messages() {
  const [active, setActive] = useState(contacts[0]);
  const [messages, setMessages] = useState(initMessages);
  const [text, setText] = useState("");

  const send = () => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), from: "You", text, time: "Now" }]);
    setText("");
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex h-[75vh]">
        {/* Sidebar */}
        <div className="w-72 border-r border-gray-100 flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-800 mb-3">Messages</h2>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
              <input placeholder="Search..." className="w-full pl-8 pr-3 py-2 bg-gray-50 rounded-xl text-sm focus:outline-none" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {contacts.map(c => (
              <div
                key={c.id}
                onClick={() => setActive(c)}
                className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 transition ${active.id === c.id ? "bg-blue-50" : ""}`}
              >
                <div className="relative">
                  <img src={c.avatar} className="w-10 h-10 rounded-full object-cover" alt={c.name} />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <p className="font-semibold text-sm text-gray-800">{c.name}</p>
                    <p className="text-xs text-gray-400">{c.time}</p>
                  </div>
                  <p className="text-xs text-gray-400 truncate">{c.last}</p>
                </div>
                {c.unread > 0 && (
                  <span className="bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{c.unread}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-100 flex items-center gap-3">
            <img src={active.avatar} className="w-9 h-9 rounded-full object-cover" alt={active.name} />
            <div>
              <p className="font-semibold text-sm text-gray-800">{active.name}</p>
              <p className="text-xs text-green-500">Online</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map(msg => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.from === "You" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${
                  msg.from === "You"
                    ? "bg-gradient-to-r from-sky-500 to-blue-700 text-white rounded-br-sm"
                    : "bg-gray-100 text-gray-800 rounded-bl-sm"
                }`}>
                  <p>{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.from === "You" ? "text-blue-200" : "text-gray-400"}`}>{msg.time}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-100 flex gap-3">
            <input
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Type a message..."
              className="flex-1 bg-gray-50 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={send}
              className="bg-gradient-to-r from-sky-500 to-blue-700 text-white p-2.5 rounded-xl hover:brightness-110 transition"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}