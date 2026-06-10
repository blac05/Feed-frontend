import { useEffect, useState } from "react";
import StoreHeader from "../components/marketplace/StoreHeader";

export default function CreatorStore() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Replace with your data fetching logic
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        // Example: fetch from your API
        // const res = await fetch('/api/store-products');
        // const data = await res.json();
        // setProducts(data.products);

        // Dummy data
        setTimeout(() => {
          setProducts([
            { id: 1, name: "Product 1", price: "$10" },
            { id: 2, name: "Product 2", price: "$20" },
          ]);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError("Failed to load products");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <StoreHeader />
        <p className="mt-8 text-center">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <StoreHeader />
        <p className="mt-8 text-center text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <StoreHeader />
      <h2 className="text-2xl font-bold mt-8 mb-4">Store Products</h2>
      
      {products.length === 0 ? (
        <p className="text-center text-gray-600">No products available.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-700">{product.price}</p>
              {/* Add buttons for edit/delete if needed */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}