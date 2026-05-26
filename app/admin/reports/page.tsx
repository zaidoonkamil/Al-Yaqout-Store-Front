"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, type OrderStats } from "@/lib/api";
import AdminSidebar from "@/components/AdminSidebar";

const today = () => new Date().toISOString().split("T")[0];
const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
};

const PRESETS = [
  { label: "اليوم",       start: today(),    end: today() },
  { label: "آخر 7 أيام", start: daysAgo(6), end: today() },
  { label: "آخر 30 يوم", start: daysAgo(29),end: today() },
  { label: "هذا الشهر",  start: (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-01`; })(), end: today() },
];

export default function AdminReportsPage() {
  const router = useRouter();
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(daysAgo(29));
  const [endDate, setEndDate] = useState(today());
  const [activePreset, setActivePreset] = useState(2);

  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : "";

  useEffect(() => {
    if (!token) { router.replace("/admin/login"); return; }
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchStats = async (start = startDate, end = endDate) => {
    setLoading(true);
    try {
      const data = await api.getOrderStats(token, start, end);
      setStats(data);
    } catch {
      router.replace("/admin/login");
    } finally {
      setLoading(false);
    }
  };

  const applyPreset = (idx: number) => {
    const p = PRESETS[idx];
    setActivePreset(idx);
    setStartDate(p.start);
    setEndDate(p.end);
    fetchStats(p.start, p.end);
  };

  const handleFilter = () => {
    setActivePreset(-1);
    fetchStats();
  };

  const STATUS_LABELS: Record<string, string> = {
    pending: "معلق", confirmed: "مؤكد", delivered: "مُسلَّم", cancelled: "ملغي",
  };
  const STATUS_COLORS: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    confirmed: "bg-blue-100 text-blue-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-600",
  };

  return (
    <div className="md:mr-56">
      <AdminSidebar />

      <header className="bg-white border-b border-gray-200 px-4 py-4 md:px-6">
        <h1 className="text-yaqut-primary font-black text-xl">تقرير الأرباح</h1>
        <p className="text-yaqut-muted text-sm">تحليل المبيعات والإيرادات حسب الفترة</p>
      </header>

      <main className="p-4 md:p-6 pb-24 md:pb-6 space-y-5">

        {/* Date filter */}
        <div className="bg-white rounded-2xl p-4 shadow-card space-y-3">
          {/* Presets */}
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p, i) => (
              <button key={p.label} onClick={() => applyPreset(i)}
                className={`px-3 py-1.5 rounded-xl text-sm font-bold btn-press transition-all ${
                  activePreset === i ? "bg-yaqut-primary text-white" : "bg-gray-100 text-yaqut-primary hover:bg-gray-200"
                }`}>
                {p.label}
              </button>
            ))}
          </div>

          {/* Custom range */}
          <div className="flex items-center gap-2 flex-wrap">
            <input type="date" value={startDate}
              onChange={(e) => { setStartDate(e.target.value); setActivePreset(-1); }}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-yaqut-purple flex-1 min-w-[130px]" />
            <span className="text-gray-400 text-sm font-medium">إلى</span>
            <input type="date" value={endDate}
              onChange={(e) => { setEndDate(e.target.value); setActivePreset(-1); }}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-yaqut-purple flex-1 min-w-[130px]" />
            <button onClick={handleFilter}
              className="bg-yaqut-purple text-white px-4 py-2 rounded-xl font-bold text-sm btn-press flex items-center gap-2">
              {loading ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
              بحث
            </button>
          </div>
        </div>

        {loading && !stats ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-card animate-pulse h-24" />
            ))}
          </div>
        ) : stats ? (
          <>
            {/* Main stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-2xl p-4 shadow-card">
                <p className="text-3xl mb-1">📋</p>
                <p className="text-2xl font-black text-yaqut-primary">{stats.totalOrders}</p>
                <p className="text-xs text-yaqut-muted font-medium mt-0.5">إجمالي الطلبات</p>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-card">
                <p className="text-3xl mb-1">💰</p>
                <p className="text-xl font-black text-yaqut-gold leading-tight">
                  {stats.totalRevenue.toLocaleString("ar-IQ")}
                </p>
                <p className="text-xs text-yaqut-muted font-medium mt-0.5">إجمالي الإيرادات د.ع</p>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-card">
                <p className="text-3xl mb-1">🚚</p>
                <p className="text-xl font-black text-blue-600 leading-tight">
                  {stats.totalDelivery.toLocaleString("ar-IQ")}
                </p>
                <p className="text-xs text-yaqut-muted font-medium mt-0.5">رسوم التوصيل د.ع</p>
              </div>
              <div className="bg-green-50 rounded-2xl p-4 shadow-card border border-green-200">
                <p className="text-3xl mb-1">📈</p>
                <p className="text-xl font-black text-green-700 leading-tight">
                  {stats.netSales.toLocaleString("ar-IQ")}
                </p>
                <p className="text-xs text-green-600 font-bold mt-0.5">صافي المبيعات د.ع</p>
              </div>
            </div>

            {/* Orders by status */}
            <div className="bg-white rounded-2xl p-4 shadow-card">
              <h3 className="font-black text-yaqut-primary mb-3">الطلبات حسب الحالة</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(stats.byStatus).map(([status, count]) => (
                  <div key={status} className={`flex items-center justify-between px-3 py-2.5 rounded-xl ${STATUS_COLORS[status]}`}>
                    <span className="text-sm font-bold">{STATUS_LABELS[status]}</span>
                    <span className="font-black text-lg">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top products */}
            {stats.topProducts.length > 0 && (
              <div className="bg-white rounded-2xl p-4 shadow-card">
                <h3 className="font-black text-yaqut-primary mb-3">أكثر المنتجات مبيعًا</h3>
                <div className="space-y-2">
                  {stats.topProducts.map((p, i) => (
                    <div key={p.name} className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 ${
                        i === 0 ? "bg-yellow-400 text-yellow-900" :
                        i === 1 ? "bg-gray-300 text-gray-700" :
                        i === 2 ? "bg-amber-600 text-white" : "bg-gray-100 text-gray-500"
                      }`}>{i + 1}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-yaqut-primary truncate">{p.name}</p>
                        <p className="text-xs text-yaqut-muted">{p.qty} قطعة</p>
                      </div>
                      <div className="text-left flex-shrink-0">
                        <p className="text-sm font-black text-yaqut-gold">{p.revenue.toLocaleString("ar-IQ")}</p>
                        <p className="text-xs text-yaqut-muted">د.ع</p>
                      </div>
                      {/* Mini bar */}
                      <div className="w-16 bg-gray-100 rounded-full h-2 flex-shrink-0">
                        <div
                          className="bg-yaqut-gold h-2 rounded-full"
                          style={{ width: `${Math.round((p.revenue / stats.topProducts[0].revenue) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Note about profit */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800">
              <p className="font-bold mb-1">💡 ملاحظة حول الأرباح الصافية</p>
              <p>لمعرفة الربح الصافي الدقيق، أضف سعر التكلفة لكل منتج من صفحة المنتجات. الأرقام أعلاه تمثل الإيرادات الكاملة.</p>
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
}
