"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { api } from "@/lib/api";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCart();

  const [form, setForm] = useState({ customerName: "", customerPhone: "", address: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.customerName.trim()) e.customerName = "الاسم مطلوب";
    if (!form.customerPhone.trim()) e.customerPhone = "رقم الهاتف مطلوب";
    else if (form.customerPhone.trim().length < 7) e.customerPhone = "رقم الهاتف قصير جداً";
    if (!form.address.trim()) e.address = "العنوان مطلوب";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (!items.length) return;
    setLoading(true);
    try {
      await api.createOrder({
        customerName: form.customerName.trim(),
        customerPhone: form.customerPhone.trim(),
        address: form.address.trim(),
        notes: form.notes.trim() || undefined,
        items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, image: i.image })),
        total: getTotal(),
      });
      clearCart();
      router.push("/order-success");
    } catch (err: unknown) {
      setErrors({ general: err instanceof Error ? err.message : "حدث خطأ، حاول مجدداً" });
    } finally {
      setLoading(false);
    }
  };

  if (!items.length) {
    return (
      <>
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center pb-24">
          <p className="text-yaqut-muted font-medium">سلتك فارغة</p>
          <Link href="/products" className="mt-4 inline-block bg-yaqut-purple text-white px-6 py-2.5 rounded-xl font-bold btn-press">تسوق الآن</Link>
        </div>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-6 pb-24 md:pb-10">

        {/* Back */}
        <Link href="/cart" className="inline-flex items-center gap-1 text-yaqut-purple text-sm font-semibold mb-5 btn-press">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          العودة للسلة
        </Link>

        <h1 className="text-yaqut-primary font-black text-2xl mb-6">إتمام الطلب</h1>

        {/* Desktop: 2-column / Mobile: single column */}
        <div className="md:grid md:grid-cols-3 md:gap-8 items-start">

          {/* Form */}
          <form onSubmit={handleSubmit} className="md:col-span-2 space-y-4">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                <p className="text-red-600 text-sm font-medium">{errors.general}</p>
              </div>
            )}

            <div className="bg-white rounded-2xl p-5 shadow-card space-y-4">
              <h2 className="font-bold text-yaqut-primary text-base border-b pb-3">بيانات التوصيل</h2>

              <div>
                <label className="block text-yaqut-primary font-bold text-sm mb-1.5">
                  الاسم الكامل <span className="text-red-400">*</span>
                </label>
                <input type="text" value={form.customerName}
                  onChange={(e) => { setForm((f) => ({ ...f, customerName: e.target.value })); setErrors((er) => ({ ...er, customerName: "" })); }}
                  placeholder="أدخل اسمك الكامل"
                  className={`w-full border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-yaqut-purple transition-all ${errors.customerName ? "border-red-400 bg-red-50" : "border-gray-200 bg-white focus:border-yaqut-purple"}`} />
                {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>}
              </div>

              <div>
                <label className="block text-yaqut-primary font-bold text-sm mb-1.5">
                  رقم الهاتف <span className="text-red-400">*</span>
                </label>
                <input type="tel" value={form.customerPhone}
                  onChange={(e) => { setForm((f) => ({ ...f, customerPhone: e.target.value })); setErrors((er) => ({ ...er, customerPhone: "" })); }}
                  placeholder="أدخل رقم الهاتف" dir="ltr"
                  className={`w-full border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-yaqut-purple transition-all text-right ${errors.customerPhone ? "border-red-400 bg-red-50" : "border-gray-200 bg-white focus:border-yaqut-purple"}`} />
                {errors.customerPhone && <p className="text-red-500 text-xs mt-1">{errors.customerPhone}</p>}
              </div>

              <div>
                <label className="block text-yaqut-primary font-bold text-sm mb-1.5">
                  العنوان التفصيلي <span className="text-red-400">*</span>
                </label>
                <textarea value={form.address}
                  onChange={(e) => { setForm((f) => ({ ...f, address: e.target.value })); setErrors((er) => ({ ...er, address: "" })); }}
                  placeholder="المنطقة، الشارع، أقرب نقطة دالة..." rows={3}
                  className={`w-full border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-yaqut-purple transition-all resize-none ${errors.address ? "border-red-400 bg-red-50" : "border-gray-200 bg-white focus:border-yaqut-purple"}`} />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-yaqut-primary font-bold text-sm mb-1.5">ملاحظات إضافية (اختياري)</label>
                <textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  placeholder="أي تعليمات خاصة للتوصيل..." rows={2}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-yaqut-purple transition-all resize-none bg-white" />
              </div>
            </div>

            {/* Submit — visible on mobile inline, on desktop at bottom of form */}
            <button type="submit" disabled={loading}
              className="w-full bg-purple-gradient text-white py-4 rounded-2xl font-black text-base btn-press shadow-lg disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? (
                <><svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>جاري الإرسال...</>
              ) : "تأكيد الطلب ✓"}
            </button>
          </form>

          {/* Order summary sidebar — desktop only */}
          <div className="hidden md:block sticky top-28 mt-0">
            <div className="bg-white rounded-2xl p-5 shadow-card">
              <h2 className="font-black text-yaqut-primary text-base mb-4">ملخص الطلب</h2>
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
              <div className="border-t border-gray-100 pt-3">
                <div className="flex justify-between">
                  <span className="font-bold text-yaqut-primary">الإجمالي</span>
                  <span className="font-black text-yaqut-gold text-xl">
                    {getTotal().toLocaleString("ar-IQ")}
                    <span className="text-sm font-medium text-yaqut-muted mr-1">د.ع</span>
                  </span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-amber-50 rounded-xl text-xs text-amber-700 font-medium">
                📞 سنتصل بك لتأكيد الطلب وترتيب التوصيل
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </>
  );
}
