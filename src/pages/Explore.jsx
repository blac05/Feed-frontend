import Layout from "../components/layout/Layout";

export default function Explore() {
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8 text-center text-indigo-600">
        Explore
      </h1>

      <div className="grid md:grid-cols-3 gap-6 p-4 bg-white rounded-lg shadow-md">
        {/* Placeholder for Trending Posts - replace with actual components or content */}
        <div className="border p-4 rounded-lg hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-semibold mb-2">Trending Post Title 1</h2>
          <p className="text-gray-600">Brief description or excerpt for the trending post.</p>
        </div>
        <div className="border p-4 rounded-lg hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-semibold mb-2">Trending Post Title 2</h2>
          <p className="text-gray-600">Brief description or excerpt for the trending post.</p>
        </div>
        <div className="border p-4 rounded-lg hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-semibold mb-2">Trending Post Title 3</h2>
          <p className="text-gray-600">Brief description or excerpt for the trending post.</p>
        </div>
      </div>
    </Layout>
  );
}