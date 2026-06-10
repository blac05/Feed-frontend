import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

export default function ProductGrid() {
  const [products,
    setProducts] =
    useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts =
    async () => {
      const res =
        await fetch(
          "/api/products"
        );

      const data =
        await res.json();

      setProducts(
        data.products
      );
    };

  return (
    <div className="grid md:grid-cols-4 gap-6">
      {products.map(
        product => (
          <ProductCard
            key={product._id}
            product={product}
          />
        )
      )}
    </div>
  );
}