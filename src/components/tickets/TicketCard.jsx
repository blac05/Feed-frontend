export default function TicketCard({
  ticket,
}) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow">
      <h3>{ticket.eventName}</h3>
    </div>
  );
}