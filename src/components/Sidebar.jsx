import React from 'react';
import { Home, Calendar, User } from 'lucide-react';
import logo from '../../assets/logo.jpeg';

export default function Sidebar({ currentTab, setCurrentTab }) {
  const navItems = [
    { id: 'home', label: 'Feed', icon: Home },
    { id: 'events', label: 'Events & Tickets', icon: Calendar },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="w-64 p-4 flex flex-col justify-between h-screen sticky top-0">
      <div className="space-y-6">
        {/* Animated Logo + Branding */}
        <div className="flex items-center space-x-3 px-4">
          <div className="logo-wrapper">
            <img
              src={logo}
              alt="Feed Logo"
              className="logo-img w-10 h-10 rounded-xl object-cover"
            />
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
                  currentTab === item.id
                    ? 'bg-slate-800 text-blue-400'
                    : 'hover:bg-slate-800 text-slate-300'
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
