"use client";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { imageUrl } from "@/lib/api";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, getCount } = useCart();

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 md:px-0 pb-24 md:pb-10">
          <div className="flex flex-col items-center justify-center min-h-[65vh] text-center">
            <div className="w-24 h-24 rounded-full bg-purple-50 flex items-center justify-center mb-5">
              <svg className="w-12 h-12 text-yaqut-purple/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-yaqut-primary">سلتك فارغة</h2>
            <p className="text-yaqut-muted text-sm mt-2 mb-6">أضف منتجات لبدء التسوق</p>
            <Link href="/products" className="bg-yaqut-purple text-white px-8 py-3 rounded-2xl font-bold btn-press">
              تصفح المنتجات
            </Link>
          </div>
        </main>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-6 pb-32 md:pb-10">
        <h1 className="text-yaqut-primary font-black text-2xl mb-6">
          سلة التسوق
          <span className="text-yaqut-muted font-medium text-base mr-2">({getCount()} منتج)</span>
        </h1>

        {/* Desktop: 2-column (items + summary) / Mobile: single column */}
        <div className="md:grid md:grid-cols-3 md:gap-8 items-start">

          {/* Items list */}
          <div className="md:col-span-2 space-y-3">
            {items.map((item) => {
              const img = item.image || imageUrl(item.image);
              return (
                <div key={item.id} className="bg-white rounded-2xl p-4 shadow-card flex gap-4 fade-in">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                    {img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={img} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-purple-50 flex items-center justify-center">
                        <svg className="w-8 h-8 text-purple-200" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-yaqut-primary text-sm md:text-base line-clamp-2">{item.name}</h3>
                    <p className="text-yaqut-gold font-black text-lg mt-1">
                      {Number(item.price).toLocaleString("ar-IQ")}
                      <span className="text-xs text-yaqut-muted font-normal mr-1">د.ع</span>
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-yaqut-primary font-bold hover:bg-red-100 hover:text-red-500 btn-press transition-colors">−</button>
                        <span className="w-7 text-center font-bold text-yaqut-primary">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-lg bg-yaqut-primary/10 flex items-center justify-center text-yaqut-primary font-bold hover:bg-yaqut-primary hover:text-white btn-press transition-colors">+</button>
                      </div>
                      <p className="text-yaqut-muted text-xs font-semibold">
                        {(Number(item.price) * item.quantity).toLocaleString("ar-IQ")} د.ع
                      </p>
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.id)}
                    className="self-start p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors btn-press">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Order summary — sticky on desktop, fixed bottom on mobile */}
          {/* Desktop summary */}
          <div className="hidden md:block sticky top-28">
            <div className="bg-white rounded-2xl p-5 shadow-card">
              <h2 className="font-black text-yaqut-primary text-lg mb-4">ملخص الطلب</h2>
              <div className="space-y-2 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600 truncate flex-1 ml-4">{item.name} ×{item.quantity}</span>
                    <span className="font-semibold text-yaqut-primary flex-shrink-0">
                      {(Number(item.price) * item.quantity).toLocaleString("ar-IQ")}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-3 mb-5">
                <div className="flex justify-between">
                  <span className="font-bold text-yaqut-primary">الإجمالي</span>
                  <span className="font-black text-yaqut-gold text-xl">
                    {getTotal().toLocaleString("ar-IQ")}
                    <span className="text-sm font-medium text-yaqut-muted mr-1">د.ع</span>
                  </span>
                </div>
              </div>
              <Link href="/checkout"
                className="block w-full bg-purple-gradient text-white text-center py-3.5 rounded-2xl font-black btn-press shadow-lg">
                إتمام الطلب ←
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile fixed bottom bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-100 shadow-nav">
        <div className="px-4 pt-3 pb-2 bottom-nav flex gap-3">
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <span className="text-yaqut-muted text-xs font-medium">الإجمالي</span>
            </div>
            <span className="text-yaqut-primary font-black text-lg">
              {getTotal().toLocaleString("ar-IQ")}
              <span className="text-xs font-medium text-yaqut-muted mr-1">د.ع</span>
            </span>
          </div>
          <Link href="/checkout"
            className="flex-1 bg-purple-gradient text-white text-center py-3.5 rounded-2xl font-black text-sm btn-press shadow-lg flex items-center justify-center">
            إتمام الطلب ←
          </Link>
        </div>
      </div>

      <BottomNav />
    </>
  );
}
