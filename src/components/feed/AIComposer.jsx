import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, RefreshCw, Check, ChevronDown } from "lucide-react";

const TONES = [
  { label: "Casual", emoji: "😊" },
  { label: "Professional", emoji: "💼" },
  { label: "Funny", emoji: "😂" },
  { label: "Inspiring", emoji: "✨" },
  { label: "Informative", emoji: "📚" },
];

const TOPICS = [
  "Tech & AI", "Personal growth", "Business", "Food & lifestyle",
  "Fitness", "Travel", "Music & art", "Sports",
];

export default function AIComposer({ onInsert, onClose }) {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("Casual");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    if (!topic.trim()) { setError("Please enter a topic or idea"); return; }
    setLoading(true);
    setError("");
    setSuggestions([]);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `Generate 3 social media posts about: "${topic}"
Tone: ${tone}
Platform: Feed (like Twitter/Instagram hybrid)

Rules:
- Each post max 280 characters
- Make them engaging and authentic
- Include relevant hashtags naturally
- Vary the style between the 3 posts
- No numbering, no quotes around posts

Return ONLY a JSON array of 3 strings, nothing else. Example:
["post 1 text here", "post 2 text here", "post 3 text here"]`,
            },
          ],
        }),
      });

      const data = await response.json();
      const text = data.content?.[0]?.text || "";

      try {
        const clean = text.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(clean);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSuggestions(parsed.filter(s => typeof s === "string" && s.trim()));
        } else {
          setError("No suggestions generated. Try a different topic.");
        }
      } catch {
        // Try to extract strings if JSON parse fails
        const lines = text.split("\n").filter(l => l.trim().length > 20);
        setSuggestions(lines.slice(0, 3));
      }
    } catch (e) {
      setError("Failed to generate. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.97 }}
      className="fixed inset-x-4 bottom-20 md:inset-auto md:absolute md:bottom-full md:left-0 md:right-0 md:mb-2 z-40 bg-white dark:bg-[#1e2732] rounded-2xl shadow-2xl border border-gray-100 dark:border-[#38444d] overflow-hidden max-w-lg"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-[#38444d] bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-purple-600" />
          <span className="font-bold text-sm text-gray-900 dark:text-white">AI Post Suggestions</span>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
          <X size={18} />
        </button>
      </div>

      <div className="p-4 space-y-3">
        {/* Topic input */}
        <div>
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 block">
            What do you want to post about?
          </label>
          <input
            value={topic}
            onChange={e => setTopic(e.target.value)}
            onKeyDown={e => e.key === "Enter" && generate()}
            placeholder="e.g. lessons I learned this week, my morning routine..."
            className="w-full bg-gray-50 dark:bg-[#15202b] border border-gray-200 dark:border-[#38444d] text-gray-800 dark:text-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-400"
          />
        </div>

        {/* Quick topics */}
        <div className="flex gap-1.5 flex-wrap">
          {TOPICS.map(t => (
            <button
              key={t}
              onClick={() => setTopic(t)}
              className={`text-xs px-2.5 py-1 rounded-full transition ${
                topic === t
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 dark:bg-[#253341] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#2d3d4e]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tone selector */}
        <div>
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 block">Tone</label>
          <div className="flex gap-2 flex-wrap">
            {TONES.map(t => (
              <button
                key={t.label}
                onClick={() => setTone(t.label)}
                className={`text-xs px-3 py-1.5 rounded-xl border transition ${
                  tone === t.label
                    ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-600"
                    : "border-gray-200 dark:border-[#38444d] text-gray-600 dark:text-gray-400 hover:border-gray-300"
                }`}
              >
                {t.emoji} {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Generate button */}
        <button
          onClick={generate}
          disabled={loading || !topic.trim()}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2.5 rounded-xl font-bold text-sm hover:brightness-110 transition disabled:opacity-50"
        >
          {loading ? (
            <><RefreshCw size={15} className="animate-spin" /> Generating...</>
          ) : (
            <><Sparkles size={15} /> Generate Posts</>
          )}
        </button>

        {error && (
          <p className="text-red-500 text-xs text-center">{error}</p>
        )}

        {/* Suggestions */}
        <AnimatePresence>
          {suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-2 pt-1"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Choose one</p>
                <button
                  onClick={generate}
                  disabled={loading}
                  className="flex items-center gap-1 text-xs text-purple-500 hover:text-purple-700 font-medium transition"
                >
                  <RefreshCw size={11} /> Regenerate
                </button>
              </div>
              {suggestions.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="group relative bg-gray-50 dark:bg-[#15202b] border border-gray-200 dark:border-[#38444d] rounded-xl p-3 hover:border-purple-300 dark:hover:border-purple-700 transition cursor-pointer"
                  onClick={() => { onInsert(s); onClose(); }}
                >
                  <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed pr-8">{s}</p>
                  <p className="text-xs text-gray-400 mt-1">{s.length}/280 chars</p>
                  <div className="absolute top-2.5 right-2.5 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <Check size={12} className="text-white" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
