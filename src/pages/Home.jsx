import Layout from "../src/components/layout/Layout";
import CreatePost from "../components/feed/CreatePost";

export default function Home() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10 px-4">
        <div className="max-w-4xl w-full bg-white p-8 rounded-lg shadow-lg transition-transform hover:scale-105 hover:shadow-xl">
          <h1 className="text-3xl font-bold mb-4 text-center text-purple-600">
            Share Your Thoughts
          </h1>
          <p className="text-center mb-8 text-gray-600">
            Start a new conversation or share an update with your community
          </p>
          {/* Call-to-action button for better engagement */}
          <div className="flex justify-center mb-6">
            <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition duration-300">
              Create a Post
            </button>
          </div>
          {/* CreatePost form/component */}
          <CreatePost />
        </div>
      </div>
    </Layout>
  );
}