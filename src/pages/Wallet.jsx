import Layout from "../components/Layout/Layout";


export default function Wallet() {
  return (
    <Layout>
      <div className="bg-white p-8 rounded-3xl shadow max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Wallet</h1>

        {/* Balance Section */}
        <div className="text-center mb-8">
          <h2 className="text-5xl font-bold text-blue-600 mb-2">0 Coins</h2>
          <p className="text-gray-500">Available Balance</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center">
          <button className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition duration-200 shadow-md">
            {/* Optional icon can go here */}
            Buy Coins
          </button>
          <button className="flex items-center justify-center border border-gray-300 hover:bg-gray-100 px-6 py-3 rounded-xl transition duration-200 shadow-md">
            {/* Optional icon can go here */}
            Withdraw
          </button>
        </div>

        {/* Transaction History Placeholder */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>
          <div className="border border-gray-200 rounded-lg p-4 text-gray-500 text-center">
            No recent transactions.
          </div>
        </div>
      </div>
    </Layout>
  );
}