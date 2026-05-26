import React from 'react';
import { Home, Calendar, User, CheckCircle2, MessageSquare } from 'lucide-react';

export default function Sidebar({ currentTab, setCurrentTab }) {
  const navItems = [
    { id: 'home', label: 'Feed', icon: Home },
    { id: 'events', label: 'Events & Tickets', icon: Calendar },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="w-64 p-4 flex flex-col justify-between h-screen sticky top-0">
      <div className="space-y-6">
        {/* Branding using the Hook logo style context */}
        <div className="flex items-center space-x-2 text-feedBlue-light px-4">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-700 rounded-lg flex items-center justify-center font-black text-white text-lg">
            )
          </div>
          <span className="text-2xl font-bold tracking-wider text-white">Feed</span>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center space-x-4 px-4 py-3 rounded-full text-lg font-medium transition ${
                  currentTab === item.id ? 'bg-slate-800 text-feedBlue-light' : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <Icon size={24} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}