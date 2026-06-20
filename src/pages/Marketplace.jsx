import { useState } from "react";
import ProductGrid from "../components/marketplace/ProductGrid";

export default function Marketplace() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");

  const categories = ["All", "Electronics", "Clothing", "Accessories", "Home", "Books", "Toys", "Sports", "Beauty", "Automotive", "Garden", "Music", "Office", "Pet Supplies", "Tools", "Video Games", "Health", "Grocery", "Baby", "Industrial", "Luggage", "Software", "Outdoors", "Jewelry", "Watches", "Handmade", "Collectibles", "Art", "Crafts", "Appliances", "Furniture", "Musical Instruments", "Office Supplies", "Software", "Tools & Home Improvement", "Toys & Games", "Video Games", "Watches & Jewelry", "Sports & Outdoors", "Automotive Parts & Accessories", "Health & Personal Care", "Grocery & Gourmet Food", "Baby Products", "Industrial & Scientific", "Luggage & Travel Gear", "Software", "Tools & Home Improvement", "Toys & Games", "Video Games", "Watches & Jewelry", "Sports & Outdoors", "Automotive Parts & Accessories", "Health & Personal Care", "Grocery & Gourmet Food", "Baby Products", "Industrial & Scientific", "Luggage & Travel Gear", "Software", "Tools & Home Improvement", "Toys & Games", "Video Games", "Watches & Jewelry", "Sports & Outdoors", "Automotive Parts & Accessories", "Health & Personal Care", "Grocery & Gourmet Food", "Baby Products", "Industrial & Scientific", "Luggage & Travel Gear", "Software", "Tools & Home Improvement", "Toys & Games", "Video Games", "Watches & Jewelry", "Sports & Outdoors", "Automotive Parts & Accessories", "Health & Personal Care", "Grocery & Gourmet Food", "Baby Products", "Industrial & Scientific", "Luggage & Travel Gear", "Software", "Tools & Home Improvement", "Toys & Games", "Video Games", "Watches & Jewelry", "Sports & Outdoors", "Automotive Parts & Accessories", "Health & Personal Care", "Grocery & Gourmet Food", "Baby Products", "Industrial & Scientific", "Luggage & Travel Gear", "Software", "Tools & Home Improvement", "Toys & Games", "Video Games", "Watches & Jewelry", "Sports & Outdoors", "Automotive Parts & Accessories", "Health & Personal Care", "Grocery & Gourmet Food", "Baby Products", "Industrial & Scientific", "Luggage & Travel Gear", "Software", "Tools & Home Improvement", "Toys & Games", "Video Games", "Watches & Jewelry", "Sports & Outdoors", "Automotive Parts & Accessories", "Health & Personal Care", "Grocery & Gourmet Food", "Baby Products", "Industrial & Scientific", "Luggage & Travel Gear", "Software", "Tools & Home Improvement", "Toys & Games", "Video Games", "Watches & Jewelry", "Sports & Outdoors", "Automotive Parts & Accessories", "Health & Personal Care", "Grocery & Gourmet Food", "Baby Products", "Industrial & Scientific", "Luggage & Travel Gear", "Software", "Tools & Home Improvement", "Toys & Games", "Video Games", "Watches & Jewelry", "Sports & Outdoors", "Automotive Parts & Accessories", "Health & Personal Care", "Grocery & Gourmet Food", "Baby Products", "Industrial & Scientific", "Luggage & Travel Gear", "Software", "Tools & Home Improvement", "Toys & Games", "Video Games", "Watches & Jewelry", "Sports & Outdoors", "Automotive Parts & Accessories", "Health & Personal Care", "Grocery & Gourmet Food", "Baby Products", "Industrial & Scientific", "Luggage & Travel Gear", "Software", "Tools & Home Improvement", "Toys & Games", "Video Games", "Watches & Jewelry", "Sports & Outdoors", "Automotive Parts & Accessories", "Health & Personal Care", "Grocery & Gourmet Food", "Baby Products", "Industrial & Scientific", "Luggage & Travel Gear", "Software", "Tools & Home Improvement", "Toys & Games", "Video Games"];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <input
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search products..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        >
          {categories.map((cat, i) => (
            <option key={i} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <ProductGrid searchTerm={searchTerm} category={category} />
    </div>
  );
}