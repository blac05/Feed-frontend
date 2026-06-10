import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProductDetails() {
  const { id } = useParams(); // Get product ID from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch product data from your API
    fetch(`/api/products/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch product data");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading product details...</p>;
  if (error) return <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Product Details</h1>
      {/* Display product info */}
      {product ? (
        <div className="border p-4 rounded shadow-sm">
          <h2 className="text-2xl font-semibold mb-2">{product.name}</h2>
          <p className="mb-2">{product.description}</p>
          <p className="mb-2"><strong>Price:</strong> ${product.price}</p>
          {/* Add more product fields as needed */}
        </div>
      ) : (
        <p>No product data available.</p>
      )}
    </div>
  );
}