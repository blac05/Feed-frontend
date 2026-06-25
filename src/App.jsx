import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Sidebar from "./components/Layout/Sidebar";
import RightPanel from "./components/Layout/RightPanel";
import BottomNav from "./components/Layout/BottomNav";
import SplashScreen from "./components/SplashScreen";
import { useAuth } from "./context/AuthContext";
import { useTheme } from "./context/ThemeContext";

const AUTH_PAGES = ["/", "/login", "/register"];

export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  const { user, loading } = useAuth();
  const { dark } = useTheme(); // Maintained for theme context attachment
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthPage = AUTH_PAGES.includes(location.pathname);

  useEffect(() => {
    // 1. Wait completely until BOTH the splash screen finishes and the auth state resolves
    if (!splashDone || loading) return;

    // 2. Unauthenticated check: Redirect out if hitting internal pages
    if (!user && !isAuthPage) {
      navigate("/", { replace: true });
    }
    
    // 3. Authenticated check: Redirect in if trying to view auth pages while logged in
    if (user && isAuthPage) {
      navigate("/home", { replace: true });
    }
  }, [user, loading, splashDone, location.pathname]); // Safe path location dependency tracking

  // Show splash overlay first
  if (!splashDone) {
    return <SplashScreen onDone={() => setSplashDone(true)} />;
  }

  // Show loading spinner only while verifying server state session
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#15202b]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Plain layout for Login, Registration, and Splash landing entries
  if (isAuthPage) {
    return <AppRoutes />;
  }

  // Dashboard Frame Layout for application pages
  return (
    <div className="min-h-screen bg-[#f7f9f9] dark:bg-[#1e2732] flex justify-center transition-colors duration-200">
      <div className="flex w-full max-w-7xl">
        {/* Left Sidebar */}
        <div className="hidden md:flex flex-col w-20 xl:w-72 sticky top-0 h-screen">
          <Sidebar />
        </div>

        {/* Main Feed */}
        <main className="flex-1 min-h-screen border-x border-gray-200 dark:border-[#38444d] bg-white dark:bg-[#15202b] max-w-2xl pb-16 md:pb-0">
          <AppRoutes />
        </main>

        {/* Right Panel */}
        <div className="hidden lg:flex flex-col w-80 xl:w-96 sticky top-0 h-screen p-4">
          <RightPanel />
        </div>
      </div>
      <BottomNav />
    </div>
  );
}