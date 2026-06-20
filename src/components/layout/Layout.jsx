import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import RightPanel from "./RightPanel";
import BottomNav from "./BottomNav";

function Layout() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* 1. Mobile Top Navbar (hidden on desktop) */}
      <div className="md:hidden sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <Navbar />
      </div>

      {/* 2. Main App Container */}
      <div className="flex flex-1 max-w-7xl w-full mx-auto xl:px-8">
        
        {/* Desktop Sidebar (Left Panel) */}
        <aside className="hidden md:block w-20 xl:w-64 sticky top-0 h-screen border-r border-gray-800 p-3">
          <Sidebar />
        </aside>

        {/* Dynamic Center Feed */}
        <main className="flex-1 border-r border-gray-800 min-h-screen pb-16 md:pb-0">
          <Outlet /> {/* 👈 Your pages (AI Studio, Ads, Home) render right here! */}
        </main>

        {/* Desktop Right Panel (Trends, Who to Follow, etc.) */}
        <aside className="hidden lg:block w-80 sticky top-0 h-screen p-4">
          <RightPanel />
        </aside>

      </div>

      {/* 3. Mobile Bottom Navigation Bar (hidden on desktop) */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-black border-t border-gray-800">
        <BottomNav />
      </footer>
    </div>
  );
}

export default Layout;