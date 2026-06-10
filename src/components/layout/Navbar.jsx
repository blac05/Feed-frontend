import { Bell, Search } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 h-16 bg-white/80 backdrop-blur-lg border-b flex items-center justify-between px-6">

      <Link
        to="/"
        className="flex items-center gap-3"
      >
        <img
          src={logo}
          alt="Feed"
          className="h-10 w-10"
        />

        <span className="text-2xl font-bold text-blue-600">
          Feed
        </span>
      </Link>

      <div className="hidden md:flex items-center bg-slate-100 rounded-xl px-3 py-2 w-96">
        <Search size={18} />

        <input
          placeholder="Search Feed..."
          className="bg-transparent ml-2 outline-none w-full"
        />
      </div>

      <Link to="/notifications">
        <Bell />
      </Link>

    </header>
  );
}