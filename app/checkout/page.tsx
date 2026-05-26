"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { api, type DeliveryZone } from "@/lib/api";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCart();

  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    address: "",
    notes: "",
    governorate: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [deliveryFee, setDeliveryFee] = useState(0);

  useEffect(() => {
    api.getDeliveryZones().then(setZones).catch(() => {});
  }, []);

  const handleGovernorateChange = (gov: string) => {
    setForm((f) => ({ ...f, governorate: gov }));
    const zone = zones.find((z) => z.governorate === gov);
    setDeliveryFee(zone ? Number(zone.fee) : 0);
    setErrors((er) => ({ ...er, governorate: "" }));
  };

  const grandTotal = getTotal() + deliveryFee;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.customerName.trim()) e.customerName = "الاسم مطلوب";
    if (!form.customerPhone.trim()) e.customerPhone = "رقم الهاتف مطلوب";
    else if (form.customerPhone.trim().length < 7) e.customerPhone = "رقم الهاتف قصير جداً";
    if (!form.governorate) e.governorate = "اختر المحافظة";
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
        governorate: form.governorate,
        deliveryFee,
        items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, image: i.image })),
        total: grandTotal,
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

        <Link href="/cart" className="inline-flex items-center gap-1 text-yaqut-purple text-sm font-semibold mb-5 btn-press">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          العودة للسلة
        </Link>

        <h1 className="text-yaqut-primary font-black text-2xl mb-6">إتمام الطلب</h1>

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

              {/* Name */}
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

              {/* Phone */}
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

              {/* Governorate */}
              <div>
                <label className="block text-yaqut-primary font-bold text-sm mb-1.5">
                  المحافظة <span className="text-red-400">*</span>
                </label>
                <select
                  value={form.governorate}
                  onChange={(e) => handleGovernorateChange(e.target.value)}
                  className={`w-full border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-yaqut-purple transition-all bg-white ${errors.governorate ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-yaqut-purple"}`}
                >
                  <option value="">اختر المحافظة...</option>
                  {zones.map((z) => (
                    <option key={z.id} value={z.governorate}>
                      {z.governorate}{z.fee > 0 ? ` — ${Number(z.fee).toLocaleString("ar-IQ")} د.ع` : " — مجاني"}
                    </option>
                  ))}
                </select>
                {errors.governorate && <p className="text-red-500 text-xs mt-1">{errors.governorate}</p>}
                {form.governorate && (
                  <p className="text-xs mt-1.5 font-medium text-yaqut-muted">
                    رسوم التوصيل لـ {form.governorate}:&nbsp;
                    {deliveryFee > 0
                      ? <span className="text-yaqut-gold font-black">{deliveryFee.toLocaleString("ar-IQ")} د.ع</span>
                      : <span className="text-green-600 font-black">مجاني 🎉</span>
                    }
                  </p>
                )}
              </div>

              {/* Address */}
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

              {/* Notes */}
              <div>
                <label className="block text-yaqut-primary font-bold text-sm mb-1.5">ملاحظات إضافية (اختياري)</label>
                <textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  placeholder="أي تعليمات خاصة للتوصيل..." rows={2}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-yaqut-purple transition-all resize-none bg-white" />
              </div>
            </div>

            {/* Total summary on mobile */}
            <div className="md:hidden bg-white rounded-2xl p-4 shadow-card space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>المنتجات</span>
                <span className="font-semibold">{getTotal().toLocaleString("ar-IQ")} د.ع</span>
              </div>
              {deliveryFee > 0 && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>رسوم التوصيل</span>
                  <span className="font-semibold">{deliveryFee.toLocaleString("ar-IQ")} د.ع</span>
                </div>
              )}
              <div className="flex justify-between border-t pt-2">
                <span className="font-black text-yaqut-primary">الإجمالي</span>
                <span className="font-black text-yaqut-gold text-lg">{grandTotal.toLocaleString("ar-IQ")} د.ع</span>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-purple-gradient text-white py-4 rounded-2xl font-black text-base btn-press shadow-lg disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? (
                <><svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>جاري الإرسال...</>
              ) : "تأكيد الطلب ✓"}
            </button>
          </form>

          {/* Order summary sidebar — desktop */}
          <div className="hidden md:block sticky top-28">
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
              <div className="border-t border-gray-100 pt-3 space-y-2">
                {deliveryFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">رسوم التوصيل</span>
                    <span className="font-semibold text-yaqut-primary">{deliveryFee.toLocaleString("ar-IQ")} د.ع</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="font-bold text-yaqut-primary">الإجمالي</span>
                  <span className="font-black text-yaqut-gold text-xl">
                    {grandTotal.toLocaleString("ar-IQ")}
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
