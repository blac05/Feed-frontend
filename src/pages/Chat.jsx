export default function Chat() {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg flex flex-col h-screen">
      {/* Chat Header */}
      <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">Chat</h1>
      
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
        {/* Example message */}
        <div className="mb-2">
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg inline-block max-w-xs">
            Hello! How can I help you?
          </div>
        </div>
        {/* More messages can go here */}
      </div>

      {/* Input Area */}
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition duration-300">
          Send
        </button>
      </div>
    </div>
  );
}