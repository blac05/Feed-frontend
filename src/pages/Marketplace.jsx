import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Search,
  Plus,
  Heart,
  MapPin,
  Package,
  X,
  Camera,
  CheckCircle,
  SlidersHorizontal,
} from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useNavigate } from "react-router-dom";
import useUpload from "../hooks/useUpload";

const CATEGORIES = [
  "All",
  "Electronics",
  "Clothing",
  "Accessories",
  "Home",
  "Books",
  "Sports",
  "Beauty",
  "Gaming",
  "Art",
  "Music",
  "Food",
  "Services",
  "Digital",
  "Other",
];

function CreateListingModal({ onClose, onCreate }) {
  const { toast } = useToast();
  const { uploadImage, uploading } = useUpload();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "Other",
    condition: "new",
    location: "",
    stock: 1,
  });

  const [images, setImages] = useState([]);
  const [creating, setCreating] = useState(false);
  const fileRef = useRef();

  const handleImages = async (e) => {
    const files = Array.from(e.target.files);

    for (const file of files) {
      const url = await uploadImage(file);

      if (url) {
        setImages((prev) => [...prev, url]);
      }
    }
  };

  const submit = async () => {
    try {
      setCreating(true);

      const res = await api.post("/products", {
        ...form,
        price: Number(form.price),
        images,
      });

      onCreate(res.data.product);

      toast({
        message: "Listing created successfully",
        type: "success",
      });

      onClose();
    } catch {
      toast({
        message: "Failed to create listing",
        type: "error",
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-[#15202b] rounded-2xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg">Create Listing</h2>

          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3">
          <input
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            placeholder="Title"
            className="w-full p-3 rounded-xl border"
          />

          <input
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: e.target.value })
            }
            placeholder="Price"
            type="number"
            className="w-full p-3 rounded-xl border"
          />

          <textarea
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
            placeholder="Description"
            className="w-full p-3 rounded-xl border"
          />

          <button
            onClick={() => fileRef.current.click()}
            className="border rounded-xl p-3 w-full"
          >
            <Camera size={18} />
          </button>

          <input
            ref={fileRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleImages}
          />

          <button
            disabled={creating || uploading}
            onClick={submit}
            className="w-full bg-blue-600 text-white py-3 rounded-xl"
          >
            {creating ? "Creating..." : "Create Listing"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, onLike, currentUserId }) {
  const navigate = useNavigate();

  const liked =
    product.likes?.includes(currentUserId);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-[#1e2732] rounded-2xl overflow-hidden border cursor-pointer"
      onClick={() => navigate(`/product/${product._id}`)}
    >
      <div className="aspect-square bg-gray-100">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Package />
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="font-semibold truncate">
          {product.title}
        </h3>

        <p className="text-blue-600 font-bold">
          ₦{Number(product.price).toLocaleString()}
        </p>

        <div className="flex justify-between mt-2">
          <span className="text-xs text-gray-500">
            {product.seller?.username}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onLike(product._id);
            }}
          >
            <Heart
              size={16}
              className={
                liked ? "fill-red-500 text-red-500" : ""
              }
            />
          </button>
        </div>

        {product.location && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
            <MapPin size={12} />
            {product.location}
          </div>
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
  const [category, setCategory] = useState("All");

  useEffect(() => {
    loadProducts();
  }, [category, search]);

  const loadProducts = async () => {
    try {
      setLoading(true);

      const res = await api.get("/products");

      setProducts(res.data.products || []);
    } catch {
      toast({
        message: "Failed to load products",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id) => {
    try {
      await api.put(`/products/${id}/like`);

      setProducts((prev) =>
        prev.map((p) =>
          p._id === id
            ? {
                ...p,
                likes: p.likes?.includes(user?._id)
                  ? p.likes.filter(
                      (x) => x !== user._id
                    )
                  : [...(p.likes || []), user._id],
              }
            : p
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = products.filter((p) => {
    const matchesCategory =
      category === "All" ||
      p.category === category;

    const matchesSearch =
      p.title
        ?.toLowerCase()
        .includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen dark:bg-[#15202b]">
      <div className="sticky top-0 bg-white dark:bg-[#15202b] p-4 border-b z-10">
        <div className="flex justify-between mb-3">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} />
            <h1 className="font-bold text-xl">
              Marketplace
            </h1>
          </div>

          <button
            onClick={() => setShowCreate(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-full flex gap-2 items-center"
          >
            <Plus size={16} />
            Sell
          </button>
        </div>

        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-3"
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search..."
            className="w-full pl-10 py-2 rounded-xl bg-gray-100"
          />
        </div>
      </div>

      <div className="p-4">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                currentUserId={user?._id}
                onLike={handleLike}
              />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showCreate && (
          <CreateListingModal
            onClose={() => setShowCreate(false)}
            onCreate={(product) =>
              setProducts((prev) => [
                product,
                ...prev,
              ])
            }
          />
        )}
      </AnimatePresence>
    </div>
  );
}