import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import logo from "../assets/logo.png";

const accountTypes = [
  { value: "personal", label: "Personal", icon: "👤", desc: "For individuals sharing their life" },
  { value: "creator", label: "Creator", icon: "🎨", desc: "For artists, influencers & content creators" },
  { value: "company", label: "Company / Firm", icon: "🏢", desc: "For businesses and organizations" },
  { value: "prominent", label: "Prominent Figure", icon: "⭐", desc: "For politicians, executives & public figures" },
  { value: "popstar", label: "Entertainer", icon: "🎤", desc: "For musicians, actors & entertainers" },
];

export default function Register() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "", username: "", email: "", password: "", accountType: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/register", form);
      localStorage.setItem("token", res.data.token);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="Feed" className="w-14 h-14 rounded-2xl shadow mb-3" />
          <h1 className="text-3xl font-extrabold text-blue-900">Join Feed</h1>
          <div className="flex gap-1 mt-3">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${step >= i ? "bg-blue-600 w-8" : "bg-gray-200 w-4"}`} />
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-500 text-sm text-center py-2.5 px-4 rounded-xl">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* Step 1 — Account Type */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <p className="text-gray-500 text-sm mb-4 text-center">What best describes you?</p>
              <div className="space-y-2">
                {accountTypes.map(type => (
                  <button
                    key={type.value}
                    onClick={() => setForm({ ...form, accountType: type.value })}
                    className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 transition text-left ${
                      form.accountType === type.value
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <span className="text-2xl">{type.icon}</span>
                    <div>
                      <p className="font-semibold text-sm text-gray-800">{type.label}</p>
                      <p className="text-xs text-gray-400">{type.desc}</p>
                    </div>
                    {form.accountType === type.value && (
                      <span className="ml-auto text-blue-600 font-bold">✓</span>
                    )}
                  </button>
                ))}
              </div>
              <button
                disabled={!form.accountType}
                onClick={() => setStep(2)}
                className="w-full mt-5 bg-gradient-to-r from-sky-500 to-blue-700 text-white py-3.5 rounded-2xl font-bold text-lg shadow hover:brightness-110 transition disabled:opacity-40"
              >
                Continue →
              </button>
            </motion.div>
          )}

          {/* Step 2 — Basic Info */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-4"
            >
              <p className="text-gray-500 text-sm text-center">Tell us about yourself</p>
              <input
                name="name"
                placeholder="Full Name"
                className="w-full border border-gray-200 bg-gray-50 text-gray-800 p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form.name}
                onChange={update}
                required
              />
              <input
                name="username"
                placeholder="Username"
                className="w-full border border-gray-200 bg-gray-50 text-gray-800 p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form.username}
                onChange={update}
                required
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border-2 border-gray-200 text-gray-500 py-3.5 rounded-2xl font-bold hover:bg-gray-50 transition"
                >
                  ← Back
                </button>
                <button
                  disabled={!form.name || !form.username}
                  onClick={() => setStep(3)}
                  className="flex-1 bg-gradient-to-r from-sky-500 to-blue-700 text-white py-3.5 rounded-2xl font-bold shadow hover:brightness-110 transition disabled:opacity-40"
                >
                  Continue →
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3 — Credentials */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-4"
            >
              <p className="text-gray-500 text-sm text-center">Set your login credentials</p>
              <input
                name="email"
                type="email"
                placeholder="Email"
                className="w-full border border-gray-200 bg-gray-50 text-gray-800 p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form.email}
                onChange={update}
                required
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                className="w-full border border-gray-200 bg-gray-50 text-gray-800 p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form.password}
                onChange={update}
                required
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 border-2 border-gray-200 text-gray-500 py-3.5 rounded-2xl font-bold hover:bg-gray-50 transition"
                >
                  ← Back
                </button>
                <button
                  disabled={!form.email || !form.password || loading}
                  onClick={submit}
                  className="flex-1 bg-gradient-to-r from-sky-500 to-blue-700 text-white py-3.5 rounded-2xl font-bold shadow hover:brightness-110 transition disabled:opacity-40"
                >
                  {loading ? "Creating..." : "Create Account"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center text-gray-400 text-sm mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
}