import StatsCards from "../components/admin/StatsCards";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-8">
      {/* Header Section */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome to the Admin Dashboard</h1>
        <p className="text-gray-600">Manage your site with ease and efficiency</p>
      </header>
      
      {/* Main Content Area */}
      <div className="flex-1 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Stats Cards */}
        <StatsCards />
        {/* Additional sections can be added here, such as recent activity, notifications, etc. */}
        {/* Example Placeholder */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Recent Activity</h2>
          <ul className="text-gray-600 list-disc list-inside space-y-2">
            <li>User John updated profile</li>
            <li>New order received</li>
            <li>Server backup completed</li>
          </ul>
        </div>
      </div>
    </div>
  );
}