import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, MapPin, Package, CheckCircle, Share2, MessageCircle } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const badgeColor = {
  personal: "text-blue-500",
  creator: "text-purple-500",
  company: "text-blue-700",
  prominent: "text-yellow-500",
  popstar: "text-pink-500",
};

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(res => {
        setProduct(res.data.product);
        setLiked(res.data.product.likes?.includes(user?._id));
      })
      .catch(() => toast({ message: "Product not found", type: "error" }))
      .finally(() => setLoading(false));
  }, [id]);

  const handleLike = async () => {
    try {
      await api.put(`/products/${id}/like`);
      setLiked(prev => !prev);
      setProduct(prev => ({
        ...prev,
        likes: liked
          ? prev.likes.filter(l => l !== user?._id)
          : [...(prev.likes || []), user?._id],
      }));
    } catch (e) { console.error(e); }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ message: "Link copied!", type: "success" });
  };

  const handleContact = () => {
    navigate(`/messages`);
    toast({ message: "Go to messages to contact the seller", type: "info" });
  };

  if (loading) return (
    <div className="min-h-screen dark:bg-[#15202b] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen dark:bg-[#15202b] flex items-center justify-center">
      <div className="text-center text-gray-400">
        <p className="font-bold text-lg">Product not found</p>
        <button onClick={() => navigate(-1)} className="mt-3 text-blue-500 text-sm hover:underline">Go back</button>
      </div>
    </div>
  );

  const conditionLabel = { new: "New", like_new: "Like New", good: "Good", fair: "Fair" };

  return (
    <div className="min-h-screen dark:bg-[#15202b]">
      <div className="sticky top-0 z-10 bg-white/90 dark:bg-[#15202b]/90 backdrop-blur-md border-b border-gray-100 dark:border-[#38444d] px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-[#1e2732] transition">
          <ArrowLeft size={20} className="text-gray-700 dark:text-gray-300" />
        </button>
        <div className="flex items-center gap-2">
          <button onClick={handleLike} className={`p-2 rounded-full transition ${liked ? "text-red-500" : "text-gray-400 hover:text-red-500"}`}>
            <Heart size={20} className={liked ? "fill-red-500" : ""} />
          </button>
          <button onClick={handleShare} className="p-2 rounded-full text-gray-400 hover:text-blue-500 transition">
            <Share2 size={20} />
          </button>
        </div>
      </div>

      {/* Images */}
      <div className="bg-gray-100 dark:bg-gray-800">
        {product.images?.length > 0 ? (
          <div>
            <div className="aspect-square">
              <img src={product.images[activeImage]} className="w-full h-full object-cover" alt={product.title} />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition ${
                      activeImage === i ? "border-blue-600" : "border-transparent"
                    }`}
                  >
                    <img src={img} className="w-full h-full object-cover" alt={`${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="aspect-square flex items-center justify-center">
            <Package size={48} className="text-gray-300" />
          </div>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Title & Price */}
        <div>
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-xl font-extrabold text-gray-900 dark:text-white flex-1">{product.title}</h1>
            <span className="text-2xl font-extrabold text-blue-600 flex-shrink-0">
              {product.price === 0 ? "Free" : `₦${product.price.toLocaleString()}`}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs bg-gray-100 dark:bg-[#1e2732] text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">
              {product.category}
            </span>
            <span className="text-xs bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">
              {conditionLabel[product.condition] || "New"}
            </span>
            {product.stock <= 3 && product.stock > 0 && (
              <span className="text-xs bg-red-100 dark:bg-red-900/20 text-red-600 px-2 py-0.5 rounded-full">
                Only {product.stock} left!
              </span>
            )}
          </div>
        </div>

        {/* Seller */}
        <div
          onClick={() => navigate(`/profile/${product.seller?._id}`)}
          className="flex items-center gap-3 p-3 bg-white dark:bg-[#1e2732] rounded-2xl border border-gray-100 dark:border-[#38444d] cursor-pointer hover:bg-gray-50 dark:hover:bg-[#253341] transition"
        >
          <img
            src={product.seller?.avatar || `https://ui-avatars.com/api/?name=${product.seller?.username}&background=2563eb&color=fff`}
            className="w-11 h-11 rounded-full object-cover"
            alt="seller"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <p className="font-bold text-sm text-gray-900 dark:text-white">{product.seller?.name || product.seller?.username}</p>
              {product.seller?.isVerified && (
                <CheckCircle size={13} className={badgeColor[product.seller?.accountType] || "text-blue-500"} />
              )}
            </div>
            <p className="text-xs text-gray-400">@{product.seller?.username}</p>
          </div>
          <span className="text-xs text-blue-500 font-medium">View profile →</span>
        </div>

        {/* Location */}
        {product.location && (
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
            <MapPin size={14} />
            <span>{product.location}</span>
          </div>
        )}

        {/* Description */}
        {product.description && (
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Description</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{product.description}</p>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1"><Heart size={12} /> {product.likes?.length || 0} likes</span>
          <span>{product.sold || 0} sold</span>
        </div>

        {/* Actions */}
        {product.seller?._id !== user?._id && (
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleContact}
              className="flex-1 flex items-center justify-center gap-2 border-2 border-blue-600 text-blue-600 py-3 rounded-2xl font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
            >
              <MessageCircle size={18} /> Message Seller
            </button>
            <button
              onClick={() => toast({ message: "Purchase flow coming soon!", type: "info" })}
              className="flex-1 bg-gradient-to-r from-sky-500 to-blue-700 text-white py-3 rounded-2xl font-bold hover:brightness-110 transition"
            >
              {product.price === 0 ? "Get for Free" : "Buy Now"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}