import { useParams } from "react-router-dom";

export default function ProductDetails() {
  const { id } = useParams();

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold">
        Product Details
      </h1>

      <p>
        Product ID: {id}
      </p>
    </div>
  );
}