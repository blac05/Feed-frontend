export default function BusinessStats() {
  return (
    <div className="grid md:grid-cols-4 gap-4">

      <div className="bg-white p-6 rounded-xl shadow">
        <h3>Total Reach</h3>
        <p className="text-3xl font-bold">
          1.2M
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h3>Clicks</h3>
        <p className="text-3xl font-bold">
          48K
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h3>Conversions</h3>
        <p className="text-3xl font-bold">
          3.4K
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h3>Revenue</h3>
        <p className="text-3xl font-bold">
          $12,400
        </p>
      </div>

    </div>
  );
}