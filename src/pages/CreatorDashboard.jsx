import Layout from "../components/layout/Layout";

export default function CreatorDashboard() {
  return (
    <Layout>
      <h1 className="text-3xl font-bold">
        Creator Dashboard
      </h1>

      <div className="grid md:grid-cols-4 gap-5 mt-6">
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3>Total Followers</h3>
          <h1 className="text-4xl font-bold">
            0
          </h1>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h3>Total Gifts</h3>
          <h1 className="text-4xl font-bold">
            0
          </h1>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h3>Total Coins</h3>
          <h1 className="text-4xl font-bold">
            0
          </h1>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h3>Live Viewers</h3>
          <h1 className="text-4xl font-bold">
            0
          </h1>
        </div>
      </div>
    </Layout>
  );
}