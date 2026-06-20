import { useState } from "react";
import Layout from "../components/layout/MainLayout";
import ProductGrid from "../components/marketplace/ProductGrid";

export default function Marketplace() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");

  const categories = ["All", "Electronics", "Clothing", "Accessories", "Home", "Books", "Toys", "Sports", "Beauty", "Automotive", "Garden", "Music", "Office", "Pet Supplies", "Tools", "Video Games", "Health", "Grocery", "Baby", "Industrial", "Luggage", "Software", "Outdoors", "Jewelry", "Watches", "Handmade", "Collectibles", "Art", "Crafts", "Appliances", "Furniture", "Musical Instruments", "Office Supplies", "Software", "Tools & Home Improvement", "Toys & Games", "Video Games", "Watches & Jewelry", "Sports & Outdoors", "Automotive Parts & Accessories", "Health & Personal Care", "Grocery & Gourmet Food", "Baby Products", "Industrial & Scientific", "Luggage & Travel Gear", "Software", "Tools & Home Improvement", "Toys & Games", "Video Games", "Watches & Jewelry", "Sports & Outdoors", "Automotive Parts & Accessories", "Health & Personal Care", "Grocery & Gourmet Food", "Baby Products", "Industrial & Scientific", "Luggage & Travel Gear", "Software", "Tools & Home Improvement", "Toys & Games", "Video Games", "Watches & Jewelry", "Sports & Outdoors", "Automotive Parts & Accessories", "Health & Personal Care", "Grocery & Gourmet Food", "Baby Products", "Industrial & Scientific", "Luggage & Travel Gear", "Software", "Tools & Home Improvement", "Toys & Games", "Video Games", "Watches & Jewelry", "Sports & Outdoors", "Automotive Parts & Accessories", "Health & Personal Care", "Grocery & Gourmet Food", "Baby Products", "Industrial & Scientific", "Luggage & Travel Gear", "Software", "Tools & Home Improvement", "Toys & Games", "Video Games", "Watches & Jewelry", "Sports & Outdoors", "Automotive Parts & Accessories", "Health & Personal Care", "Grocery & Gourmet Food", "Baby Products", "Industrial & Scientific", "Luggage & Travel Gear", "Software", "Tools & Home Improvement", "Toys & Games", "Video Games", "Watches & Jewelry", "Sports & Outdoors", "Automotive Parts & Accessories", "Health & Personal Care", "Grocery & Gourmet Food", "Baby Products", "Industrial & Scientific", "Luggage & Travel Gear", "Software", "Tools & Home Improvement", "Toys & Games", "Video Games", "Watches & Jewelry", "Sports & Outdoors", "Automotive Parts & Accessories", "Health & Personal Care", "Grocery & Gourmet Food", "Baby Products", "Industrial & Scientific", "Luggage & Travel Gear", "Software", "Tools & Home Improvement", "Toys & Games", "Video Games", "Watches & Jewelry", "Sports & Outdoors", "Automotive Parts & Accessories", "Health & Personal Care", "Grocery & Gourmet Food", "Baby Products", "Industrial & Scientific", "Luggage & Travel Gear", "Software", "Tools & Home Improvement", "Toys & Games", "Video Games", "Watches & Jewelry", "Sports & Outdoors", "Automotive Parts & Accessories", "Health & Personal Care", "Grocery & Gourmet Food", "Baby Products", "Industrial & Scientific", "Luggage & Travel Gear", "Software", "Tools & Home Improvement", "Toys & Games", "Video Games", "Watches & Jewelry", "Sports & Outdoors", "Automotive Parts & Accessories", "Health & Personal Care", "Grocery & Gourmet Food", "Baby Products", "Industrial & Scientific", "Luggage & Travel Gear", "Software", "Tools & Home Improvement", "Toys & Games", "Video Games", "Watches & Jewelry", "Sports & Outdoors", "Automotive Parts & Accessories", "Health & Personal Care", "Grocery & Gourmet Food", "Baby Products", "Industrial & Scientific", "Luggage & Travel Gear", "Software", "Tools & Home Improvement", "Toys & Games", "Video Games"];

  return (
    <Layout>
      <div className="relative min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 overflow-hidden flex items-start justify-center">
        {/* Animated blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-400 opacity-30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-pink-400 opacity-30 rounded-full blur-3xl animate-pulse" />

        <div className="max-w-7xl mx-auto py-12 px-4 relative z-10 text-center w-full">
          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-extrabold mb-8 text-white drop-shadow-lg animate-slideInFromTop">
            Marketplace
          </h1>

          {/* Filters */}
          <div className="mb-8 flex flex-col md:flex-row items-center justify-center gap-4 max-w-3xl mx-auto">
            {/* Category Filter */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="p-3 rounded-lg bg-white bg-opacity-80 text-gray-800 focus:outline-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 p-3 rounded-lg bg-white bg-opacity-80 text-gray-800 focus:outline-none"
            />
          </div>

          {/* Product Grid */}
          <div className="relative z-10 animate-fadeIn">
            <ProductGrid searchTerm={searchTerm} category={category} />
          </div>
        </div>
      </div>
    </Layout>
  );
}