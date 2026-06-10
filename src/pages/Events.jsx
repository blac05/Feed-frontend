import { useEffect, useState } from "react";
import { getEvents } from "../api/eventApi";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const res = await getEvents();
      setEvents(res.data.events);
    } catch (err) {
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-5">Events</h1>
        <p className="text-center">Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-5">Events</h1>
        <p className="text-center text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-5">Events</h1>
      {events.length === 0 ? (
        <p className="text-center text-gray-600">No events available.</p>
      ) : (
        events.map((event) => (
          <div
            key={event._id}
            className="bg-white rounded-xl p-4 mb-4 shadow hover:shadow-lg transition flex items-center"
          >
            {/* Event Image with fallback */}
            <img
              src={event.imageUrl || "https://via.placeholder.com/96"} // Placeholder image
              alt={event.title}
              className="w-24 h-24 object-cover rounded mr-4"
            />
            {/* Event Details */}
            <div>
              <h2 className="font-semibold text-xl mb-2">{event.title}</h2>
              {/* Formatted Date */}
              {event.date ? (
                <p className="text-gray-600 text-sm">
                  {new Date(event.date).toLocaleString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              ) : (
                <p className="text-gray-400 text-sm">Date not specified</p>
              )}
              {/* Event Description */}
              {event.description && (
                <p className="mt-2 text-gray-700">{event.description}</p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}