import { useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import AppRoutes from "./routes/AppRoutes";
import SplashScreen from "./components/SplashScreen";

const AUTH_PAGES = ["/", "/login", "/register"];

export default function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [splashDone, setSplashDone] = useState(false);
  const location = useLocation();

  const isAuthPage = AUTH_PAGES.includes(location.pathname);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <>
      {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}

      {splashDone && (
        <div className={isAuthPage ? "" : "flex min-h-screen bg-slate-50"}>
          {!isAuthPage && <Sidebar isOpen={isSidebarOpen} />}
          <div className="flex-1 flex flex-col">
            {!isAuthPage && <Navbar onToggleSidebar={toggleSidebar} />}
            <main className={isAuthPage ? "" : "flex-1 p-4"}>
              <AppRoutes />
            </main>
          </div>
        </div>
      )}
    </>
  );
}