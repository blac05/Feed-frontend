export default function StoreHeader() {
  return (
    <div className="rounded-3xl bg-white shadow p-8">
      <div className="flex items-center gap-6">
        <img
          src="https://i.pravatar.cc/150"
          alt=""
          className="w-24 h-24 rounded-full"
        />

        <div>
          <h1 className="text-3xl font-bold">
            Creator Store
          </h1>

          <p>
            Digital products,
            courses and more.
          </p>
        </div>
      </div>
    </div>
  );
}