import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-between py-12 px-6">
      {/* Center content */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm">
        {/* Logo */}
        <motion.img
          src={logo}
          alt="Feed"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-20 h-20 rounded-2xl shadow-md mb-4"
        />

        {/* App name */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl font-extrabold text-blue-900 mb-2"
        >
          Feed
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 text-center text-sm mb-10"
        >
          Connect with friends, share moments,{" "}
          <br /> and discover what's happening.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full flex flex-col gap-3"
        >
          <button
            onClick={() => navigate("/register")}
            className="w-full bg-gradient-to-r from-sky-500 to-blue-700 text-white py-3.5 rounded-2xl font-bold text-lg shadow-lg hover:brightness-110 transition"
          >
            Create Account
          </button>

          <button
            onClick={() => navigate("/login")}
            className="w-full border-2 border-blue-600 text-blue-700 py-3.5 rounded-2xl font-bold text-lg hover:bg-blue-50 transition"
          >
            Log In
          </button>
        </motion.div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6 w-full">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-gray-400 text-xs">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Guest browse */}
        <button
          onClick={() => navigate("/explore")}
          className="text-blue-500 text-sm font-medium hover:underline"
        >
          Browse as Guest
        </button>
      </div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-gray-300 text-xs text-center"
      >
        © 2026 Feed · Gibson Labs
      </motion.p>
    </div>
  );
}