import Layout from "../src/components/layout/Layout";
import CreatePost from "../components/feed/CreatePost";

export default function Home() {
  return (
    <Layout>
      <CreatePost />
    </Layout>
  );
}