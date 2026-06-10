export default function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <img
        src={product.thumbnail}
        alt={product.title}
        className="h-52 w-full object-cover"
      />

      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">{product.title}</h3>
        <p className="text-gray-500 mb-4">${product.price}</p>
        <button
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}