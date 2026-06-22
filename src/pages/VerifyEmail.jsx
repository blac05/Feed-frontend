import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get(`/auth/verify-email/${token}`)
      .then(res => { setStatus("success"); setMessage(res.data.message); })
      .catch(err => { setStatus("error"); setMessage(err.response?.data?.message || "Verification failed"); });
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 dark:from-[#0d1117] dark:to-[#15202b] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-[#1e2732] rounded-3xl shadow-xl w-full max-w-md p-8 text-center"
      >
        {status === "loading" && (
          <>
            <Loader size={48} className="mx-auto mb-4 text-blue-600 animate-spin" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Verifying your email...</h2>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Email verified! 🎉</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">{message}</p>
            <Link
              to="/home"
              className="inline-block bg-gradient-to-r from-sky-500 to-blue-700 text-white px-8 py-3 rounded-2xl font-bold hover:brightness-110 transition"
            >
              Go to Feed
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle size={40} className="text-red-600" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Verification failed</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">{message}</p>
            <Link to="/" className="text-blue-500 font-semibold hover:underline">Back to login</Link>
          </>
        )}
      </motion.div>
    </div>
  );
}
