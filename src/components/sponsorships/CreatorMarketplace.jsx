import SponsorshipCard from "./SponsorshipCard";

export default function CreatorMarketplace() {

  const creators = [
    {
      id:1,
      brand:"Nike",
      amount:2000
    },
    {
      id:2,
      brand:"Samsung",
      amount:5000
    }
  ];

  return (
    <div>

      <h1 className="text-3xl font-bold mb-8">
        Creator Marketplace
      </h1>

      <div className="grid md:grid-cols-3 gap-4">

        {creators.map(item=>(
          <SponsorshipCard
            key={item.id}
            sponsorship={item}
          />
        ))}

      </div>

    </div>
  );
}