import { useState } from "react";
import Layout from "../components/layout/Layout";
import CaptionGenerator from "../components/ai/CaptionGenerator";
import HashtagGenerator from "../components/ai/HashtagGenerator";

export default function AIStudio() {
  const [activeTab, setActiveTab] = useState("caption");
  const [loading, setLoading] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-10 px-4">
        {/* Header */}
        <h1 className="text-5xl font-extrabold mb-4 text-center text-indigo-600">AI Content Studio</h1>
        <p className="mb-12 text-center text-gray-700 max-w-3xl mx-auto">
          Unlock the power of AI to craft compelling captions, generate trending hashtags, and customize your social media content effortlessly.
        </p>

        {/* Tabs Navigation */}
        <div className="flex justify-center mb-8 space-x-4 border-b border-gray-300">
          <button
            className={`py-2 px-4 font-semibold focus:outline-none ${activeTab === "caption" ? "border-b-2 border-indigo-500 text-indigo-600" : "text-gray-600"}`}
            onClick={() => handleTabChange("caption")}
          >
            Caption Generator
          </button>
          <button
            className={`py-2 px-4 font-semibold focus:outline-none ${activeTab === "hashtag" ? "border-b-2 border-indigo-500 text-indigo-600" : "text-gray-600"}`}
            onClick={() => handleTabChange("hashtag")}
          >
            Hashtag Generator
          </button>
        </div>

        {/* Content Area with Loading State */}
        <div className="transition-all duration-300">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
            </div>
          ) : (
            <>
              {activeTab === "caption" && (
                <div className="bg-white p-6 rounded-lg shadow hover:shadow-xl transition-shadow duration-300">
                  <CaptionGenerator setLoading={setLoading} />
                </div>
              )}
              {activeTab === "hashtag" && (
                <div className="bg-white p-6 rounded-lg shadow hover:shadow-xl transition-shadow duration-300">
                  <HashtagGenerator setLoading={setLoading} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}