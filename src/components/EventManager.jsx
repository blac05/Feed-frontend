import React from 'react';
import { Ticket, MapPin, Calendar } from 'lucide-react';

export default function EventManager() {
  const events = [
    {
      id: 'e1',
      title: 'Global Economic Summit 2026',
      date: 'June 14, 2026',
      location: 'Accra Conference Hall / Hybrid',
      price: 120.00,
      slotsLeft: 45
    },
    {
      id: 'e2',
      title: 'Championship Finals Fan Fest',
      date: 'July 02, 2026',
      location: 'National Sports Arena',
      price: 35.00,
      slotsLeft: 200
    }
  ];

  return (
    <div className="p-4 space-y-4">
      <div className="border-b border-slate-800 pb-3">
        <h2 className="text-xl font-bold">Upcoming Verified Events</h2>
        <p className="text-slate-400 text-sm">Secure entry tokens and official briefings directly from organizational hosts.</p>
      </div>

      <div className="grid gap-4">
        {events.map(ev => (
          <div key={ev.id} className="bg-slate-800 rounded-xl p-5 border border-slate-700 flex flex-col justify-between md:flex-row items-start md:items-center gap-4">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">{ev.title}</h3>
              <div className="flex flex-col gap-1 text-sm text-slate-300">
                <span className="flex items-center gap-2"><Calendar size={14} className="text-feedBlue-light" /> {ev.date}</span>
                <span className="flex items-center gap-2"><MapPin size={14} className="text-feedBlue-light" /> {ev.location}</span>
              </div>
            </div>
            
            <div className="text-left md:text-right w-full md:w-auto border-t md:border-t-0 border-slate-700 pt-3 md:pt-0">
              <div className="text-xl font-black text-white">${ev.price.toFixed(2)}</div>
              <div className="text-xs text-slate-400 mb-2">{ev.slotsLeft} badges left</div>
              <button className="w-full md:w-auto bg-feedBlue hover:bg-feedBlue-light px-5 py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition text-sm">
                <Ticket size={16} /> Buy Ticket
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}