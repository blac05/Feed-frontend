import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X, CheckCircle } from "lucide-react";
import api from "../../api/axios";
import { useToast } from "../../context/ToastContext";

export default function SubscribeButton({ creatorId }) {
  const { toast } = useToast();
  const [tiers, setTiers] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    api.get(`/subscriptions/tiers/${creatorId}`)
      .then(res => setTiers(res.data.tiers || []))
      .catch(() => {});
    api.get(`/subscriptions/check/${creatorId}`)
      .then(res => setIsSubscribed(res.data.isSubscribed))
      .catch(() => {});
  }, [creatorId]);

  if (tiers.length === 0) return null;

  const handleSubscribe = async (tierName) => {
    setSubscribing(true);
    try {
      const res = await api.post("/subscriptions/subscribe", { creatorId, tierName });
      setIsSubscribed(true);
      setShowModal(false);
      toast({ message: res.data.message, type: "success" });
    } catch (e) {
      toast({ message: e.response?.data?.message || "Subscribe failed", type: "error" });
    } finally {
      setSubscribing(false);
    }
  };

  const handleCancel = async () => {
    try {
      await api.delete(`/subscriptions/cancel/${creatorId}`);
      setIsSubscribed(false);
      toast({ message: "Subscription cancelled", type: "success" });
    } catch (e) {
      toast({ message: "Failed to cancel", type: "error" });
    }
  };

  return (
    <>
      <button
        onClick={() => isSubscribed ? handleCancel() : setShowModal(true)}
        className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold transition ${
          isSubscribed
            ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-300 dark:border-yellow-700 hover:bg-red-50 hover:text-red-500"
            : "bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:brightness-110"
        }`}
      >
        <Star size={14} className={isSubscribed ? "fill-yellow-500 text-yellow-500" : "text-white"} />
        {isSubscribed ? "Subscribed" : "Subscribe"}
      </button>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-[#1e2732] rounded-2xl w-full max-w-sm p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 dark:text-white">Choose a Plan</h3>
                <button onClick={() => setShowModal(false)}><X size={18} className="text-gray-500" /></button>
              </div>
              <div className="space-y-3">
                {tiers.map((tier, i) => (
                  <button
                    key={i}
                    onClick={() => handleSubscribe(tier.name)}
                    disabled={subscribing}
                    className="w-full text-left border-2 border-gray-200 dark:border-[#38444d] hover:border-yellow-400 rounded-2xl p-4 transition"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-gray-900 dark:text-white">{tier.name}</span>
                      <span className="text-yellow-600 font-extrabold">₦{tier.price?.toLocaleString()}/mo</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{tier.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {(tier.perks || []).map((perk, j) => (
                        <span key={j} className="flex items-center gap-1 text-[10px] text-green-600 dark:text-green-400">
                          <CheckCircle size={9} /> {perk}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 text-center mt-3">Deducted from your wallet balance</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
