import {
  Home,
  Radio,
  User,
  Bell,
} from "lucide-react";

import { Link } from "react-router-dom";

export default function MobileNav() {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t h-16 flex justify-around items-center">
      <Link to="/">
        <Home />
      </Link>

      <Link to="/live">
        <Radio />
      </Link>

      <Link to="/notifications">
        <Bell />
      </Link>

      <Link to="/profile/me">
        <User />
      </Link>
    </div>
  );
}