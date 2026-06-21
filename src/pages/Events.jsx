import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, MapPin, Users, Plus, X, Clock,
  CheckCircle, Globe, Lock, Tag
} from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useNavigate } from "react-router-dom";

const CATEGORIES = ["Music", "Sports", "Tech", "Art", "Business", "Education", "Gaming", "Other"];

function CreateEventModal({ onClose, onCreate }) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    title: "", description: "", date: "", location: "",
    category: "Other", isOnline: false, price: 0, maxAttendees: 0,
  });
  const [creating, setCreating] = useState(false);

  const submit = async () => {
    if (!form.title.trim() || !form.date) {
      toast({ message: "Title and date are required", type: "error" });
      return;
    }
    setCreating(true);
    try {
      const res = await api.post("/events", form);
      onCreate(res.data.event);
      toast({ message: "Event created!", type: "success" });
      onClose();
    } catch (e) {
      toast({ message: "Failed to create event", type: "error" });
    } finally {
      setCreating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white dark:bg-[#15202b] rounded-2xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-[#38444d] sticky top-0 bg-white dark:bg-[#15202b] z-10">
          <h2 className="font-bold text-lg text-gray-900 dark:text-white">Create Event</h2>
          <button onClick={onClose}><X size={20} className="text-gray-500" /></button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 block">Event Title *</label>
            <input
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="What's happening?"
              className="w-full border border-gray-200 dark:border-[#38444d] bg-gray-50 dark:bg-[#1e2732] text-gray-800 dark:text-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 block">Date & Time *</label>
            <input
              type="datetime-local"
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
              className="w-full border border-gray-200 dark:border-[#38444d] bg-gray-50 dark:bg-[#1e2732] text-gray-800 dark:text-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#1e2732] rounded-xl">
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Online Event</p>
              <p className="text-xs text-gray-400">Virtual event with stream link</p>
            </div>
            <button
              onClick={() => setForm({ ...form, isOnline: !form.isOnline })}
              className={`w-11 h-6 rounded-full transition-colors relative ${form.isOnline ? "bg-blue-600" : "bg-gray-200"}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-transform ${form.isOnline ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
          </div>

          {!form.isOnline && (
            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 block">Location</label>
              <input
                value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })}
                placeholder="Where is it happening?"
                className="w-full border border-gray-200 dark:border-[#38444d] bg-gray-50 dark:bg-[#1e2732] text-gray-800 dark:text-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 block">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Tell people about this event..."
              rows={3}
              className="w-full border border-gray-200 dark:border-[#38444d] bg-gray-50 dark:bg-[#1e2732] text-gray-800 dark:text-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 block">Category</label>
            <div className="grid grid-cols-4 gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setForm({ ...form, category: cat })}
                  className={`text-xs px-2 py-2 rounded-xl border transition ${
                    form.category === cat
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                      : "border-gray-200 dark:border-[#38444d] text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 block">Price (0 = Free)</label>
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={e => setForm({ ...form, price: Number(e.target.value) })}
                className="w-full border border-gray-200 dark:border-[#38444d] bg-gray-50 dark:bg-[#1e2732] text-gray-800 dark:text-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 block">Max Attendees (0 = ∞)</label>
              <input
                type="number"
                min="0"
                value={form.maxAttendees}
                onChange={e => setForm({ ...form, maxAttendees: Number(e.target.value) })}
                className="w-full border border-gray-200 dark:border-[#38444d] bg-gray-50 dark:bg-[#1e2732] text-gray-800 dark:text-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          <button
            onClick={submit}
            disabled={creating || !form.title.trim() || !form.date}
            className="w-full bg-gradient-to-r from-sky-500 to-blue-700 text-white py-3 rounded-2xl font-bold disabled:opacity-40 hover:brightness-110 transition"
          >
            {creating ? "Creating..." : "Create Event"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Events() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [rsvping, setRsvping] = useState({});

  useEffect(() => {
    api.get("/events")
      .then(res => setEvents(res.data.events || []))
      .catch(() => toast({ message: "Failed to load events", type: "error" }))
      .finally(() => setLoading(false));
  }, []);

  const handleRsvp = async (eventId) => {
    setRsvping(prev => ({ ...prev, [eventId]: true }));
    try {
      const res = await api.post(`/events/${eventId}/rsvp`);
      setEvents(prev => prev.map(e =>
        e._id === eventId
          ? { ...e, rsvps: res.data.attending ? [...(e.rsvps || []), user._id] : (e.rsvps || []).filter(r => r !== user._id) }
          : e
      ));
      toast({ message: res.data.attending ? "You're attending! 🎉" : "RSVP cancelled", type: "success" });
    } catch (e) {
      toast({ message: "Failed to RSVP", type: "error" });
    } finally {
      setRsvping(prev => ({ ...prev, [eventId]: false }));
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return {
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      date: d.getDate(),
      month: d.toLocaleDateString("en-US", { month: "short" }),
      time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      full: d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    };
  };

  const filtered = activeCategory === "All"
    ? events
    : events.filter(e => e.category === activeCategory);

  return (
    <div className="min-h-screen dark:bg-[#15202b]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/90 dark:bg-[#15202b]/90 backdrop-blur-md border-b border-gray-100 dark:border-[#38444d] px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar size={20} className="text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Events</h1>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-2 rounded-full text-sm font-bold hover:bg-blue-700 transition"
          >
            <Plus size={14} /> Create
          </button>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {["All", ...CATEGORIES].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition ${
                activeCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-[#1e2732] text-gray-600 dark:text-gray-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events List */}
      <div className="p-4 space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-32 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Calendar size={48} className="mx-auto mb-4 opacity-30" />
            <p className="font-bold text-gray-600 dark:text-gray-400 text-lg">No events yet</p>
            <p className="text-sm mt-1">Create the first event!</p>
            <button
              onClick={() => setShowCreate(true)}
              className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700 transition"
            >
              Create Event
            </button>
          </div>
        ) : (
          filtered.map((event, i) => {
            const date = formatDate(event.date);
            const isAttending = event.rsvps?.includes(user?._id);
            const isHost = event.host?._id === user?._id;
            const spotsLeft = event.maxAttendees > 0
              ? event.maxAttendees - (event.rsvps?.length || 0)
              : null;

            return (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white dark:bg-[#1e2732] rounded-2xl border border-gray-100 dark:border-[#38444d] overflow-hidden hover:shadow-md transition"
              >
                <div className="flex">
                  {/* Date block */}
                  <div className="w-16 flex-shrink-0 bg-gradient-to-b from-blue-600 to-blue-700 flex flex-col items-center justify-center py-4">
                    <span className="text-blue-200 text-xs font-medium">{date.day}</span>
                    <span className="text-white text-2xl font-extrabold">{date.date}</span>
                    <span className="text-blue-200 text-xs font-medium">{date.month}</span>
                  </div>

                  {/* Event info */}
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0 mr-3">
                        <h3 className="font-bold text-gray-900 dark:text-white truncate">{event.title}</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <Clock size={11} /> {date.time}
                          </span>
                          {event.location && (
                            <span className="flex items-center gap-1 text-xs text-gray-400">
                              <MapPin size={11} /> {event.location}
                            </span>
                          )}
                          {event.isOnline && (
                            <span className="flex items-center gap-1 text-xs text-blue-500">
                              <Globe size={11} /> Online
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                          <img
                            src={event.host?.avatar || `https://ui-avatars.com/api/?name=${event.host?.username}&background=2563eb&color=fff`}
                            className="w-5 h-5 rounded-full object-cover"
                            alt="host"
                          />
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            by {event.host?.name || event.host?.username}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 mt-2">
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <Users size={11} /> {event.rsvps?.length || 0} attending
                          </span>
                          {spotsLeft !== null && (
                            <span className={`text-xs font-medium ${spotsLeft <= 5 ? "text-red-500" : "text-gray-400"}`}>
                              {spotsLeft} spots left
                            </span>
                          )}
                          {event.price > 0 && (
                            <span className="text-xs font-bold text-green-600">${event.price}</span>
                          )}
                          {event.price === 0 && (
                            <span className="text-xs font-bold text-green-600">Free</span>
                          )}
                        </div>
                      </div>

                      {/* RSVP button */}
                      {!isHost && (
                        <button
                          onClick={() => handleRsvp(event._id)}
                          disabled={rsvping[event._id] || (spotsLeft === 0 && !isAttending)}
                          className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition ${
                            isAttending
                              ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-red-50 hover:text-red-500"
                              : spotsLeft === 0
                              ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                        >
                          {rsvping[event._id] ? "..." : isAttending ? "✓ Going" : spotsLeft === 0 ? "Full" : "RSVP"}
                        </button>
                      )}
                      {isHost && (
                        <span className="flex-shrink-0 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full">Host</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreate && (
          <CreateEventModal
            onClose={() => setShowCreate(false)}
            onCreate={(e) => setEvents(prev => [e, ...prev])}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
