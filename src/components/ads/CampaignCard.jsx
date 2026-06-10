export default function CampaignCard({ title, budget, status }) {
  // Optional: Add color coding for status
  const statusColor = status === 'Active' ? 'text-green-600' : 'text-gray-600';

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="font-bold text-xl mb-2">{title}</h2>
      <p className="mt-3">Budget: ${budget}</p>
      <p className={statusColor}>Status: {status}</p>
    </div>
  );
}