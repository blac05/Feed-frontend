import Layout from "../src/components/layout/Layout";
import LiveChat from "../components/live/LiveChat";
import GiftPanel from "../components/live/GiftPanel";

export default function Live() {
  return (
    <Layout>
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <div className="h-[600px] rounded-2xl bg-black" />
        </div>

        <div>
          <LiveChat />

          <div className="mt-4">
            <GiftPanel />
          </div>
        </div>
      </div>
    </Layout>
  );
}