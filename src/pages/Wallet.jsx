import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet as WalletIcon, Plus, ArrowUpRight, ArrowDownLeft,
  Coins, TrendingUp, Gift, CreditCard, X, CheckCircle,
  Clock, AlertCircle
} from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const txIcons = {
  topup: { icon: ArrowDownLeft, color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" },
  tip: { icon: Gift, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
  gift: { icon: Gift, color: "text-pink-500", bg: "bg-pink-50 dark:bg-pink-900/20" },
  purchase: { icon: CreditCard, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
  withdrawal: { icon: ArrowUpRight, color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20" },
  earning: { icon: TrendingUp, color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" },
  refund: { icon: ArrowDownLeft, color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-900/20" },
};

const TOPUP_AMOUNTS = [500, 1000, 2000, 5000, 10000];

const COIN_PACKAGES = [
  { coins: 100, price: 100, label: "Starter", bonus: 0 },
  { coins: 500, price: 450, label: "Popular", bonus: 50, popular: true },
  { coins: 1200, price: 1000, label: "Value", bonus: 200 },
  { coins: 3000, price: 2000, label: "Pro", bonus: 1000 },
];

export default function Wallet() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTopUp, setShowTopUp] = useState(false);
  const [showCoinShop, setShowCoinShop] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState(1000);
  const [processing, setProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadWallet();
  }, []);

  const loadWallet = async () => {
    try {
      const res = await api.get("/wallet");
      setWallet(res.data.wallet);
      setTransactions(res.data.transactions || []);
    } catch (e) {
      toast({ message: "Failed to load wallet", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleTopUp = async () => {
    setProcessing(true);
    try {
      const res = await api.post("/wallet/topup", {
        amount: topUpAmount,
        email: user?.email,
      });

      if (res.data.authorization_url) {
        window.open(res.data.authorization_url, "_blank");
        setShowTopUp(false);
        toast({ message: "Complete payment in the opened tab", type: "info" });
      } else {
        // Fallback to test top-up
        await handleTestTopUp(topUpAmount);
      }
    } catch (e) {
      toast({ message: "Payment initialization failed", type: "error" });
    } finally {
      setProcessing(false);
    }
  };

  const handleTestTopUp = async (amount) => {
    setProcessing(true);
    try {
      const res = await api.post("/wallet/topup/test", { amount: amount || topUpAmount });
      setWallet(res.data.wallet);
      setShowTopUp(false);
      setShowCoinShop(false);
      await loadWallet();
      toast({ message: `₦${amount || topUpAmount} added to wallet! 🎉`, type: "success" });
    } catch (e) {
      toast({ message: "Top-up failed", type: "error" });
    } finally {
      setProcessing(false);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    });
  };

  if (loading) return (
    <div className="min-h-screen dark:bg-[#15202b] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen dark:bg-[#15202b]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/90 dark:bg-[#15202b]/90 backdrop-blur-md border-b border-gray-100 dark:border-[#38444d] px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WalletIcon size={20} className="text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Wallet</h1>
          </div>
          <button
            onClick={() => setShowTopUp(true)}
            className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-2 rounded-full text-sm font-bold hover:bg-blue-700 transition"
          >
            <Plus size={14} /> Top Up
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Balance Cards */}
        <div className="grid grid-cols-2 gap-3">
          {/* Cash Balance */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-4 text-white col-span-2"
          >
            <p className="text-blue-200 text-xs font-medium mb-1">Total Balance</p>
            <p className="text-3xl font-extrabold">₦{(wallet?.balance || 0).toLocaleString()}</p>
            <div className="flex items-center gap-4 mt-3">
              <div>
                <p className="text-blue-200 text-xs">Total Earned</p>
                <p className="font-bold text-sm">₦{(wallet?.totalEarned || 0).toLocaleString()}</p>
              </div>
              <div className="w-px h-8 bg-blue-400" />
              <div>
                <p className="text-blue-200 text-xs">Total Spent</p>
                <p className="font-bold text-sm">₦{(wallet?.totalSpent || 0).toLocaleString()}</p>
              </div>
            </div>
          </motion.div>

          {/* Coins */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-4 text-white"
          >
            <div className="flex items-center gap-2 mb-1">
              <Coins size={16} />
              <p className="text-yellow-100 text-xs font-medium">Coins</p>
            </div>
            <p className="text-2xl font-extrabold">{(wallet?.coins || 0).toLocaleString()}</p>
            <button
              onClick={() => setShowCoinShop(true)}
              className="mt-2 text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded-full transition"
            >
              Buy more
            </button>
          </motion.div>

          {/* Quick actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-[#1e2732] rounded-2xl p-4 border border-gray-100 dark:border-[#38444d] flex flex-col gap-2"
          >
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Quick Actions</p>
            <button
              onClick={() => setShowTopUp(true)}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition"
            >
              <ArrowDownLeft size={14} /> Add Money
            </button>
            <button
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition"
            >
              <ArrowUpRight size={14} /> Withdraw
            </button>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 dark:border-[#38444d]">
          {["overview", "transactions"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-semibold capitalize border-b-2 transition ${
                activeTab === tab
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-400 border-transparent"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="space-y-3">
            {/* Coin packages teaser */}
            <div
              onClick={() => setShowCoinShop(true)}
              className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-4 cursor-pointer hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">🪙 Buy Coins</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Send gifts on live streams, tip creators</p>
                </div>
                <div className="text-yellow-500 font-bold text-sm">Shop →</div>
              </div>
            </div>

            {/* Recent transactions preview */}
            <div className="bg-white dark:bg-[#1e2732] rounded-2xl border border-gray-100 dark:border-[#38444d] overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-[#38444d]">
                <p className="font-bold text-gray-900 dark:text-white text-sm">Recent Activity</p>
              </div>
              {transactions.slice(0, 5).length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <WalletIcon size={28} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No transactions yet</p>
                </div>
              ) : (
                transactions.slice(0, 5).map((tx, i) => {
                  const config = txIcons[tx.type] || txIcons.topup;
                  const Icon = config.icon;
                  const isCredit = ["topup", "earning", "refund"].includes(tx.type);
                  return (
                    <div key={tx._id || i} className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 dark:border-[#253341] last:border-0">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${config.bg}`}>
                        <Icon size={16} className={config.color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{tx.description}</p>
                        <p className="text-xs text-gray-400">{formatTime(tx.createdAt)}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        {tx.amount > 0 && (
                          <p className={`text-sm font-bold ${isCredit ? "text-green-600" : "text-red-500"}`}>
                            {isCredit ? "+" : "-"}₦{tx.amount}
                          </p>
                        )}
                        {tx.coins > 0 && (
                          <p className="text-xs text-yellow-500 font-medium">
                            {isCredit ? "+" : "-"}{tx.coins}🪙
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
              {transactions.length > 5 && (
                <button
                  onClick={() => setActiveTab("transactions")}
                  className="w-full text-center py-3 text-blue-500 text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#253341] transition"
                >
                  View all transactions
                </button>
              )}
            </div>
          </div>
        )}

        {activeTab === "transactions" && (
          <div className="bg-white dark:bg-[#1e2732] rounded-2xl border border-gray-100 dark:border-[#38444d] overflow-hidden">
            {transactions.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <Clock size={32} className="mx-auto mb-3 opacity-30" />
                <p className="font-semibold">No transactions yet</p>
              </div>
            ) : (
              transactions.map((tx, i) => {
                const config = txIcons[tx.type] || txIcons.topup;
                const Icon = config.icon;
                const isCredit = ["topup", "earning", "refund"].includes(tx.type);
                return (
                  <motion.div
                    key={tx._id || i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="flex items-center gap-3 px-4 py-4 border-b border-gray-50 dark:border-[#253341] last:border-0 hover:bg-gray-50 dark:hover:bg-[#253341] transition"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${config.bg}`}>
                      <Icon size={18} className={config.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{tx.description}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{formatTime(tx.createdAt)}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        {tx.status === "completed" && <CheckCircle size={10} className="text-green-500" />}
                        {tx.status === "pending" && <Clock size={10} className="text-yellow-500" />}
                        {tx.status === "failed" && <AlertCircle size={10} className="text-red-500" />}
                        <span className={`text-xs capitalize ${
                          tx.status === "completed" ? "text-green-500" :
                          tx.status === "pending" ? "text-yellow-500" : "text-red-500"
                        }`}>{tx.status}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {tx.amount > 0 && (
                        <p className={`font-bold ${isCredit ? "text-green-600" : "text-red-500"}`}>
                          {isCredit ? "+" : "-"}₦{tx.amount.toLocaleString()}
                        </p>
                      )}
                      {tx.coins > 0 && (
                        <p className="text-sm text-yellow-500 font-medium">
                          {isCredit ? "+" : "-"}{tx.coins}🪙
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Top Up Modal */}
      <AnimatePresence>
        {showTopUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white dark:bg-[#15202b] rounded-t-3xl w-full max-w-lg p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-xl text-gray-900 dark:text-white">Add Money</h2>
                <button onClick={() => setShowTopUp(false)}><X size={22} className="text-gray-500" /></button>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Select amount to add to your wallet</p>

              <div className="grid grid-cols-3 gap-3 mb-4">
                {TOPUP_AMOUNTS.map(amount => (
                  <button
                    key={amount}
                    onClick={() => setTopUpAmount(amount)}
                    className={`py-3 rounded-2xl font-bold text-sm transition border-2 ${
                      topUpAmount === amount
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                        : "border-gray-200 dark:border-[#38444d] text-gray-700 dark:text-gray-300 hover:border-blue-300"
                    }`}
                  >
                    ₦{amount.toLocaleString()}
                  </button>
                ))}
                <div className="relative">
                  <input
                    type="number"
                    min="100"
                    placeholder="Custom"
                    className="w-full py-3 px-3 rounded-2xl text-sm border-2 border-gray-200 dark:border-[#38444d] bg-transparent text-gray-700 dark:text-gray-300 focus:outline-none focus:border-blue-400"
                    onChange={e => setTopUpAmount(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-3 mb-4 flex items-center gap-2">
                <Coins size={16} className="text-yellow-500" />
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  You'll get <span className="font-bold text-yellow-500">{(topUpAmount * 10).toLocaleString()} coins</span> with this top-up
                </p>
              </div>

              <button
                onClick={handleTopUp}
                disabled={processing || !topUpAmount || topUpAmount < 100}
                className="w-full bg-gradient-to-r from-sky-500 to-blue-700 text-white py-3.5 rounded-2xl font-bold disabled:opacity-40 hover:brightness-110 transition mb-3"
              >
                {processing ? "Processing..." : `Pay ₦${topUpAmount?.toLocaleString() || 0} with Paystack`}
              </button>

              <button
                onClick={() => handleTestTopUp(topUpAmount)}
                disabled={processing}
                className="w-full border-2 border-gray-200 dark:border-[#38444d] text-gray-600 dark:text-gray-400 py-3 rounded-2xl font-medium text-sm hover:bg-gray-50 dark:hover:bg-[#1e2732] transition"
              >
                🧪 Test Top-Up (Dev Mode)
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Coin Shop Modal */}
      <AnimatePresence>
        {showCoinShop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white dark:bg-[#15202b] rounded-t-3xl w-full max-w-lg p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Coins size={22} className="text-yellow-500" />
                  <h2 className="font-bold text-xl text-gray-900 dark:text-white">Coin Shop</h2>
                </div>
                <button onClick={() => setShowCoinShop(false)}><X size={22} className="text-gray-500" /></button>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Use coins to send gifts on live streams and tip creators
              </p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {COIN_PACKAGES.map((pkg, i) => (
                  <button
                    key={i}
                    onClick={() => handleTestTopUp(pkg.price)}
                    disabled={processing}
                    className={`relative p-4 rounded-2xl border-2 text-left transition hover:shadow-md ${
                      pkg.popular
                        ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20"
                        : "border-gray-200 dark:border-[#38444d] bg-white dark:bg-[#1e2732]"
                    }`}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-yellow-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        POPULAR
                      </div>
                    )}
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-xl">🪙</span>
                      <span className="font-extrabold text-gray-900 dark:text-white">{pkg.coins.toLocaleString()}</span>
                    </div>
                    {pkg.bonus > 0 && (
                      <p className="text-xs text-green-600 font-medium">+{pkg.bonus} bonus coins</p>
                    )}
                    <p className="text-sm font-bold text-blue-600 mt-1">₦{pkg.price.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">{pkg.label}</p>
                  </button>
                ))}
              </div>

              <p className="text-xs text-gray-400 text-center">
                Current balance: 🪙 {(wallet?.coins || 0).toLocaleString()} coins
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
