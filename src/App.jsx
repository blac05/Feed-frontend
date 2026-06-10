import { useState } from "react";
import { BrowserRouter } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  // State to control sidebar visibility on smaller screens
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Function to toggle sidebar open/close
  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <BrowserRouter>
      {/* Main container with flex layout */}
      <div className="flex min-h-screen bg-slate-50" role="main">
        {/* Sidebar: visible on large screens, toggle on smaller screens */}
        <Sidebar isOpen={isSidebarOpen} />

        {/* Content area */}
        <div className="flex-1 flex flex-col">
          {/* Navbar with toggle button for sidebar */}
          <Navbar onToggleSidebar={toggleSidebar} />

          {/* Main content routed here */}
          <main className="flex-1 p-4">
            <AppRoutes />
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}