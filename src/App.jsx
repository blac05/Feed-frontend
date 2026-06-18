import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Sidebar from "./components/layout/Sidebar";
import RightPanel from "./components/layout/RightPanel";
import BottomNav from "./components/layout/BottomNav";
import SplashScreen from "./components/SplashScreen";
import { useAuth } from "./context/AuthContext";

const AUTH_PAGES = ["/", "/login", "/register"];

export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthPage = AUTH_PAGES.includes(location.pathname);

  useEffect(() => {
    if (!loading && !splashDone) return;
    if (!loading && !user && !isAuthPage) navigate("/");
    if (!loading && user && isAuthPage) navigate("/home");
  }, [user, loading, isAuthPage]);

  if (!splashDone) return <SplashScreen onDone={() => setSplashDone(true)} />;
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (isAuthPage) return <AppRoutes />;

  return (
    <div className="min-h-screen bg-[#f7f9f9] flex justify-center">
      <div className="flex w-full max-w-7xl">
        {/* Left Sidebar — desktop only */}
        <div className="hidden md:flex flex-col w-20 xl:w-72 sticky top-0 h-screen">
          <Sidebar />
        </div>

        {/* Main Feed */}
        <main className="flex-1 min-h-screen border-x border-gray-200 bg-white max-w-2xl pb-16 md:pb-0">
          <AppRoutes />
        </main>

        {/* Right Panel — large screens only */}
        <div className="hidden lg:flex flex-col w-80 xl:w-96 sticky top-0 h-screen p-4">
          <RightPanel />
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <BottomNav />
    </div>
  );
}
