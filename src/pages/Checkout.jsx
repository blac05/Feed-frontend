export default function Checkout() {
  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Checkout</h1>
      
      {/* Contact Information */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Contact Information</h2>
        <input
          type="email"
          placeholder="Email address"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="tel"
          placeholder="Phone number"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Shipping Address */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Shipping Address</h2>
        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          placeholder="Address"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="flex space-x-4 mb-4">
          <input
            type="text"
            placeholder="City"
            className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Zip Code"
            className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Order Summary */}
      <div className="mb-8 border-t border-gray-200 pt-4">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Order Summary</h2>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-semibold">$99.99</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Shipping</span>
          <span className="font-semibold">$5.00</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="text-gray-600">Total</span>
          <span className="font-bold text-lg">$104.99</span>
        </div>
      </div>

      {/* Complete Purchase Button */}
      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-lg font-semibold transition duration-300">
        Complete Purchase
      </button>
    </div>
  );
}