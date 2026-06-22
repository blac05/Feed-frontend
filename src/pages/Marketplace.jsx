<<<<<<< HEAD
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, MessageSquare, Tag, SlidersHorizontal, 
  Sparkles, ShieldCheck, ArrowRight, X, Heart, 
  Eye, CheckCircle2, DollarSign, Send 
=======
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag, Search, Plus, Heart, Star,
  MapPin, Package, X, Camera, CheckCircle,
  Filter, SlidersHorizontal
>>>>>>> 8fabf2e957bd4421a4387409ced864dd129a023f
} from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
<<<<<<< HEAD

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
=======
import { useNavigate } from "react-router-dom";
import useUpload from "../hooks/useUpload";

const CATEGORIES = ["All", "Electronics", "Clothing", "Accessories", "Home", "Books", "Sports", "Beauty", "Gaming", "Art", "Music", "Food", "Services", "Digital", "Other"];

const CONDITIONS = [
  { value: "new", label: "New" },
  { value: "like_new", label: "Like New" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
];

const badgeColor = {
  personal: "text-blue-500",
  creator: "text-purple-500",
  company: "text-blue-700",
  prominent: "text-yellow-500",
  popstar: "text-pink-500",
};

function CreateListingModal({ onClose, onCreate }) {
  const { toast } = useToast();
  const { uploadImage, uploading } = useUpload();
  const [form, setForm] = useState({
    title: "", description: "", price: "", category: "Other",
    condition: "new", location: "", stock: 1,
  });
  const [images, setImages] = useState([]);
  const [creating, setCreating] = useState(false);
  const fileRef = useRef();

  const handleImages = async (e) => {
    const files = Array.from(e.target.files).slice(0, 4 - images.length);
    for (const file of files) {
      const url = await uploadImage(file);
      if (url) setImages(prev => [...prev, url]);
    }
  };

  const submit = async () => {
    if (!form.title.trim() || !form.price) {
      toast({ message: "Title and price are required", type: "error" });
      return;
    }
    setCreating(true);
    try {
      const res = await api.post("/products", { ...form, price: Number(form.price), images });
      onCreate(res.data.product);
      toast({ message: "Listing created!", type: "success" });
      onClose();
    } catch (e) {
      toast({ message: "Failed to create listing", type: "error" });
    } finally {
      setCreating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white dark:bg-[#15202b] rounded-2xl w-full max-w-md overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-[#38444d]">
          <h2 className="font-bold text-lg text-gray-900 dark:text-white">Create Listing</h2>
          <button onClick={onClose}><X size={20} className="text-gray-500" /></button>
        </div>

        <div className="overflow-y-auto p-5 space-y-4 flex-1">
          {/* Image upload */}
          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 block">
              Photos ({images.length}/4)
            </label>
            <div className="flex gap-2 flex-wrap">
              {images.map((img, i) => (
                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden">
                  <img src={img} className="w-full h-full object-cover" alt="product" />
                  <button
                    onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                  >×</button>
                </div>
              ))}
              {images.length < 4 && (
                <button
                  onClick={() => fileRef.current.click()}
                  disabled={uploading}
                  className="w-20 h-20 border-2 border-dashed border-gray-300 dark:border-[#38444d] rounded-xl flex flex-col items-center justify-center hover:border-blue-400 transition"
                >
                  {uploading ? (
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Camera size={18} className="text-gray-400" />
                  )}
                </button>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImages} />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 block">Title *</label>
            <input
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="What are you selling?"
              className="w-full border border-gray-200 dark:border-[#38444d] bg-gray-50 dark:bg-[#1e2732] text-gray-800 dark:text-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 block">Price (₦) *</label>
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })}
                placeholder="0"
                className="w-full border border-gray-200 dark:border-[#38444d] bg-gray-50 dark:bg-[#1e2732] text-gray-800 dark:text-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 block">Stock</label>
              <input
                type="number"
                min="1"
                value={form.stock}
                onChange={e => setForm({ ...form, stock: Number(e.target.value) })}
                className="w-full border border-gray-200 dark:border-[#38444d] bg-gray-50 dark:bg-[#1e2732] text-gray-800 dark:text-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 block">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Describe your item..."
              rows={3}
              className="w-full border border-gray-200 dark:border-[#38444d] bg-gray-50 dark:bg-[#1e2732] text-gray-800 dark:text-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 block">Category</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full border border-gray-200 dark:border-[#38444d] bg-gray-50 dark:bg-[#1e2732] text-gray-800 dark:text-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {CATEGORIES.slice(1).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 block">Condition</label>
              <select
                value={form.condition}
                onChange={e => setForm({ ...form, condition: e.target.value })}
                className="w-full border border-gray-200 dark:border-[#38444d] bg-gray-50 dark:bg-[#1e2732] text-gray-800 dark:text-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {CONDITIONS.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 block">Location</label>
            <input
              value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })}
              placeholder="Lagos, Nigeria"
              className="w-full border border-gray-200 dark:border-[#38444d] bg-gray-50 dark:bg-[#1e2732] text-gray-800 dark:text-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        <div className="px-5 py-4 border-t border-gray-100 dark:border-[#38444d]">
          <button
            onClick={submit}
            disabled={creating || uploading || !form.title.trim() || !form.price}
            className="w-full bg-gradient-to-r from-sky-500 to-blue-700 text-white py-3 rounded-2xl font-bold disabled:opacity-40 hover:brightness-110 transition"
          >
            {creating ? "Creating..." : "List Item"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProductCard({ product, onLike, currentUserId }) {
  const navigate = useNavigate();
  const isLiked = product.likes?.includes(currentUserId);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-[#1e2732] rounded-2xl border border-gray-100 dark:border-[#38444d] overflow-hidden hover:shadow-md transition cursor-pointer"
      onClick={() => navigate(`/product/${product._id}`)}
    >
      {/* Image */}
      <div className="relative aspect-square bg-gray-100 dark:bg-gray-700">
        {product.images?.[0] ? (
          <img src={product.images[0]} className="w-full h-full object-cover" alt={product.title} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={32} className="text-gray-300" />
          </div>
        )}
        <button
          onClick={e => { e.stopPropagation(); onLike(product._id); }}
          className={`absolute top-2 right-2 p-1.5 rounded-full bg-white/80 dark:bg-black/50 transition hover:scale-110 ${
            isLiked ? "text-red-500" : "text-gray-500"
          }`}
        >
          <Heart size={14} className={isLiked ? "fill-red-500" : ""} />
        </button>
        {product.condition !== "new" && (
          <div className="absolute top-2 left-2 bg-yellow-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full capitalize">
            {product.condition.replace("_", " ")}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{product.title}</p>
        <p className="text-blue-600 font-extrabold text-base mt-0.5">
          {product.price === 0 ? "Free" : `₦${product.price.toLocaleString()}`}
        </p>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1">
            <img
              src={product.seller?.avatar || `https://ui-avatars.com/api/?name=${product.seller?.username}&background=2563eb&color=fff`}
              className="w-4 h-4 rounded-full object-cover"
              alt="seller"
            />
            <span className="text-xs text-gray-400 truncate max-w-[80px]">{product.seller?.username}</span>
            {product.seller?.isVerified && (
              <CheckCircle size={10} className={badgeColor[product.seller?.accountType] || "text-blue-500"} />
            )}
          </div>
          {product.location && (
            <span className="flex items-center gap-0.5 text-xs text-gray-400">
              <MapPin size={10} /> {product.location}
            </span>
          )}
        </div>

        {product.sold > 0 && (
          <p className="text-xs text-gray-400 mt-1">{product.sold} sold</p>
        )}
      </div>
    </motion.div>
  );
}

export default function Marketplace() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sort, setSort] = useState("newest");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    loadProducts();
  }, [activeCategory, debouncedSearch, sort]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeCategory !== "All") params.set("category", activeCategory);
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (sort === "price_asc") params.set("sort", "price_asc");
      if (sort === "price_desc") params.set("sort", "price_desc");
      if (sort === "popular") params.set("sort", "popular");
      const res = await api.get(`/products?${params.toString()}`);
      setProducts(res.data.products || []);
    } catch (e) {
      toast({ message: "Failed to load products", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (productId) => {
    try {
      await api.put(`/products/${productId}/like`);
      setProducts(prev => prev.map(p =>
        p._id === productId
          ? { ...p, likes: p.likes?.includes(user._id) ? p.likes.filter(id => id !== user._id) : [...(p.likes || []), user._id] }
          : p
      ));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen dark:bg-[#15202b]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/90 dark:bg-[#15202b]/90 backdrop-blur-md border-b border-gray-100 dark:border-[#38444d] px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Marketplace</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-full transition ${showFilters ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-[#1e2732]"}`}
            >
              <SlidersHorizontal size={18} />
            </button>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-2 rounded-full text-sm font-bold hover:bg-blue-700 transition"
            >
              <Plus size={14} /> Sell
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={15} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2 bg-gray-100 dark:bg-[#1e2732] text-gray-800 dark:text-gray-200 placeholder-gray-400 rounded-2xl text-sm focus:outline-none"
          />
        </div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 pb-1"
            >
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Sort by</p>
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {[
                  { value: "newest", label: "Newest" },
                  { value: "price_asc", label: "Price ↑" },
                  { value: "price_desc", label: "Price ↓" },
                  { value: "popular", label: "Popular" },
                ].map(s => (
                  <button
                    key={s.value}
                    onClick={() => setSort(s.value)}
                    className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full transition ${
                      sort === s.value
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-[#1e2732] text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide mt-3 pb-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition ${
                activeCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-[#1e2732] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#253341]"
>>>>>>> 8fabf2e957bd4421a4387409ced864dd129a023f
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
<<<<<<< HEAD

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

=======
      </div>

      {/* Products Grid */}
      <div className="p-4">
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-2xl aspect-square animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <ShoppingBag size={48} className="mx-auto mb-4 opacity-30" />
            <p className="font-bold text-gray-600 dark:text-gray-400 text-lg">
              {search ? `No results for "${search}"` : "No products yet"}
            </p>
            <p className="text-sm mt-1">Be the first to list something!</p>
            <button
              onClick={() => setShowCreate(true)}
              className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700 transition"
            >
              List an Item
            </button>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-400 mb-3">{products.length} items found</p>
            <div className="grid grid-cols-2 gap-3">
              {products.map((product, i) => (
                <ProductCard
                  key={product._id || i}
                  product={product}
                  onLike={handleLike}
                  currentUserId={user?._id}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Create Listing Modal */}
      <AnimatePresence>
        {showCreate && (
          <CreateListingModal
            onClose={() => setShowCreate(false)}
            onCreate={(p) => setProducts(prev => [p, ...prev])}
          />
        )}
      </AnimatePresence>
>>>>>>> 8fabf2e957bd4421a4387409ced864dd129a023f
    </div>
  );
}
