import { useState } from 'react';

export default function Settings() {
  // Example state for future settings toggles or inputs
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gray-50 rounded-lg shadow-md">
      {/* Header */}
      <h1 className="text-4xl font-semibold mb-6 text-center text-gray-800">Settings</h1>
      
      {/* Profile Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Profile</h2>
        <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col md:flex-row items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold text-xl">
              U
            </div>
            <div>
              <p className="text-gray-800 font-semibold">Username</p>
              <p className="text-gray-500 text-sm">Change your profile details</p>
            </div>
          </div>
          <button className="mt-2 md:mt-0 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Edit Profile
          </button>
        </div>
      </section>

      {/* Notifications Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Notifications</h2>
        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-800">Enable Notifications</p>
            <p className="text-gray-500 text-sm">Stay updated with the latest alerts</p>
          </div>
          <button
            onClick={toggleNotifications}
            className={`ml-4 px-4 py-2 rounded ${notificationsEnabled ? 'bg-green-500' : 'bg-red-500'} text-white`}
          >
            {notificationsEnabled ? 'On' : 'Off'}
          </button>
        </div>
      </section>

      {/* Privacy & Security */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Privacy & Security</h2>
        <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
          <button className="w-full text-left px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
            Change Password
          </button>
          <button className="w-full text-left px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
            Manage Two-Factor Authentication
          </button>
        </div>
      </section>
    </div>
  );
}