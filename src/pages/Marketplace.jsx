import Layout from "../components/layout/Layout";
import ProductGrid from "../components/marketplace/ProductGrid";

export default function Marketplace() {
  return (
    <Layout>
      <div className="relative min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 overflow-hidden flex items-start justify-center">
        {/* Animated blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-400 opacity-30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-pink-400 opacity-30 rounded-full blur-3xl animate-pulse" />

        <div className="max-w-7xl mx-auto py-12 px-4 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-8 text-white drop-shadow-lg animate-slideInFromTop">
            Marketplace
          </h1>
          <div className="relative z-10 animate-fadeIn">
            <ProductGrid />
          </div>
        </div>
      </div>
    </Layout>
  );
}