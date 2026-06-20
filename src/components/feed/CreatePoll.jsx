import { useState } from "react";
import { Plus, X, BarChart2 } from "lucide-react";
import { motion } from "framer-motion";

export default function CreatePoll({ onPollChange, onRemove }) {
  const [options, setOptions] = useState(["", ""]);
  const [duration, setDuration] = useState(24);

  const updateOption = (i, val) => {
    const updated = [...options];
    updated[i] = val;
    setOptions(updated);
    onPollChange({ options: updated.filter(Boolean), duration });
  };

  const addOption = () => {
    if (options.length < 4) {
      const updated = [...options, ""];
      setOptions(updated);
    }
  };

  const removeOption = (i) => {
    if (options.length <= 2) return;
    const updated = options.filter((_, idx) => idx !== i);
    setOptions(updated);
    onPollChange({ options: updated.filter(Boolean), duration });
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-3 border-2 border-blue-200 dark:border-blue-900 rounded-2xl p-4 space-y-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart2 size={16} className="text-blue-600" />
          <span className="font-bold text-sm text-gray-800 dark:text-white">Poll</span>
        </div>
        <button onClick={onRemove} className="text-gray-400 hover:text-red-500 transition">
          <X size={16} />
        </button>
      </div>

      {options.map((opt, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            value={opt}
            onChange={e => updateOption(i, e.target.value)}
            placeholder={`Option ${i + 1}`}
            maxLength={50}
            className="flex-1 border border-gray-200 dark:border-[#38444d] bg-gray-50 dark:bg-[#1e2732] text-gray-800 dark:text-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {options.length > 2 && (
            <button onClick={() => removeOption(i)} className="text-gray-400 hover:text-red-500 transition">
              <X size={14} />
            </button>
          )}
        </div>
      ))}

      {options.length < 4 && (
        <button
          onClick={addOption}
          className="flex items-center gap-2 text-blue-500 text-sm font-medium hover:text-blue-700 transition"
        >
          <Plus size={14} /> Add option
        </button>
      )}

      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 dark:text-gray-400">Duration:</span>
        {[1, 24, 72].map(h => (
          <button
            key={h}
            onClick={() => { setDuration(h); onPollChange({ options: options.filter(Boolean), duration: h }); }}
            className={`text-xs px-2.5 py-1 rounded-full transition ${
              duration === h
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-[#1e2732] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#253341]"
            }`}
          >
            {h === 1 ? "1h" : h === 24 ? "24h" : "3d"}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
