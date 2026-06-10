export default function SponsorshipCard({
  sponsorship
}) {
  return (
    <div className="bg-white rounded-xl p-6 shadow">

      <h3 className="font-bold">
        {sponsorship.brand}
      </h3>

      <p>
        ${sponsorship.amount}
      </p>

    </div>
  );
}