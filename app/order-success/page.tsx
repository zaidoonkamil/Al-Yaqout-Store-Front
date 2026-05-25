"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function OrderSuccessPage() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="min-h-screen bg-yaqut-bg flex flex-col items-center justify-center px-6 text-center">
      {/* Animated checkmark */}
      <div
        className={`transition-all duration-700 ${
          show ? "opacity-100 scale-100" : "opacity-0 scale-50"
        }`}
      >
        <div className="w-28 h-28 rounded-full bg-green-100 flex items-center justify-center mb-6 mx-auto">
          <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-black text-yaqut-primary">تم استلام طلبك! 🎉</h1>
        <p className="text-yaqut-muted mt-3 text-base leading-relaxed max-w-xs mx-auto">
          سنتواصل معك قريباً على الرقم المسجل لتأكيد الطلب وترتيب التوصيل
        </p>

        <div className="bg-white rounded-2xl p-4 mt-6 shadow-card text-right max-w-xs mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-yaqut-primary/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-yaqut-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-yaqut-muted font-medium">للاستفسار تواصل معنا</p>
              <a href="tel:07839957101" className="text-yaqut-primary font-bold text-sm">
                07839957101
              </a>
            </div>
          </div>
          <p className="text-xs text-yaqut-muted">📍 البصرة – توصيل متوفر لجميع المناطق</p>
        </div>

        <div className="flex flex-col gap-3 mt-8 w-full max-w-xs mx-auto">
          <Link
            href="/products"
            className="block bg-yaqut-purple text-white py-3.5 rounded-2xl font-black btn-press"
          >
            متابعة التسوق
          </Link>
          <Link
            href="/"
            className="block bg-white border-2 border-gray-200 text-yaqut-primary py-3.5 rounded-2xl font-bold btn-press"
          >
            الصفحة الرئيسية
          </Link>
        </div>
      </div>
    </main>
  );
}
