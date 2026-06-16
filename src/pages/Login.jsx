import { useState } from "react";
import api from "../api/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 relative overflow-hidden">

      

      {/* Login form with animations */}
      <form
        onSubmit={submit}
        className="bg-white bg-opacity-20 backdrop-blur-xl p-8 rounded-3xl shadow-xl max-w-md w-full animate-fadeInUp"
      >
        <h1 className="text-4xl font-extrabold mb-6 text-center text-white drop-shadow-lg">
          Welcome Back
        </h1>

        {error && (
          <div className="mb-4 text-red-300 text-center font-semibold animate-bounceIn">
            {error}
          </div>
        )}

        <input
          placeholder="Email"
          className="w-full border-2 border-white bg-transparent text-white p-3 rounded-xl mb-4 focus:outline-none focus:ring-4 focus:ring-purple-300 transition"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border-2 border-white bg-transparent text-white p-3 rounded-xl mb-6 focus:outline-none focus:ring-4 focus:ring-purple-300 transition"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:scale-105 hover:shadow-xl hover:brightness-110 transition transform duration-300 ease-in-out"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}