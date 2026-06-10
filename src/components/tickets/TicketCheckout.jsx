import { useState } from "react";

export default function TicketCheckoutComponent() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCheckout = () => {
    setLoading(true);
    // Simulate checkout process
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000);
  };

  if (success) {
    return (
      <div className="p-6 bg-green-100 rounded-lg shadow text-center">
        <h2 className="text-xl font-semibold mb-4">Payment Successful!</h2>
        <p>Thank you for your purchase.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow space-y-4">
      <h2 className="text-xl font-semibold mb-4">Ticket Checkout</h2>
      
      {/* Ticket details placeholder */}
      <div className="border p-4 rounded-lg">
        <p><strong>Event:</strong> Sample Event</p>
        <p><strong>Date:</strong> Jan 1, 2024</p>
        <p><strong>Price:</strong> $50</p>
      </div>

      {/* Payment form placeholder */}
      <div>
        <label className="block mb-2 font-medium" htmlFor="cardNumber">Card Number</label>
        <input
          id="cardNumber"
          type="text"
          className="w-full p-2 border rounded"
          placeholder="1234 5678 9012 3456"
        />
      </div>

      {/* Checkout button */}
      <button
        onClick={handleCheckout}
        className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
        disabled={loading}
      >
        {loading ? "Processing..." : "Complete Purchase"}
      </button>
    </div>
  );
}