import { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

const ToastContext = createContext({});

const icons = {
  success: { icon: CheckCircle, color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800" },
  error: { icon: XCircle, color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800" },
  warning: { icon: AlertCircle, color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800" },
  info: { icon: Info, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800" },
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ message, type = "success", duration = 3000 }) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const remove = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full px-4">
        <AnimatePresence>
          {toasts.map(t => {
            const config = icons[t.type] || icons.info;
            const IconComponent = config.icon;
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 60, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 60, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-lg bg-white dark:bg-[#1e2732] ${config.bg}`}
              >
                <IconComponent size={18} className={`flex-shrink-0 ${config.color}`} />
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 flex-1">{t.message}</p>
                <button onClick={() => remove(t.id)} className="text-gray-400 hover:text-gray-600 transition flex-shrink-0">
                  <X size={14} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);