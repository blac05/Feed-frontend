export default function TicketCard({ ticket }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition-shadow duration-200 cursor-pointer">
      <h3 className="text-xl font-semibold mb-2">{ticket.eventName}</h3>
      <p className="text-sm text-gray-600 mb-1">
        Date: {ticket.date || 'TBA'}
      </p>
      <p className="text-sm text-gray-600 mb-2">
        Location: {ticket.location || 'TBA'}
      </p>
      <p className="text-sm text-gray-500 mb-4">
        Ticket #: {ticket.ticketNumber}
      </p>
      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200">
        View Details
      </button>
    </div>
  );
}