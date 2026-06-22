import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Eye, EyeOff } from "lucide-react";
import api from "../api/axios";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactorToken, setTwoFactorToken] = useState("");
  const [requires2FA, setRequires2FA] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = { email, password };
      if (requires2FA) payload.twoFactorToken = twoFactorToken;

      const res = await api.post("/auth/login", payload);

      if (res.status === 202 && res.data.requires2FA) {
        setRequires2FA(true);
        setLoading(false);
        return;
      }

      login(res.data.token, res.data.user);
      navigate("/home");
    } catch (err) {
      const msg = err.response?.data?.message;
      setError(msg || "Invalid email or password.");
      if (requires2FA) setTwoFactorToken("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 dark:from-[#0d1117] dark:to-[#15202b] flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-white dark:bg-[#1e2732] rounded-3xl shadow-xl p-8"
      >
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="Feed" className="w-16 h-16 rounded-2xl shadow mb-3" />
          {requires2FA ? (
            <>
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-3">
                <Shield size={28} className="text-blue-600" />
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Two-Factor Auth</h1>
              <p className="text-gray-400 text-sm mt-1 text-center">Enter the 6-digit code from your authenticator app</p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Welcome back</h1>
              <p className="text-gray-400 text-sm mt-1">Log in to your Feed account</p>
            </>
          )}
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-500 text-sm text-center py-2.5 px-4 rounded-xl"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <AnimatePresence mode="wait">
            {!requires2FA ? (
              <motion.div
                key="credentials"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-4"
              >
                <input
                  placeholder="Email"
                  className="w-full border border-gray-200 dark:border-[#38444d] bg-gray-50 dark:bg-[#15202b] text-gray-800 dark:text-gray-200 p-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  type="email"
                  required
                />
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    placeholder="Password"
                    className="w-full border border-gray-200 dark:border-[#38444d] bg-gray-50 dark:bg-[#15202b] text-gray-800 dark:text-gray-200 p-3.5 pr-12 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(s => !s)}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="2fa"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  placeholder="000000"
                  className="w-full border-2 border-blue-300 dark:border-blue-700 bg-gray-50 dark:bg-[#15202b] text-gray-800 dark:text-gray-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-center text-2xl font-mono tracking-widest"
                  value={twoFactorToken}
                  onChange={e => setTwoFactorToken(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  required
                  autoFocus
                />
                <p className="text-xs text-center text-gray-400 mt-2">
                  Open Google Authenticator or Authy to get your code
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={loading || (requires2FA && twoFactorToken.length !== 6)}
            className="w-full bg-gradient-to-r from-sky-500 to-blue-700 text-white py-3.5 rounded-2xl font-bold text-lg shadow hover:brightness-110 transition mt-1 disabled:opacity-50"
          >
            {loading ? "Verifying..." : requires2FA ? "Verify Code" : "Log In"}
          </button>

          {requires2FA && (
            <button
              type="button"
              onClick={() => { setRequires2FA(false); setTwoFactorToken(""); setError(""); }}
              className="text-sm text-gray-400 hover:text-gray-600 text-center transition"
            >
              ← Back to login
            </button>
          )}
        </form>

        {!requires2FA && (
          <>
            <div className="mt-4 text-center">
              <Link to="/forgot-password" className="text-sm text-blue-500 hover:underline">
                Forgot your password?
              </Link>
            </div>
            <p className="text-center text-gray-400 text-sm mt-4">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 font-semibold hover:underline">Sign up</Link>
            </p>
            <p className="text-center mt-3">
              <Link to="/" className="text-gray-300 dark:text-gray-600 text-xs hover:text-gray-400">← Back to home</Link>
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}
