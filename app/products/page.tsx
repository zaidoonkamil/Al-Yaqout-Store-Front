"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { api, type Product } from "@/lib/api";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import ProductCard from "@/components/ProductCard";

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("cat") || "الكل";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(["الكل"]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCat);

  useEffect(() => {
    Promise.all([
      api.getProducts(),
      api.getCategories(),
    ])
      .then(([prods, cats]) => {
        setProducts(prods);
        setCategories(["الكل", ...cats.map((c) => c.name)]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) => {
    const matchCat = category === "الكل" || p.category === category;
    const matchSearch =
      !search || p.name.includes(search) || (p.description || "").includes(search);
    return matchCat && matchSearch;
  });

  return (
    <>
      <Navbar />

      {/* ── FILTER HEADER ── */}
      <div className="sticky top-14 md:top-16 z-40 bg-yaqut-primary shadow-md">
        <div className="max-w-7xl mx-auto px-4 md:px-8 pb-3 pt-2">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن منتج..."
              className="w-full bg-white/10 text-white placeholder-white/50 rounded-xl px-4 py-2.5 pr-10 text-sm focus:bg-white/20 transition-colors"
            />
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto carousel-container mt-2.5 pb-0.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-bold transition-all btn-press ${
                  category === cat
                    ? "bg-yaqut-gold text-yaqut-primary shadow-gold"
                    : "bg-white/10 text-white/80 hover:bg-white/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── PRODUCTS GRID ── */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-5 pb-24 md:pb-10">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-card animate-pulse">
                <div className="aspect-square bg-gray-200" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <span className="text-6xl">🔍</span>
            <p className="text-yaqut-muted mt-4 font-medium text-xl">لا توجد نتائج</p>
            <p className="text-yaqut-muted text-sm mt-1">جرب كلمات بحث أخرى أو فئة مختلفة</p>
          </div>
        ) : (
          <>
            <p className="text-yaqut-muted text-sm mb-4 font-medium">
              {filtered.length} منتج
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </>
        )}
      </main>

      <BottomNav />
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsContent />
    </Suspense>
  );
}
