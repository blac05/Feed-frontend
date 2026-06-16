import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.png";

export default function SplashScreen({ onDone }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white"
        >
          {/* Logo bounce in */}
          <motion.img
            src={logo}
            alt="Feed"
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            className="w-24 h-24 rounded-3xl shadow-lg mb-5"
          />

          {/* App name */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="text-4xl font-extrabold text-blue-900 tracking-wide"
          >
            Feed
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            className="text-blue-400 text-sm mt-2 tracking-widest uppercase"
          >
            Connect. Share. Discover.
          </motion.p>

          {/* Bottom loading bar like TikTok/Instagram */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-12 flex flex-col items-center gap-3"
          >
            <div className="w-40 h-1 bg-blue-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.6, delay: 1, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-sky-400 to-blue-700 rounded-full"
              />
            </div>
            <p className="text-xs text-blue-300">from Gibson Labs</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}