import Layout from "../src/components/layout/Layout";

import ForYouFeed from "../src/components/recommendations/ForYouFeed";

export default function ForYou() {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-8">
        <h1 className="text-4xl font-bold mb-8">
          For You
        </h1>

        <ForYouFeed />
      </div>
    </Layout>
  );
}