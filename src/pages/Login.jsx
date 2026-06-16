import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios";
import logo from "../assets/logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/home");
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="Feed" className="w-16 h-16 rounded-2xl shadow mb-3" />
          <h1 className="text-3xl font-extrabold text-blue-900">Welcome back</h1>
          <p className="text-gray-400 text-sm mt-1">Log in to your Feed account</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-500 text-sm text-center py-2.5 px-4 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="flex flex-col gap-4">
          <input
            placeholder="Email"
            className="w-full border border-gray-200 bg-gray-50 text-gray-800 p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-200 bg-gray-50 text-gray-800 p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-sky-500 to-blue-700 text-white py-3.5 rounded-2xl font-bold text-lg shadow hover:brightness-110 transition mt-1"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 font-semibold hover:underline">
            Sign up
          </Link>
        </p>

        <p className="text-center mt-3">
          <Link to="/" className="text-gray-300 text-xs hover:text-gray-400">
            ← Back to home
          </Link>
        </p>
      </motion.div>
    </div>
  );
}