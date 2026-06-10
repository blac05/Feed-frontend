export default function VideoCall() {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-3xl w-full">
        <h1 className="text-3xl font-bold mb-4 text-center">Video Call Room</h1>
        <p className="text-gray-500 mb-6 text-center">
          WebRTC integration goes here
        </p>

        {/* Video streams placeholder */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 bg-gray-200 aspect-video rounded-lg shadow-inner flex items-center justify-center text-gray-500 font-semibold">
            Your Video
          </div>
          <div className="flex-1 bg-gray-200 aspect-video rounded-lg shadow-inner flex items-center justify-center text-gray-500 font-semibold">
            Partner Video
          </div>
        </div>

        {/* Call action buttons */}
        <div className="flex justify-center space-x-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200">
            Join Call
          </button>
          <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200">
            End Call
          </button>
        </div>
      </div>
    </div>
  );
}