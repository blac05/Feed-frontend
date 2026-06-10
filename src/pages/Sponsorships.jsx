import CreatorMarketplace from "../components/sponsorships/CreatorMarketplace";

export default function Sponsorships() {
  return (
    <div className="max-w-7xl mx-auto p-8 bg-gray-100 min-h-screen flex flex-col">
      
      {/* Header Section */}
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
          Creator Sponsorship Marketplace
        </h1>
        <p className="text-lg text-gray-600">
          Discover and support your favorite creators. Browse sponsorship opportunities and connect directly.
        </p>
      </header>

      {/* Marketplace Section */}
      <section className="flex-1 bg-white p-8 rounded-lg shadow-lg overflow-hidden">
        {/* Optional: Add a search bar or filters here */}
        <CreatorMarketplace />
      </section>
      
    </div>
  );
}