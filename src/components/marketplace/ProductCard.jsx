export default function ProductCard({
  product,
}) {
  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden">
      <img
        src={product.thumbnail}
        alt=""
        className="h-52 w-full object-cover"
      />

      <div className="p-4">
        <h3 className="font-bold">
          {product.title}
        </h3>

        <p className="text-gray-500">
          ${product.price}
        </p>

        <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-xl">
          Buy Now
        </button>
      </div>
    </div>
  );
}