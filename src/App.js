import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Feed from './components/Feed';
import EventManager from './components/EventManager';

export default function App() {
  const [currentTab, setCurrentTab] = useState('home'); // home, events, profile

  return (
    <div className="min-h-screen bg-slate-900 text-white flex justify-center">
      <div className="w-full max-w-7xl flex">
        {/* Sidebar Navigation */}
        <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

        {/* Main Content Area */}
        <main className="flex-1 border-x border-slate-800 min-h-screen max-w-2xl">
          {currentTab === 'home' && <Feed />}
          {currentTab === 'events' && <EventManager />}
          {currentTab === 'profile' && (
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Profile Settings</h2>
              <div className="bg-slate-800 p-6 rounded-xl flex items-center space-x-4">
                <div className="w-20 h-20 bg-feedBlue rounded-full flex items-center justify-center text-2xl font-bold">
                  F
                </div>
                <div>
                  <button className="bg-feedBlue hover:bg-feedBlue-light px-4 py-2 rounded-full text-sm transition">
                    Update Profile Picture
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Right Info Widget Panel */}
        <aside className="w-80 p-4 hidden lg:block space-y-4">
          <div className="bg-slate-800 rounded-2xl p-4">
            <h3 className="font-bold text-lg mb-2">Verified Channels</h3>
            <p className="text-sm text-slate-400">Follow official organizational feeds with verified statistics.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}