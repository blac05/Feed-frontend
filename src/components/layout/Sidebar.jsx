import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Home, Search, Bell, Mail, Bookmark, User,
  Settings, Radio, ShoppingBag, Wallet, Users,
  LogOut, Moon, Sun
} from "lucide-react";
import logo from "../../assets/logo.png";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();

  const navLinks = [
    { to: "/home", label: "Home", icon: Home },
    { to: "/explore", label: "Explore", icon: Search },
    { to: "/notifications", label: "Notifications", icon: Bell, badge: true },
    { to: "/messages", label: "Messages", icon: Mail },
    { to: "/bookmarks", label: "Bookmarks", icon: Bookmark },
    { to: "/communities", label: "Communities", icon: Users },
    { to: "/live", label: "Live", icon: Radio },
    { to: "/marketplace", label: "Marketplace", icon: ShoppingBag },
    { to: "/wallet", label: "Wallet", icon: Wallet },
    { to: "/profile/me", label: "Profile", icon: User },
    { to: "/settings", label: "Settings", icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex flex-col h-full py-4 px-3 bg-white dark:bg-[#15202b] transition-colors duration-200">
      {/* Logo */}
      <Link to="/home" className="flex items-center gap-3 px-3 mb-6">
        <img src={logo} alt="Feed" className="w-10 h-10 rounded-xl" />
        <span className="text-2xl font-extrabold text-blue-600 hidden xl:block">Feed</span>
      </Link>

      {/* Nav Links */}
      <nav className="flex flex-col gap-1 flex-1">
        {navLinks.map(({ to, label, icon: Icon, badge }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-4 px-3 py-3 rounded-2xl transition-all group ${
                active
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 font-bold"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1e2732]"
              }`}
            >
              <Icon size={22} className={active ? "text-blue-600" : "text-gray-700 dark:text-gray-300"} />
              <span className="text-[15px] hidden xl:block">{label}</span>
              {badge && (
                <span className="ml-auto bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center hidden xl:flex">
                  3
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="flex items-center gap-4 px-3 py-3 rounded-2xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1e2732] transition mb-2"
      >
        {dark ? <Sun size={22} className="text-yellow-400" /> : <Moon size={22} />}
        <span className="text-[15px] hidden xl:block">{dark ? "Light Mode" : "Dark Mode"}</span>
      </button>

      {/* Post Button */}
      <button
        onClick={() => navigate("/home")}
        className="mt-2 bg-gradient-to-r from-sky-500 to-blue-700 text-white font-bold py-3 rounded-2xl hover:brightness-110 transition hidden xl:block"
      >
        + New Post
      </button>
      <button
        onClick={() => navigate("/home")}
        className="mt-2 bg-gradient-to-r from-sky-500 to-blue-700 text-white font-bold p-3 rounded-2xl hover:brightness-110 transition xl:hidden flex items-center justify-center"
      >
        +
      </button>

      {/* User Footer */}
      {user && (
        <div className="mt-4 flex items-center gap-3 px-3 py-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-[#1e2732] cursor-pointer transition">
          <img
            src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=2563eb&color=fff`}
            className="w-9 h-9 rounded-full object-cover flex-shrink-0"
            alt="avatar"
          />
          <div className="hidden xl:block flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate">{user.name || user.username}</p>
            <p className="text-xs text-gray-400 truncate">@{user.username}</p>
          </div>
          <button onClick={handleLogout} className="hidden xl:block text-gray-400 hover:text-red-500 transition">
            <LogOut size={16} />
          </button>
        </div>
      )}
    </div>
  );
}