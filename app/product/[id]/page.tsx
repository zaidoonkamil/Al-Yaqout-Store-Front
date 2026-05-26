"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api, type Product, imageUrl } from "@/lib/api";
import { useCart } from "@/lib/cart";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const addItem = useCart((s) => s.addItem);
  const updateQty = useCart((s) => s.updateQuantity);
  const items = useCart((s) => s.items);

  useEffect(() => {
    if (!id) return;
    api.getProduct(Number(id))
      .then(setProduct)
      .catch((err) => setError(err instanceof Error ? err.message : "حدث خطأ"))
      .finally(() => setLoading(false));
  }, [id]);

  const cartItem = product ? items.find((i) => i.id === product.id) : null;

  const handleAdd = () => {
    if (!product) return;
    if (cartItem) {
      updateQty(product.id, cartItem.quantity + quantity);
    } else {
      addItem({ id: product.id, name: product.name, price: Number(product.price), image: imageUrl(product.image) });
      if (quantity > 1) updateQty(product.id, quantity);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 pb-24 animate-pulse">
          <div className="md:grid md:grid-cols-2 md:gap-10">
            <div className="aspect-square bg-gray-200 rounded-2xl mb-4 md:mb-0" />
            <div className="space-y-4">
              <div className="h-7 bg-gray-200 rounded w-3/4" />
              <div className="h-5 bg-gray-200 rounded w-1/3" />
              <div className="h-24 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
        <BottomNav />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <p className="text-red-500 font-bold text-lg mb-4">{error || "المنتج غير موجود"}</p>
          <Link href="/products" className="bg-yaqut-purple text-white px-6 py-3 rounded-2xl font-bold btn-press">
            العودة للمنتجات
          </Link>
        </div>
        <BottomNav />
      </>
    );
  }

  const img = imageUrl(product.image);

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-4 pb-32 md:pb-10">

        {/* Back */}
        <button onClick={() => router.back()}
          className="flex items-center gap-1 text-yaqut-purple text-sm font-semibold mb-4 btn-press">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          رجوع
        </button>

        {/* Desktop: 2-column / Mobile: single column */}
        <div className="md:grid md:grid-cols-2 md:gap-10 items-start">

          {/* Image */}
          <div className="rounded-2xl overflow-hidden aspect-square bg-gray-50 shadow-card mb-4 md:mb-0 md:sticky md:top-24">
            {img ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={img} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-amber-50">
                <svg className="w-24 h-24 text-purple-200" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {product.category && (
              <span className="bg-purple-100 text-yaqut-purple text-xs font-semibold px-3 py-1 rounded-full">
                {product.category}
              </span>
            )}
            <h1 className="text-yaqut-primary font-black text-2xl md:text-3xl mt-2 leading-snug">
              {product.name}
            </h1>
            <p className="text-yaqut-gold font-black text-3xl mt-3">
              {Number(product.price).toLocaleString("ar-IQ")}
              <span className="text-base font-medium text-yaqut-muted mr-1">د.ع</span>
            </p>

            {/* Stock */}
            <div className="flex items-center gap-2 mt-3">
              <div className={`w-2.5 h-2.5 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-500"}`} />
              <span className={`text-sm font-semibold ${product.inStock ? "text-green-600" : "text-red-500"}`}>
                {product.inStock ? "متوفر في المخزن" : "نفذت الكمية"}
              </span>
            </div>

            {product.description && (
              <div className="mt-5 bg-white rounded-2xl p-5 shadow-card">
                <h3 className="font-bold text-yaqut-primary text-sm mb-2">الوصف</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Quantity */}
            {product.inStock && (
              <div className="flex items-center gap-4 mt-5">
                <span className="text-yaqut-primary font-bold">الكمية</span>
                <div className="flex items-center gap-3 bg-white rounded-xl shadow-card p-1.5">
                  <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-yaqut-primary font-bold hover:bg-gray-200 btn-press text-lg">−</button>
                  <span className="w-10 text-center font-black text-yaqut-primary text-lg">{quantity}</span>
                  <button onClick={() => setQuantity((q) => q + 1)}
                    className="w-9 h-9 rounded-lg bg-yaqut-primary flex items-center justify-center text-white font-bold hover:bg-yaqut-purple btn-press text-lg">+</button>
                </div>
              </div>
            )}

            {/* Desktop action buttons */}
            <div className="hidden md:flex gap-3 mt-6">
              <button onClick={handleAdd} disabled={!product.inStock}
                className={`flex-1 py-4 rounded-2xl font-black text-base btn-press transition-all flex items-center justify-center gap-2 ${
                  added ? "bg-green-500 text-white" : product.inStock ? "bg-yaqut-purple text-white hover:bg-yaqut-primary" : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}>
                {added ? (
                  <><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>أُضيف للسلة</>
                ) : product.inStock ? "أضف للسلة" : "نفذت الكمية"}
              </button>
              {cartItem && (
                <Link href="/cart"
                  className="px-6 py-4 rounded-2xl border-2 border-yaqut-purple text-yaqut-purple font-bold btn-press flex items-center">
                  السلة ({cartItem.quantity})
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile fixed bottom action — sits above BottomNav (60px) */}
      <div className="md:hidden fixed bottom-[60px] inset-x-0 z-40 bg-white border-t border-gray-100 shadow-nav">
        <div className="px-4 py-3 flex gap-3">
          <button onClick={handleAdd} disabled={!product.inStock}
            className={`flex-1 py-3.5 rounded-2xl font-black btn-press transition-all flex items-center justify-center gap-2 ${
              added ? "bg-green-500 text-white" : product.inStock ? "bg-yaqut-purple text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}>
            {added ? (
              <><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>أُضيف</>
            ) : product.inStock ? "أضف للسلة" : "نفذت الكمية"}
          </button>
          {cartItem && (
            <Link href="/cart" className="px-5 py-3.5 rounded-2xl border-2 border-yaqut-purple text-yaqut-purple font-bold btn-press flex items-center text-sm">
              السلة ({cartItem.quantity})
            </Link>
          )}
        </div>
      </div>

      <BottomNav />
    </>
  );
}
