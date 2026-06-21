import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag, Search, Plus, Heart, Star,
  MapPin, Package, X, Camera, CheckCircle,
  Filter, SlidersHorizontal
} from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
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
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
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
    </div>
  );
}
