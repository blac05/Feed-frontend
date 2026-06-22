import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Construction } from "lucide-react";

export default function ComingSoon({ title = "Coming Soon", description = "This feature is under construction." }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen dark:bg-[#15202b] flex flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-sm"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Construction size={36} className="text-blue-600" />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">{title}</h1>
        <p className="text-gray-400 text-sm mb-8">{description}</p>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mx-auto text-blue-500 font-semibold hover:underline"
        >
          <ArrowLeft size={16} /> Go back
        </button>
      </motion.div>
    </div>
  );
}