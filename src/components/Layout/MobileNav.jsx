import { useNavigate, useLocation } from "react-router-dom";
import { Home, Search, Bell, Mail, User, Moon, Sun } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { dark, toggleTheme } = useTheme();

  const navItems = [
    { to: "/home", icon: Home },
    { to: "/explore", icon: Search },
    { to: "/notifications", icon: Bell, badge: true },
    { to: "/messages", icon: Mail },
    { to: "/profile/me", icon: User, isAvatar: true },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#15202b] border-t border-gray-200 dark:border-[#38444d] flex md:hidden transition-colors duration-200">
      {navItems.map(({ to, icon: Icon, badge, isAvatar }) => {
        const active = location.pathname === to;
        return (
          <button
            key={to}
            onClick={() => navigate(to)}
            className={`flex-1 flex flex-col items-center justify-center py-3 transition relative ${
              active ? "text-blue-600" : "text-gray-400 dark:text-gray-500"
            }`}
          >
            {isAvatar && user?.avatar ? (
              <img
                src={user.avatar}
                className={`w-7 h-7 rounded-full object-cover border-2 ${active ? "border-blue-600" : "border-transparent"}`}
                alt="avatar"
              />
            ) : (
              <Icon size={22} />
            )}
            {badge && (
              <span className="absolute top-2 right-[calc(50%-8px)] w-4 h-4 bg-blue-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                3
              </span>
            )}
          </button>
        );
      })}
      {/* Theme toggle on mobile */}
      <button
        onClick={toggleTheme}
        className="flex-1 flex flex-col items-center justify-center py-3 text-gray-400 dark:text-gray-500 transition"
      >
        {dark ? <Sun size={22} className="text-yellow-400" /> : <Moon size={22} />}
      </button>
    </nav>
  );
}