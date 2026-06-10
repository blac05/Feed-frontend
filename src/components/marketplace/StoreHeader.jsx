export default function StoreHeader({ storeName = "Creator Store", description = "Digital products, courses and more." , imageUrl = "https://i.pravatar.cc/150" }) {
  return (
    <div className="rounded-3xl bg-white shadow p-8">
      <div className="flex items-center gap-6 flex-wrap md:flex-nowrap">
        <img
          src={imageUrl}
          alt={`${storeName} Logo`}
          className="w-24 h-24 rounded-full object-cover"
        />

        <div>
          <h1 className="text-3xl font-bold mb-2">{storeName}</h1>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
}