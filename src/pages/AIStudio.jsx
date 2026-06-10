import Layout from "../src/components/layout/Layout";

import CaptionGenerator from "../components/ai/CaptionGenerator";

import HashtagGenerator from "../components/ai/HashtagGenerator";

export default function AIStudio() {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto py-8">
        <h1 className="text-4xl font-bold mb-8">
          AI Studio
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          <CaptionGenerator />

          <HashtagGenerator />
        </div>
      </div>
    </Layout>
  );
}