import { FaBullseye, FaMousePointer, FaChartLine, FaDollarSign } from 'react-icons/fa';

export default function BusinessStats() {
  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Business Metrics</h2>
      <div className="grid md:grid-cols-4 gap-4">
        {/* Total Reach */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition duration-300">
          <div className="flex items-center space-x-3 mb-2">
            <FaBullseye className="text-blue-500" />
            <h3 className="text-lg font-semibold">Total Reach</h3>
          </div>
          <p className="text-3xl font-bold">1.2M</p>
        </div>

        {/* Clicks */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition duration-300">
          <div className="flex items-center space-x-3 mb-2">
            <FaMousePointer className="text-green-500" />
            <h3 className="text-lg font-semibold">Clicks</h3>
          </div>
          <p className="text-3xl font-bold">48K</p>
        </div>

        {/* Conversions */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition duration-300">
          <div className="flex items-center space-x-3 mb-2">
            <FaChartLine className="text-purple-500" />
            <h3 className="text-lg font-semibold">Conversions</h3>
          </div>
          <p className="text-3xl font-bold">3.4K</p>
        </div>

        {/* Revenue */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition duration-300">
          <div className="flex items-center space-x-3 mb-2">
            <FaDollarSign className="text-yellow-500" />
            <h3 className="text-lg font-semibold">Revenue</h3>
          </div>
          <p className="text-3xl font-bold">$12,400</p>
        </div>
      </div>
    </div>
  );
}