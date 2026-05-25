"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, type Order } from "@/lib/api";
import AdminSidebar from "@/components/AdminSidebar";

const STATUS_LABELS: Record<string, string> = {
  pending:   "معلق",
  confirmed: "مؤكد",
  delivered: "تم التسليم",
  cancelled: "ملغي",
};

const STATUS_OPTIONS = ["pending", "confirmed", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [updating, setUpdating] = useState<number | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : "";

  useEffect(() => {
    if (!token) { router.replace("/admin/login"); return; }
    load(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const load = (p: number) => {
    setLoading(true);
    api.getOrders(p, token)
      .then((data) => {
        setOrders(data.orders);
        setTotalPages(data.totalPages);
        setTotal(data.total);
      })
      .catch(() => router.replace("/admin/login"))
      .finally(() => setLoading(false));
  };

  const handleStatusChange = async (id: number, status: string) => {
    setUpdating(id);
    try {
      const updated = await api.updateOrderStatus(id, status, token);
      setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "فشل التحديث");
    } finally {
      setUpdating(null);
    }
  };

  const getStatusClass = (status: string) => {
    const map: Record<string, string> = {
      pending: "status-pending",
      confirmed: "status-confirmed",
      delivered: "status-delivered",
      cancelled: "status-cancelled",
    };
    return map[status] || "";
  };

  return (
    <div className="md:mr-56">
      <AdminSidebar />

      <header className="bg-white border-b border-gray-200 px-4 py-4 md:px-6">
        <h1 className="text-yaqut-primary font-black text-xl">الطلبات</h1>
        <p className="text-yaqut-muted text-sm">
          إجمالي {total} طلب · صفحة {page} من {totalPages}
        </p>
      </header>

      <main className="p-4 md:p-6 pb-24 md:pb-6">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-card animate-pulse h-24" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-5xl">📭</span>
            <p className="text-yaqut-muted mt-3 font-medium">لا توجد طلبات بعد</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-card overflow-hidden">
                {/* Order Header */}
                <div
                  className="p-4 flex items-center gap-3 cursor-pointer"
                  onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-yaqut-primary font-black text-sm">#{order.id}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getStatusClass(order.status)}`}>
                        {STATUS_LABELS[order.status]}
                      </span>
                    </div>
                    <p className="font-bold text-yaqut-primary truncate">{order.customerName}</p>
                    <p className="text-yaqut-muted text-xs mt-0.5">
                      {order.customerPhone} · {new Date(order.createdAt).toLocaleDateString("ar-IQ")}
                    </p>
                  </div>
                  <div className="text-left flex-shrink-0">
                    <p className="text-yaqut-gold font-black text-sm">
                      {Number(order.total).toLocaleString("ar-IQ")}
                    </p>
                    <p className="text-yaqut-muted text-xs">د.ع</p>
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${expanded === order.id ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Expanded Details */}
                {expanded === order.id && (
                  <div className="border-t border-gray-100 p-4 bg-gray-50 space-y-4">
                    {/* Address */}
                    <div>
                      <p className="text-xs font-bold text-yaqut-muted mb-1">العنوان</p>
                      <p className="text-sm text-yaqut-primary">{order.address}</p>
                    </div>

                    {/* Notes */}
                    {order.notes && (
                      <div>
                        <p className="text-xs font-bold text-yaqut-muted mb-1">ملاحظات</p>
                        <p className="text-sm text-yaqut-primary">{order.notes}</p>
                      </div>
                    )}

                    {/* Items */}
                    <div>
                      <p className="text-xs font-bold text-yaqut-muted mb-2">المنتجات</p>
                      <div className="space-y-2">
                        {(order.items || []).map((item, i) => (
                          <div key={i} className="flex items-center justify-between bg-white rounded-xl p-2.5">
                            <span className="text-sm text-yaqut-primary font-medium">
                              {item.name} × {item.quantity}
                            </span>
                            <span className="text-sm font-bold text-yaqut-gold">
                              {(item.price * item.quantity).toLocaleString("ar-IQ")} د.ع
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between mt-2 pt-2 border-t border-gray-200">
                        <span className="text-sm font-bold text-yaqut-primary">الإجمالي</span>
                        <span className="text-sm font-black text-yaqut-gold">
                          {Number(order.total).toLocaleString("ar-IQ")} د.ع
                        </span>
                      </div>
                    </div>

                    {/* Status Update */}
                    <div>
                      <p className="text-xs font-bold text-yaqut-muted mb-2">تغيير الحالة</p>
                      <div className="flex flex-wrap gap-2">
                        {STATUS_OPTIONS.map((s) => (
                          <button
                            key={s}
                            onClick={() => handleStatusChange(order.id, s)}
                            disabled={order.status === s || updating === order.id}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all btn-press ${
                              order.status === s
                                ? `${getStatusClass(s)} ring-2 ring-offset-1 ring-current`
                                : "bg-white border border-gray-200 text-gray-600 hover:border-gray-400"
                            } disabled:opacity-50`}
                          >
                            {updating === order.id && order.status !== s ? "..." : STATUS_LABELS[s]}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Phone CTA */}
                    <a
                      href={`tel:${order.customerPhone}`}
                      className="flex items-center gap-2 bg-yaqut-primary text-white px-4 py-2.5 rounded-xl text-sm font-bold btn-press w-fit"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                      </svg>
                      اتصل بـ {order.customerName}
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-yaqut-primary font-bold text-sm btn-press disabled:opacity-40"
            >
              السابق
            </button>
            <span className="text-sm font-bold text-yaqut-muted">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-yaqut-primary font-bold text-sm btn-press disabled:opacity-40"
            >
              التالي
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
