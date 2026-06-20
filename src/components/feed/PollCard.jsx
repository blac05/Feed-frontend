import { useState } from "react";
import { motion } from "framer-motion";
import api from "../../api/axios";
import { useToast } from "../../context/ToastContext";

export default function PollCard({ post, currentUserId, onUpdate }) {
  const { toast } = useToast();
  const [voting, setVoting] = useState(false);
  const poll = post.poll;
  if (!poll) return null;

  const totalVotes = poll.options.reduce((sum, opt) => sum + (opt.votes?.length || 0), 0);
  const userVotedIndex = poll.options.findIndex(opt =>
    opt.votes?.includes(currentUserId)
  );
  const hasVoted = userVotedIndex !== -1;
  const isExpired = new Date() > new Date(poll.endsAt);
  const showResults = hasVoted || isExpired;

  const timeLeft = () => {
    const diff = new Date(poll.endsAt) - new Date();
    if (diff <= 0) return "Poll ended";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 24) return `${Math.floor(hours / 24)}d left`;
    if (hours > 0) return `${hours}h ${mins}m left`;
    return `${mins}m left`;
  };

  const vote = async (index) => {
    if (hasVoted || isExpired || voting) return;
    setVoting(true);
    try {
      const res = await api.post(`/posts/${post._id}/vote`, { optionIndex: index });
      onUpdate(res.data.post);
      toast({ message: "Vote cast!", type: "success" });
    } catch (err) {
      toast({ message: "Failed to vote", type: "error" });
    } finally {
      setVoting(false);
    }
  };

  return (
    <div className="mt-3 space-y-2">
      {poll.options.map((opt, i) => {
        const pct = totalVotes > 0 ? Math.round((opt.votes?.length || 0) / totalVotes * 100) : 0;
        const isUserChoice = userVotedIndex === i;

        return (
          <button
            key={i}
            onClick={() => vote(i)}
            disabled={showResults || voting}
            className={`relative w-full text-left rounded-2xl border-2 px-4 py-3 overflow-hidden transition ${
              showResults
                ? isUserChoice
                  ? "border-blue-600 dark:border-blue-500"
                  : "border-gray-200 dark:border-[#38444d]"
                : "border-gray-200 dark:border-[#38444d] hover:border-blue-400 cursor-pointer"
            }`}
          >
            {/* Progress bar */}
            {showResults && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`absolute inset-y-0 left-0 ${isUserChoice ? "bg-blue-100 dark:bg-blue-900/30" : "bg-gray-100 dark:bg-gray-800/30"}`}
              />
            )}
            <div className="relative z-10 flex items-center justify-between">
              <span className={`text-sm font-medium ${isUserChoice ? "text-blue-600 dark:text-blue-400 font-bold" : "text-gray-800 dark:text-gray-200"}`}>
                {isUserChoice && "✓ "}{opt.text}
              </span>
              {showResults && (
                <span className={`text-sm font-bold ${isUserChoice ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}`}>
                  {pct}%
                </span>
              )}
            </div>
          </button>
        );
      })}
      <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 px-1">
        <span>{totalVotes} votes</span>
        <span>·</span>
        <span>{timeLeft()}</span>
      </div>
    </div>
  );
}
