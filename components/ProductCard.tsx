"use client";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/api";
import { imageUrl } from "@/lib/api";
import { useCart } from "@/lib/cart";

interface Props { product: Product }

export default function ProductCard({ product }: Props) {
  const addItem = useCart((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({ id: product.id, name: product.name, price: Number(product.price), image: imageUrl(product.image) });
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  const img = imageUrl(product.image);

  // Show "جديد" badge if product is less than 7 days old
  const isNew = (Date.now() - new Date(product.createdAt).getTime()) < 7 * 24 * 3600 * 1000;

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(30,13,69,0.15)] shadow-[0_2px_12px_rgba(30,13,69,0.07)]">

        {/* ── Image ── */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-50 to-purple-50">
          {img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={img} alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                <svg className="w-7 h-7 md:w-9 md:h-9 text-purple-200" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            {isNew && (
              <span className="bg-yaqut-gold text-yaqut-primary text-[10px] font-black px-2 py-0.5 rounded-full shadow-gold">
                جديد
              </span>
            )}
            {product.category && (
              <span className="bg-black/40 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
                {product.category}
              </span>
            )}
          </div>

          {/* Out of stock overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white text-red-500 text-xs font-bold px-3 py-1 rounded-full shadow">نفذت الكمية</span>
            </div>
          )}

          {/* Quick add — shows on hover (desktop) */}
          {product.inStock && (
            <div className="absolute bottom-0 inset-x-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden md:block">
              <button onClick={handleAdd}
                className={`w-full py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                  added ? "bg-green-500 text-white" : "bg-yaqut-primary/90 backdrop-blur-sm text-white hover:bg-yaqut-primary"
                }`}>
                {added ? "✓ أُضيف للسلة" : "+ أضف للسلة"}
              </button>
            </div>
          )}
        </div>

        {/* ── Info ── */}
        <div className="p-3 md:p-3.5">
          <h3 className="font-bold text-yaqut-primary text-sm leading-snug line-clamp-2 mb-2 min-h-[2.5rem]">
            {product.name}
          </h3>

          <div className="flex items-center justify-between gap-2">
            {/* Price */}
            <div>
              <span className="text-yaqut-gold font-black text-base md:text-lg">
                {Number(product.price).toLocaleString("ar-IQ")}
              </span>
              <span className="text-yaqut-muted text-[11px] font-medium mr-1">د.ع</span>
            </div>

            {/* Add button (mobile — always visible) */}
            <button onClick={handleAdd} disabled={!product.inStock}
              className={`md:hidden flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 btn-press ${
                added ? "bg-green-500 text-white" : product.inStock ? "bg-yaqut-purple text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}>
              {added ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
