import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, MessageSquare, Tag, SlidersHorizontal, 
  Sparkles, ShieldCheck, ArrowRight, X, Heart, 
  Eye, CheckCircle2, DollarSign, Send 
} from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const categories = ["All Items", "Aviation Parts", "Electronics", "Collectibles", "Wearables", "Services"];

export default function Marketplace() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [products, setProducts] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All Items");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Interactive Panel State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [interactionMode, setInteractionMode] = useState(null); // 'chat' or 'offer'
  const [offerAmount, setOfferAmount] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, [activeCategory]);

  const fetchProducts = async () => {
    setFetching(true);
    try {
      // Mock data matching the premium look, replace with your true api.get("/products") call
      const mockProducts = [
        {
          _id: "p1",
          title: "Garmin G3X Touch Flight Display",
          price: 4250,
          category: "Aviation Parts",
          condition: "New",
          views: 142,
          image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80",
          seller: { _id: "s1", username: "AeroParts_Global", rating: 4.9, isVerified: true }
        },
        {
          _id: "p2",
          title: "Vintage Titanium Compressor Blade",
          price: 890,
          category: "Collectibles",
          condition: "Refurbished",
          views: 310,
          image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
          seller: { _id: "s2", username: "SkySalvage", rating: 4.7, isVerified: false }
        },
        {
          _id: "p3",
          title: "MacBook Pro M3 Max - 64GB RAM",
          price: 3100,
          category: "Electronics",
          condition: "Like New",
          views: 89,
          image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
          seller: { _id: "s3", username: "TechVault", rating: 5.0, isVerified: true }
        }
      ];
      
      setProducts(mockProducts);
    } catch (err) {
      toast({ message: "Failed to load marketplace", type: "error" });
    } finally {
      setFetching(false);
    }
  };

  const handleOpenInteraction = (product, mode) => {
    setSelectedProduct(product);
    setInteractionMode(mode);
    setOfferAmount(product.price * 0.9); // Default suggestion to 10% off
    setChatHistory([
      { sender: "system", text: `Inquiry started for "${product.title}"` }
    ]);
  };

  const handleSendOffer = () => {
    if (!offerAmount || isNaN(offerAmount)) return;
    toast({ message: `Offer of $${offerAmount} submitted to @${selectedProduct.seller.username}`, type: "success" });
    setInteractionMode("chat");
    setChatHistory(prev => [
      ...prev, 
      { sender: "buyer", text: `📢 Submitted an offer for $${offerAmount}` }
    ]);
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    setChatHistory(prev => [...prev, { sender: "buyer", text: chatMessage }]);
    setChatMessage("");
    
    // Quick automated seller response simulation
    setTimeout(() => {
      setChatHistory(prev => [
        ...prev, 
        { sender: "seller", text: "Thanks for reaching out! I'll check this asset and respond shortly." }
      ]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#15202b] text-gray-900 dark:text-white transition-colors duration-300">
      
      {/* Cinematic Sticky Header */}
      <div className="sticky top-0 z-20 bg-white/80 dark:bg-[#15202b]/80 backdrop-blur-md border-b border-gray-100 dark:border-[#38444d] px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-blue-500" size={22} />
            <h1 className="text-xl font-black tracking-tight uppercase">Terminal Market</h1>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500">Secure B2B & P2P Asset Trading</p>
        </div>

        {/* Modern Search Field */}
        <div className="flex items-center gap-2 max-w-md w-full">
          <input
            type="text"
            placeholder="Search parts, gear, listings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-100 dark:bg-[#1e2732] border border-transparent focus:border-blue-500 rounded-xl px-4 py-2 text-sm outline-none transition"
          />
          <button className="bg-white dark:bg-[#1e2732] border border-gray-200 dark:border-[#38444d] p-2.5 rounded-xl text-gray-500 hover:text-blue-500 transition">
            <SlidersHorizontal size={16} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Horizontal Category Pill Bar */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition flex-shrink-0 tracking-wide ${
                activeCategory === cat
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                  : "bg-white dark:bg-[#1e2732] border border-gray-200 dark:border-[#38444d] text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Main Bento Product Grid */}
        {fetching ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-96 bg-white dark:bg-[#1e2732] rounded-3xl animate-pulse border border-gray-100 dark:border-[#38444d]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-[#1e2732] rounded-3xl border border-gray-100 dark:border-[#38444d] overflow-hidden group shadow-sm hover:shadow-xl dark:hover:border-gray-700/50 transition-all duration-300 flex flex-col h-full"
              >
                {/* Media Shell */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 dark:bg-[#15202b]">
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Status Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-lg">
                      {product.condition}
                    </span>
                  </div>

                  <button className="absolute top-3 right-3 bg-white/80 dark:bg-[#15202b]/80 backdrop-blur-md p-2 rounded-full text-gray-400 hover:text-red-500 transition shadow-sm">
                    <Heart size={15} />
                  </button>

                  {/* Realtime Interest Pulse */}
                  <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white px-2 py-1 rounded-md text-[10px] flex items-center gap-1.5 font-medium">
                    <Eye size={12} className="text-blue-400" />
                    <span>{product.views} active shoppers</span>
                  </div>
                </div>

                {/* Listing Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Seller Handle */}
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 hover:underline cursor-pointer">
                        @{product.seller.username}
                      </span>
                      {product.seller.isVerified && <ShieldCheck size={13} className="text-blue-500" />}
                      <span className="text-[10px] text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded font-bold">★ {product.seller.rating}</span>
                    </div>

                    <h3 className="font-bold text-base text-gray-900 dark:text-white line-clamp-1 group-hover:text-blue-500 transition">
                      {product.title}
                    </h3>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-baseline justify-between border-b border-gray-100 dark:border-[#38444d] pb-3 mb-3">
                      <span className="text-xs text-gray-400">Fixed Value</span>
                      <span className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
                        ${product.price.toLocaleString()}
                      </span>
                    </div>

                    {/* Direct Interaction Layer */}
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => handleOpenInteraction(product, "offer")}
                        className="flex items-center justify-center gap-1.5 bg-gray-100 dark:bg-[#253341] hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-800 dark:text-blue-400 rounded-xl py-2.5 text-xs font-bold transition"
                      >
                        <Tag size={13} />
                        Make Offer
                      </button>
                      <button 
                        onClick={() => handleOpenInteraction(product, "chat")}
                        className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2.5 text-xs font-bold transition shadow-md shadow-blue-500/10"
                      >
                        <MessageSquare size={13} />
                        Contact
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Slide-out Interactive Communication Panel */}
      <AnimatePresence>
        {selectedProduct && interactionMode && (
          <>
            {/* Backdrop Lock */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setSelectedProduct(null); setInteractionMode(null); }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />

            {/* Sliding Drawer Interface */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-[#1e2732] border-l border-gray-200 dark:border-[#38444d] z-50 shadow-2xl flex flex-col"
            >
              {/* Drawer Top Header */}
              <div className="p-4 border-b border-gray-100 dark:border-[#38444d] flex items-center justify-between bg-slate-50 dark:bg-[#15202b]">
                <div className="flex items-center gap-3">
                  <img src={selectedProduct.image} className="w-10 h-10 object-cover rounded-xl border border-gray-200 dark:border-gray-700" alt="" />
                  <div>
                    <h4 className="text-sm font-bold truncate max-w-[200px]">{selectedProduct.title}</h4>
                    <p className="text-xs text-gray-400">with @{selectedProduct.seller.username}</p>
                  </div>
                </div>
                <button 
                  onClick={() => { setSelectedProduct(null); setInteractionMode(null); }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-white p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-[#253341]"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Toggle Interface Modes */}
              <div className="flex border-b border-gray-100 dark:border-[#38444d]">
                <button 
                  onClick={() => setInteractionMode("offer")}
                  className={`flex-1 py-3 text-xs font-bold border-b-2 transition ${interactionMode === 'offer' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-400'}`}
                >
                  Negotiate Valuation
                </button>
                <button 
                  onClick={() => setInteractionMode("chat")}
                  className={`flex-1 py-3 text-xs font-bold border-b-2 transition ${interactionMode === 'chat' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-400'}`}
                >
                  Direct Dispatch Messenger
                </button>
              </div>

              {/* Dynamic Interactive Main-body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {interactionMode === "offer" ? (
                  <div className="space-y-4 pt-2">
                    <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-4 text-center">
                      <span className="text-xs text-gray-400 block mb-1">Target Price</span>
                      <h2 className="text-2xl font-black text-gray-900 dark:text-white">${selectedProduct.price.toLocaleString()}</h2>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Your Counter Offer ($)</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 font-bold">$</div>
                        <input
                          type="number"
                          value={offerAmount}
                          onChange={(e) => setOfferAmount(e.target.value)}
                          className="w-full bg-gray-50 dark:bg-[#15202b] border border-gray-200 dark:border-[#38444d] rounded-xl pl-8 pr-4 py-3 text-base font-bold outline-none focus:border-blue-500 transition"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => setOfferAmount(Math.round(selectedProduct.price * 0.95))}
                        className="bg-gray-100 dark:bg-[#253341] text-xs font-semibold px-3 py-1.5 rounded-lg text-gray-600 dark:text-gray-300"
                      >
                        -5%
                      </button>
                      <button 
                        onClick={() => setOfferAmount(Math.round(selectedProduct.price * 0.90))}
                        className="bg-gray-100 dark:bg-[#253341] text-xs font-semibold px-3 py-1.5 rounded-lg text-gray-600 dark:text-gray-300"
                      >
                        -10%
                      </button>
                      <button 
                        onClick={() => setOfferAmount(Math.round(selectedProduct.price * 0.85))}
                        className="bg-gray-100 dark:bg-[#253341] text-xs font-semibold px-3 py-1.5 rounded-lg text-gray-600 dark:text-gray-300"
                      >
                        -15%
                      </button>
                    </div>

                    <button 
                      onClick={handleSendOffer}
                      className="w-full bg-gradient-to-r from-blue-600 to-sky-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/20 text-sm hover:brightness-110 transition mt-4"
                    >
                      Transmit Binding Offer
                    </button>
                  </div>
                ) : (
                  /* Messenger Mode Engine */
                  <div className="flex flex-col h-full justify-between">
                    <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                      {chatHistory.map((msg, idx) => (
                        <div 
                          key={idx} 
                          className={`flex ${msg.sender === 'buyer' ? 'justify-end' : msg.sender === 'system' ? 'justify-center' : 'justify-start'}`}
                        >
                          <div className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs ${
                            msg.sender === 'buyer' 
                              ? 'bg-blue-600 text-white rounded-br-none' 
                              : msg.sender === 'system'
                              ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 text-[10px] uppercase font-bold tracking-wider'
                              : 'bg-gray-100 dark:bg-[#253341] text-gray-800 dark:text-gray-200 rounded-bl-none'
                          }`}>
                            {msg.text}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Chat Dispatch Input Footer */}
                    <div className="flex gap-2 border-t border-gray-100 dark:border-[#38444d] pt-3 bg-white dark:bg-[#1e2732]">
                      <input
                        type="text"
                        placeholder="Type standard message transmission..."
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        className="flex-1 bg-gray-50 dark:bg-[#15202b] border border-gray-200 dark:border-[#38444d] rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-blue-500 transition"
                      />
                      <button 
                        onClick={handleSendMessage}
                        className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 transition shadow-md shadow-blue-500/10"
                      >
                        <Send size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}