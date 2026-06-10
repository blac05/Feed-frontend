import { useState } from "react";

export default function TicketCheckout() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const ticketPrice = 50; // Example ticket price
  const totalPrice = ticketPrice * quantity;

  const handlePurchase = () => {
    if (!name || !email) {
      setMessage("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setMessage("");
    // Simulate payment processing delay
    setTimeout(() => {
      setLoading(false);
      setMessage("Thank you for your purchase!");
    }, 2000);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Ticket Checkout</h1>

      {/* User Info */}
      <div className="mb-4">
        <label className="block mb-2 font-semibold" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          type="text"
          className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* Ticket Quantity */}
      <div className="mb-4">
        <label className="block mb-2 font-semibold" htmlFor="quantity">
          Ticket Quantity
        </label>
        <select
          id="quantity"
          className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
        >
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      {/* Summary */}
      <div className="border-t pt-4 mb-4">
        <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
        <p className="mb-1">Price per Ticket: ${ticketPrice}</p>
        <p className="mb-1">Quantity: {quantity}</p>
        <p className="font-bold text-lg">Total: ${totalPrice}</p>
      </div>

      {/* Purchase Button */}
      <button
        onClick={handlePurchase}
        disabled={loading}
        className="
        w-full
        bg-blue-600
        hover:bg-blue-700
        text-white
        px-6
        py-3
        rounded-xl
        transition
        duration-300
        focus:outline-none
        focus:ring-2
        focus:ring-blue-400
        disabled:opacity-50
        disabled:cursor-not-allowed
        "
      >
        {loading ? "Processing..." : "Purchase Ticket"}
      </button>

      {/* Feedback Message */}
      {message && (
        <p className="mt-4 text-center text-green-600 font-semibold">{message}</p>
      )}
    </div>
  );
}