export default function TicketHistory() {
  // Sample ticket data
  const tickets = [
    {
      id: 1,
      eventName: "Music Concert",
      date: "Jan 15, 2024",
      location: "City Hall",
      ticketNumber: "ABC123",
    },
    {
      id: 2,
      eventName: "Art Exhibition",
      date: "Feb 10, 2024",
      location: "Gallery XYZ",
      ticketNumber: "DEF456",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Ticket History</h2>
      {tickets.length === 0 ? (
        <p className="text-gray-500">No tickets found.</p>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-2">{ticket.eventName}</h3>
              <p className="text-sm text-gray-600 mb-1">
                Date: {ticket.date}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                Location: {ticket.location}
              </p>
              <p className="text-sm text-gray-500">
                Ticket #: {ticket.ticketNumber}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}