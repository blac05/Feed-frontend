import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios";
import logo from "../assets/logo.png";

export default function Register() {
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/register", form);
      localStorage.setItem("token", res.data.token);
      navigate("/home");
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="Feed" className="w-16 h-16 rounded-2xl shadow mb-3" />
          <h1 className="text-3xl font-extrabold text-blue-900">Join Feed</h1>
          <p className="text-gray-400 text-sm mt-1 text-center">
            Create an account and start connecting
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-500 text-sm text-center py-2.5 px-4 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="flex flex-col gap-4">
          <input
            name="name"
            placeholder="Full Name"
            className="w-full border border-gray-200 bg-gray-50 text-gray-800 p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={form.name}
            onChange={update}
            required
          />
          <input
            name="username"
            placeholder="Username"
            className="w-full border border-gray-200 bg-gray-50 text-gray-800 p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={form.username}
            onChange={update}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full border border-gray-200 bg-gray-50 text-gray-800 p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={form.email}
            onChange={update}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full border border-gray-200 bg-gray-50 text-gray-800 p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={form.password}
            onChange={update}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-sky-500 to-blue-700 text-white py-3.5 rounded-2xl font-bold text-lg shadow hover:brightness-110 transition mt-1"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">
            Log in
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