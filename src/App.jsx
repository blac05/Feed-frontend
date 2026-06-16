import { useState } from "react";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import AppRoutes from "./routes/AppRoutes";
import SplashScreen from "./components/SplashScreen";

export default function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [splashDone, setSplashDone] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <>
      {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}

      {splashDone && (
        <div className="flex min-h-screen bg-slate-50">
          <Sidebar isOpen={isSidebarOpen} />
          <div className="flex-1 flex flex-col">
            <Navbar onToggleSidebar={toggleSidebar} />
            <main className="flex-1 p-4">
              <AppRoutes />
            </main>
          </div>
        </div>
      )}
    </>
  );
}