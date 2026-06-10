import Layout from "../src/components/layout/Layout";

export default function Wallet() {
  return (
    <Layout>
      <div className="bg-white p-8 rounded-3xl shadow">
        <h1 className="text-3xl font-bold">
          Wallet
        </h1>

        <div className="mt-8">
          <h2 className="text-5xl font-bold text-blue-600">
            0 Coins
          </h2>

          <p className="text-gray-500 mt-2">
            Available Balance
          </p>
        </div>

        <div className="mt-10 flex gap-4">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-xl">
            Buy Coins
          </button>

          <button className="border px-6 py-3 rounded-xl">
            Withdraw
          </button>
        </div>
      </div>
    </Layout>
  );
}