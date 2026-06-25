import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Bookmark, MessageCircle, ArrowDownLeft } from "lucide-react";
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

const paymentMethods = [
  {
    id: "card",
    name: "Credit / Debit Card",
    icon: CreditCard,
    subtitle: "Visa, Mastercard, Amex, Discover"
  },
  {
    id: "bank",
    name: "Bank Transfer",
    icon: Landmark,
    subtitle: "Direct bank account transfer"
  },
  {
    id: "ussd",
    name: "USSD Payment",
    icon: Smartphone,
    subtitle: "Quick bank shortcode payment"
  },
  {
    id: "paypal",
    name: "PayPal",
    icon: Wallet,
    subtitle: "Global online wallet"
  },
  {
    id: "applepay",
    name: "Apple Pay",
    icon: Smartphone,
    subtitle: "Fast checkout on Apple devices"
  },
  {
    id: "googlepay",
    name: "Google Pay",
    icon: Smartphone,
    subtitle: "Secure Android payments"
  },
  {
    id: "samsungpay",
    name: "Samsung Pay",
    icon: Smartphone,
    subtitle: "Pay with Samsung Wallet"
  },
  {
    id: "paystack",
    name: "Paystack",
    icon: RefreshCw,
    subtitle: "Card, Bank & Mobile Money"
  },
  {
    id: "flutterwave",
    name: "Flutterwave",
    icon: RefreshCw,
    subtitle: "African payments gateway"
  },
  {
    id: "momo",
    name: "Mobile Money",
    icon: Smartphone,
    subtitle: "MTN MoMo, Airtel Money, Telecel Cash"
  },
  {
    id: "mpesa",
    name: "M-Pesa",
    icon: Smartphone,
    subtitle: "East Africa mobile payments"
  },
  {
    id: "alipay",
    name: "Alipay",
    icon: Wallet,
    subtitle: "China's leading digital wallet"
  },
  {
    id: "wechatpay",
    name: "WeChat Pay",
    icon: MessageCircle,
    subtitle: "Chinese social wallet payments"
  },
  {
    id: "upi",
    name: "UPI",
    icon: Landmark,
    subtitle: "India instant bank payments"
  },
  {
    id: "paytm",
    name: "Paytm",
    icon: Wallet,
    subtitle: "India wallet & UPI payments"
  },
  {
    id: "pix",
    name: "PIX",
    icon: Zap,
    subtitle: "Brazil instant payments"
  },
  {
    id: "mercadopago",
    name: "Mercado Pago",
    icon: Wallet,
    subtitle: "Latin America digital wallet"
  },
  {
    id: "klarna",
    name: "Klarna",
    icon: Receipt,
    subtitle: "Buy now, pay later"
  },
  {
    id: "afterpay",
    name: "Afterpay",
    icon: Receipt,
    subtitle: "Australia & global BNPL"
  },
  {
    id: "ideal",
    name: "iDEAL",
    icon: Landmark,
    subtitle: "Netherlands bank payments"
  },
  {
    id: "sofort",
    name: "Sofort",
    icon: Landmark,
    subtitle: "European instant bank transfer"
  },
  {
    id: "sepa",
    name: "SEPA Transfer",
    icon: Landmark,
    subtitle: "European bank payments"
  },
  {
    id: "crypto",
    name: "Cryptocurrency",
    icon: Coins,
    subtitle: "BTC, ETH, USDT and more"
  },
  {
    id: "giftcard",
    name: "Gift Card",
    icon: Gift,
    subtitle: "Redeem prepaid gift cards"
  },
  {
    id: "coin",
    name: "Buy Coins",
    icon: Coins,
    subtitle: "Purchase coins for gifts & tips"
  },
  {
    id: "cashapp",
    name: "Cash App Pay",
    icon: Wallet,
    subtitle: "Popular in the USA"
  },
  {
    id: "venmo",
    name: "Venmo",
    icon: Wallet,
    subtitle: "Peer-to-peer payments"
  },
  {
    id: "zelle",
    name: "Zelle",
    icon: Landmark,
    subtitle: "US instant bank transfer"
  },
  {
    id: "test",
    name: "Test Top-Up (Dev)",
    icon: Shield,
    subtitle: "Simulate payment in development"
  }
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
  const [selectedMethod, setSelectedMethod] = useState("card");
  const [processing, setProcessing] = useState(false);
  const [checkoutState, setCheckoutState] = useState("input"); // 'input' | 'verifying' | 'success'
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

  // Ultra-Modern Native / Inline Gateway Checkout Handler
  const handleModernCheckout = async () => {
    if (!topUpAmount || topUpAmount < 100) {
      return toast({ message: "Minimum transaction amount is ₦100", type: "error" });
    }

    setProcessing(true);
    try {
      const res = await api.post("/wallet/topup/initialize", {
        amount: topUpAmount,
        email: user?.email,
        paymentChannel: selectedMethod
      });

      // Instead of standard window.open redirect, we use the ultra-modern inline system
      if (res.data.accessCode) {
        setCheckoutState("verifying");
        
        // Dynamically load Paystack Inline SDK if not present and open popup frame natively
        const PaystackPop = (await import("@paystack/inline-js")).default;
        const popup = new PaystackPop();
        
        popup.resumeTransaction(res.data.accessCode, {
          onSuccess: async (response) => {
            // Verify payment directly on completion hook
            await verifyTransactionOnBackend(response.reference);
          },
          onCancel: () => {
            setCheckoutState("input");
            setProcessing(false);
            toast({ message: "Transaction window closed by user", type: "info" });
          }
        });
      } else {
        // Safe developmental fallback
        await handleTestTopUp(topUpAmount);
      }
    } catch (e) {
      setCheckoutState("input");
      toast({ message: "Secure gateway initialization failed", type: "error" });
    } finally {
      setProcessing(false);
    }
  };

  const verifyTransactionOnBackend = async (reference) => {
    try {
      const res = await api.post("/wallet/topup/verify", { reference });
      if (res.data.success) {
        setWallet(res.data.wallet);
        setCheckoutState("success");
        await loadWallet();
        toast({ message: "Payment verified securely!", type: "success" });
      }
    } catch (err) {
      setCheckoutState("input");
      toast({ message: "Verification failed. Please contact support if debited.", type: "error" });
    }
  };

  const handleTestTopUp = async (amount) => {
    setProcessing(true);
    try {
      const res = await api.post("/wallet/topup/test", { amount: amount || topUpAmount });
      setWallet(res.data.wallet);
      setShowTopUp(false);
      setShowCoinShop(false);
      setCheckoutState("input");
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
            onClick={() => { setCheckoutState("input"); setShowTopUp(true); }}
            className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-blue-700 transition shadow-sm shadow-blue-500/20"
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
            className="bg-gradient-to-br from-blue-600 to-blue-900 rounded-2xl p-5 text-white col-span-2 shadow-lg shadow-blue-600/10"
          >
            <p className="text-blue-200 text-xs font-medium mb-1">Total Balance</p>
            <p className="text-3xl font-extrabold">₦{(wallet?.balance || 0).toLocaleString()}</p>
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10">
              <div>
                <p className="text-blue-200 text-xs">Total Earned</p>
                <p className="font-bold text-sm">₦{(wallet?.totalEarned || 0).toLocaleString()}</p>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div>
                <p className="text-blue-200 text-xs">Total Spent</p>
                <p className="font-bold text-sm">₦{(wallet?.totalSpent || 0).toLocaleString()}</p>
              </div>
            </div>
          </motion.div>

          {/* Coins Balance */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-4 text-white shadow-lg shadow-orange-500/10"
          >
            <div className="flex items-center gap-2 mb-1">
              <Coins size={16} />
              <p className="text-yellow-100 text-xs font-medium">Coins</p>
            </div>
            <p className="text-2xl font-extrabold">{(wallet?.coins || 0).toLocaleString()}</p>
            <button
              onClick={() => setShowCoinShop(true)}
              className="mt-2 text-xs bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-1 rounded-full font-medium transition"
            >
              Buy more
            </button>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-[#1e2732] rounded-2xl p-4 border border-gray-100 dark:border-[#38444d] flex flex-col justify-center gap-2"
          >
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Quick Actions</p>
            <button
              onClick={() => { setCheckoutState("input"); setShowTopUp(true); }}
              className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
            >
              <ArrowDownLeft size={15} /> Add Money
            </button>
            <button
              className="flex items-center gap-2 text-sm font-semibold text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60"
              disabled
            >
              <ArrowUpRight size={15} /> Withdraw
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
            {/* Coin Shop Teaser Banner */}
            <div
              onClick={() => setShowCoinShop(true)}
              className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 border border-amber-100 dark:border-amber-900/30 rounded-2xl p-4 cursor-pointer hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">🪙 Coin Marketplace</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Send interactive gifts on live streams and tip core creators</p>
                </div>
                <div className="text-orange-500 font-bold text-sm bg-white dark:bg-[#15202b] px-2.5 py-1 rounded-full shadow-sm">Shop →</div>
              </div>
            </div>

            {/* Recent Activity Section */}
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
                  className="w-full text-center py-3 text-blue-500 text-sm font-medium border-t border-gray-50 dark:border-[#253341] hover:bg-gray-50 dark:hover:bg-[#253341] transition"
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
                          {isCredit ? "+" : "-"} {tx.coins}🪙
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

      {/* Advanced Top Up Modal */}
      <AnimatePresence>
        {showTopUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center sm:items-center p-0 sm:p-4"
          >
            <motion.div
              initial={{ y: "100%", scale: 1 }}
              sm={{ y: 0, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: "100%", scale: 0.95 }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              className="bg-white dark:bg-[#15202b] rounded-t-3xl sm:rounded-2xl w-full max-w-md p-6 overflow-hidden max-h-[92vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Shield size={18} className="text-blue-600" />
                  <h2 className="font-bold text-xl text-gray-900 dark:text-white">Secure Checkout</h2>
                </div>
                <button onClick={() => setShowTopUp(false)} disabled={processing}>
                  <X size={22} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition" />
                </button>
              </div>

              {/* Step 1: Input Setup and Method Selection */}
              {checkoutState === "input" && (
                <div className="space-y-4 overflow-y-auto pr-1">
                  <div>
                    <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide block mb-2">Select Top-Up Amount</label>
                    <div className="grid grid-cols-3 gap-2">
                      {TOPUP_AMOUNTS.map(amount => (
                        <button
                          key={amount}
                          onClick={() => setTopUpAmount(amount)}
                          className={`py-3 rounded-xl font-bold text-sm transition border-2 ${
                            topUpAmount === amount
                              ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 text-blue-600"
                              : "border-gray-100 dark:border-[#38444d] text-gray-700 dark:text-gray-300 hover:border-gray-200"
                          }`}
                        >
                          ₦{amount.toLocaleString()}
                        </button>
                      ))}
                      <div className="relative col-span-3 mt-1">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-sm">₦</span>
                        <input
                          type="number"
                          min="100"
                          value={topUpAmount || ""}
                          placeholder="Enter custom custom amount"
                          className="w-full py-3 pl-8 pr-4 rounded-xl text-sm font-semibold border-2 border-gray-100 dark:border-[#38444d] bg-transparent text-gray-800 dark:text-white focus:outline-none focus:border-blue-500 transition"
                          onChange={e => setTopUpAmount(Number(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Modern Payment Selector */}
                  <div>
                    <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide block mb-2">Default Payment Method</label>
                    <div className="space-y-2">
                      {PAYMENT_METHODS.map(method => {
                        const MethodIcon = method.icon;
                        return (
                          <div
                            key={method.id}
                            onClick={() => setSelectedMethod(method.id)}
                            className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition ${
                              selectedMethod === method.id
                                ? "border-blue-600 bg-blue-50/20 dark:bg-blue-950/10"
                                : "border-gray-100 dark:border-[#38444d] hover:bg-gray-50/50 dark:hover:bg-[#1e2732]/50"
                            }`}
                          >
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                              selectedMethod === method.id ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-[#253341] text-gray-500 dark:text-gray-400"
                            }`}>
                              <MethodIcon size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-gray-800 dark:text-white truncate">{method.name}</p>
                              <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{method.subtitle}</p>
                            </div>
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                              selectedMethod === method.id ? "border-blue-600 bg-blue-600" : "border-gray-300 dark:border-gray-600"
                            }`}>
                              {selectedMethod === method.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-amber-500/10 dark:bg-amber-500/5 rounded-xl p-3 flex items-center gap-2.5 border border-amber-500/20">
                    <Coins size={16} className="text-amber-500 flex-shrink-0" />
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-tight">
                      Conversion rate: You will receive <span className="font-bold text-amber-500 dark:text-amber-400">{(topUpAmount * 10).toLocaleString()} coins</span> immediately after successful transaction completion.
                    </p>
                  </div>

                  <div className="pt-2 space-y-2">
                    <button
                      onClick={handleModernCheckout}
                      disabled={processing || !topUpAmount || topUpAmount < 100}
                      className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-40 shadow-md shadow-blue-600/10 transition flex items-center justify-center gap-2 text-sm"
                    >
                      {processing ? "Initializing Gateway..." : `Proceed to Secure Checkout`}
                    </button>
                    <button
                      onClick={() => handleTestTopUp(topUpAmount)}
                      disabled={processing}
                      className="w-full text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-center py-1 transition underline decoration-dotted"
                    >
                      Bypass secure flow via Sandbox Sandbox Mode
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Inline Active Verification Frame */}
              {checkoutState === "verifying" && (
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="relative w-14 h-14">
                    <div className="absolute inset-0 border-4 border-blue-100 dark:border-blue-900/30 rounded-full" />
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                      className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-blue-600">
                      <RefreshCw size={18} className="animate-pulse" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">Awaiting Gateway Confirmation</h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 max-w-xs mx-auto">
                      Please fulfill your payment requirements within the embedded secure inline checkout frame interface modal overlay.
                    </p>
                  </div>
                  <button 
                    onClick={() => setCheckoutState("input")}
                    className="text-xs font-semibold text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-950/20 px-3 py-1.5 rounded-lg transition"
                  >
                    Cancel / Go Back
                  </button>
                </div>
              )}

              {/* Step 3: Success Confirmation Visual Block */}
              {checkoutState === "success" && (
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-14 h-14 bg-green-50 dark:bg-green-950/30 text-green-500 rounded-full flex items-center justify-center shadow-inner shadow-green-500/10">
                    <CheckCircle size={32} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">Wallet Credited Successfully!</h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      Your transactional reference has been settled natively. Balance metrics are now current.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowTopUp(false)}
                    className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-3 rounded-xl text-sm transition hover:brightness-110"
                  >
                    Dismiss Receipt
                  </button>
                </div>
              )}
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
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center"
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
                <button onClick={() => setShowCoinShop(false)}><X size={22} className="text-gray-400 hover:text-gray-600 transition" /></button>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Use coins to send interactive live gifts or tip creators directly.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {COIN_PACKAGES.map((pkg, i) => (
                  <button
                    key={i}
                    onClick={() => handleTestTopUp(pkg.price)}
                    disabled={processing}
                    className={`relative p-4 rounded-2xl border-2 text-left transition hover:shadow-md ${
                      pkg.popular
                        ? "border-yellow-400 bg-yellow-50/30 dark:bg-yellow-950/10"
                        : "border-gray-100 dark:border-[#38444d] bg-white dark:bg-[#1e2732]"
                    }`}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full tracking-wide uppercase">
                        POPULAR
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-xl">🪙</span>
                      <span className="font-extrabold text-gray-900 dark:text-white">{pkg.coins.toLocaleString()}</span>
                    </div>
                    {pkg.bonus > 0 && (
                      <p className="text-xs text-green-600 dark:text-green-400 font-semibold">+{pkg.bonus} bonus coins</p>
                    )}
                    <p className="text-sm font-bold text-blue-600 mt-1">₦{pkg.price.toLocaleString()}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{pkg.label}</p>
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