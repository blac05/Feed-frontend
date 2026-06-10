import {
  Home,
  Radio,
  User,
  Bell,
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";

export default function MobileNav() {
  const location = useLocation();

  const links = [
    { to: "/", icon: <Home />, ariaLabel: "Home" },
    { to: "/live", icon: <Radio />, ariaLabel: "Live" },
    { to: "/notifications", icon: <Bell />, ariaLabel: "Notifications" },
    { to: "/profile/me", icon: <User />, ariaLabel: "Profile" },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t h-16 flex justify-around items-center">
      {links.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          aria-label={link.ariaLabel}
          className={`flex flex-col items-center justify-center p-2 ${
            location.pathname === link.to
              ? "text-blue-600"
              : "text-gray-600 hover:text-blue-500"
          }`}
        >
          {React.cloneElement(link.icon, { size: 24, "aria-hidden": true })}
        </Link>
      ))}
    </div>
  );
}