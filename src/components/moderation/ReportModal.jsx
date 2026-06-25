import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flag, X, AlertTriangle, CheckCircle, Loader } from "lucide-react";
import api from "../../api/axios";
import { useToast } from "../../context/ToastContext";

const REPORT_TYPES = [
  { value: "spam", label: "Spam", emoji: "🚫" },
  { value: "harassment", label: "Harassment", emoji: "😡" },
  { value: "hate_speech", label: "Hate Speech", emoji: "⚠️" },
  { value: "misinformation", label: "Misinformation", emoji: "❌" },
  { value: "nudity", label: "Nudity / Sexual", emoji: "🔞" },
  { value: "violence", label: "Violence", emoji: "⚡" },
  { value: "other", label: "Other", emoji: "📋" },
];

export default function ReportModal({ post, onClose }) {
  const { toast } = useToast();
  const [type, setType] = useState("");
  const [reason, setReason] = useState("");
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const analyzeWithAI = async () => {
    if (!type || !post?.content) return;
    setAiAnalyzing(true);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 300,
          messages: [{
            role: "user",
            content: `Analyze this social media post for content violations.

Post content: "${post.content}"
Report type: ${type}

Respond ONLY with a JSON object (no markdown):
{
  "score": <number 0-10, where 10 is most severe>,
  "summary": "<1 sentence assessment>",
  "action": "<one of: 'no_action', 'review', 'remove'>"
}`,
          }],
        }),
      });
      const data = await response.json();
      const text = data.content?.[0]?.text || "{}";
      try {
        const result = JSON.parse(text.replace(/```json|```/g, "").trim());
        setAiResult(result);
      } catch {
        setAiResult({ score: 5, summary: "Manual review recommended", action: "review" });
      }
    } catch (e) {
      setAiResult({ score: 5, summary: "Analysis unavailable", action: "review" });
    } finally {
      setAiAnalyzing(false);
    }
  };

  const handleSubmit = async () => {
    if (!type) { toast({ message: "Please select a report type", type: "error" }); return; }
    setSubmitting(true);
    try {
      await api.post("/reports", {
        postId: post._id,
        reportedUserId: post.author?._id,
        type,
        reason,
        aiScore: aiResult?.score || 0,
        aiSummary: aiResult?.summary || "",
      });
      setDone(true);
      toast({ message: "Report submitted. We'll review it shortly.", type: "success" });
      setTimeout(onClose, 2000);
    } catch (e) {
      toast({
        message: e.response?.data?.message || "Failed to submit report",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          onClick={e => e.stopPropagation()}
          className="bg-white dark:bg-[#1e2732] rounded-2xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-[#38444d]">
            <div className="flex items-center gap-2">
              <Flag size={18} className="text-red-500" />
              <h2 className="font-bold text-gray-900 dark:text-white">Report Post</h2>
            </div>
            <button onClick={onClose}><X size={20} className="text-gray-500" /></button>
          </div>

          {done ? (
            <div className="p-8 text-center">
              <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
              <p className="font-bold text-gray-900 dark:text-white">Report submitted</p>
              <p className="text-sm text-gray-400 mt-1">We'll review this content shortly</p>
            </div>
          ) : (
            <div className="p-5 space-y-4">
              {/* Post preview */}
              <div className="bg-gray-50 dark:bg-[#15202b] rounded-2xl p-3">
                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{post?.content}</p>
              </div>

              {/* Report type */}
              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 block uppercase tracking-wide">
                  What's wrong with this post?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {REPORT_TYPES.map(rt => (
                    <button
                      key={rt.value}
                      onClick={() => { setType(rt.value); setAiResult(null); }}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition text-left ${
                        type === rt.value
                          ? "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600"
                          : "border-gray-200 dark:border-[#38444d] text-gray-700 dark:text-gray-300 hover:border-gray-300"
                      }`}
                    >
                      <span>{rt.emoji}</span>
                      <span>{rt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional details */}
              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 block">
                  Additional details (optional)
                </label>
                <textarea
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder="Tell us more about the issue..."
                  rows={3}
                  className="w-full bg-gray-50 dark:bg-[#15202b] border border-gray-200 dark:border-[#38444d] text-gray-800 dark:text-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
                />
              </div>

              {/* AI Analysis */}
              {type && (
                <div>
                  {!aiResult && !aiAnalyzing && (
                    <button
                      onClick={analyzeWithAI}
                      className="w-full flex items-center justify-center gap-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 py-2.5 rounded-xl text-sm font-medium hover:bg-purple-100 transition"
                    >
                      ✨ Analyze with AI
                    </button>
                  )}

                  {aiAnalyzing && (
                    <div className="flex items-center justify-center gap-2 py-3 text-purple-500">
                      <Loader size={16} className="animate-spin" />
                      <span className="text-sm">Analyzing content...</span>
                    </div>
                  )}

                  {aiResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`rounded-2xl p-4 border ${
                        aiResult.score >= 7
                          ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                          : aiResult.score >= 4
                          ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
                          : "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">AI Assessment</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          aiResult.score >= 7 ? "bg-red-100 text-red-600" :
                          aiResult.score >= 4 ? "bg-yellow-100 text-yellow-600" :
                          "bg-green-100 text-green-600"
                        }`}>
                          Severity: {aiResult.score}/10
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{aiResult.summary}</p>
                      {aiResult.score >= 7 && (
                        <div className="flex items-center gap-1.5 mt-2">
                          <AlertTriangle size={13} className="text-red-500" />
                          <span className="text-xs text-red-500 font-medium">This content may violate our guidelines</span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              )}

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={submitting || !type}
                className="w-full bg-red-600 text-white py-3 rounded-2xl font-bold hover:bg-red-700 transition disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
