import { useNavigate, useLocation } from "react-router-dom";
import { Home, Search, Bell, Mail, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/home", icon: Home },
  { to: "/explore", icon: Search },
  { to: "/notifications", icon: Bell, badge: true },
  { to: "/messages", icon: Mail },
  { to: "/profile/me", icon: User, isAvatar: true },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 flex md:hidden">
      {navItems.map(({ to, icon: Icon, badge, isAvatar }) => {
        const active = location.pathname === to;
        return (
          <button
            key={to}
            onClick={() => navigate(to)}
            className={`flex-1 flex flex-col items-center justify-center py-3 transition relative ${
              active ? "text-blue-600" : "text-gray-400"
            }`}
          >
            {isAvatar && user?.avatar ? (
              <img
                src={user.avatar}
                className={`w-7 h-7 rounded-full object-cover border-2 ${active ? "border-blue-600" : "border-transparent"}`}
                alt="avatar"
              />
            ) : (
              <Icon size={22} className={active ? "fill-blue-600 text-blue-600" : ""} />
            )}
            {badge && (
              <span className="absolute top-2 right-[calc(50%-8px)] w-4 h-4 bg-blue-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                3
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
