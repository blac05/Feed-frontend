import Layout from "../src/components/layout/Layout";
import ProductGrid from "../components/marketplace/ProductGrid";

export default function Marketplace() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-8">
        <h1 className="text-4xl font-bold mb-8">
          Marketplace
        </h1>

        <ProductGrid />
      </div>
    </Layout>
  );
}