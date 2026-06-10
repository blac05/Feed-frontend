import SponsorshipCard from "./SponsorshipCard";

export default function CreatorMarketplace() {
  const creators = [
    {
      id: 1,
      brand: "Nike",
      amount: 2000,
    },
    {
      id: 2,
      brand: "Samsung",
      amount: 5000,
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-8 text-center md:text-left">
        Creator Marketplace
      </h1>

      {creators.length === 0 ? (
        <p className="text-center text-gray-500">No sponsorships available at the moment.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-3 sm:grid-cols-2">
          {creators.map((item) => (
            <SponsorshipCard key={item.id} sponsorship={item} />
          ))}
        </div>
      )}
    </div>
  );
}