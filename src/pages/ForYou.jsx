import Layout from "../src/components/layout/Layout";
import ForYouFeed from "../src/components/recommendations/ForYouFeed";

export default function ForYou() {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-10 bg-gray-50 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold mb-4 text-center text-purple-600">
          For You
        </h1>
        {/* Optional subtitle */}
        <p className="text-center mb-8 text-gray-600">
          Personalized recommendations curated for you
        </p>

        {/* Placeholder for filter controls, if needed in future */}
        {/* <div className="flex justify-center mb-6">
          <button className="mx-2 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600">
            Popular
          </button>
          <button className="mx-2 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
            New
          </button>
        </div> */}

        <ForYouFeed />
      </div>
    </Layout>
  );
}