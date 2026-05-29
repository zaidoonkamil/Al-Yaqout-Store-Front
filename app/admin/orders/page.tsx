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

function InvoiceModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const itemsTotal = (order.items || []).reduce((s, i) => s + i.price * i.quantity, 0);
  const deliveryFee = Number(order.deliveryFee || 0);

  const handlePrint = () => window.print();

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 print:p-0 print:bg-white print:inset-0">
      <div
        id="invoice-print"
        className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto print:rounded-none print:max-h-none print:shadow-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-yaqut-primary p-6 rounded-t-3xl print:rounded-none text-center print:bg-white print:border-b-4 print:border-gray-800">
          <div className="flex items-center justify-center gap-3 mb-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.svg"
              alt="مكتبة الياقوت"
              className="w-10 h-10 print:hidden"
              style={{ filter: "invert(73%) sepia(54%) saturate(726%) hue-rotate(4deg) brightness(92%)" }}
            />
            <h1 className="text-white font-black text-2xl print:text-black">مكتبة الياقوت</h1>
          </div>
          <p className="text-white/70 text-sm print:text-gray-600">البصرة، العراق · 07839957101</p>
          <div className="mt-3 inline-block bg-white/20 px-4 py-1 rounded-full print:border print:border-gray-300 print:bg-white">
            <p className="text-white font-black print:text-black">فاتورة رقم #{order.id}</p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">

          {/* Order info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-2xl p-3 print:border print:border-gray-200 print:bg-white">
              <p className="text-xs text-gray-500 font-medium mb-1">التاريخ</p>
              <p className="font-bold text-yaqut-primary text-sm">
                {new Date(order.createdAt).toLocaleDateString("ar-IQ", {
                  year: "numeric", month: "long", day: "numeric"
                })}
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-3 print:border print:border-gray-200 print:bg-white">
              <p className="text-xs text-gray-500 font-medium mb-1">الحالة</p>
              <p className="font-bold text-sm" style={{
                color: order.status === "delivered" ? "#065F46"
                  : order.status === "confirmed" ? "#1E40AF"
                  : order.status === "cancelled" ? "#991B1B" : "#92400E"
              }}>
                {STATUS_LABELS[order.status]}
              </p>
            </div>
          </div>

          {/* Customer info */}
          <div className="bg-gray-50 rounded-2xl p-4 print:border print:border-gray-200 print:bg-white space-y-2">
            <p className="text-xs font-black text-yaqut-muted uppercase tracking-wider mb-2">بيانات الزبون</p>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">الاسم</span>
              <span className="font-bold text-yaqut-primary">{order.customerName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">الهاتف</span>
              <span className="font-bold text-yaqut-primary" dir="ltr">{order.customerPhone}</span>
            </div>
            {order.governorate && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">المحافظة</span>
                <span className="font-bold text-yaqut-primary">{order.governorate}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">العنوان</span>
              <span className="font-bold text-yaqut-primary text-right max-w-[60%]">{order.address}</span>
            </div>
            {order.instagramUsername && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">انستقرام</span>
                <span className="font-bold text-pink-600" dir="ltr">@{order.instagramUsername}</span>
              </div>
            )}
            {order.notes && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">ملاحظات</span>
                <span className="font-medium text-yaqut-primary text-right max-w-[60%]">{order.notes}</span>
              </div>
            )}
          </div>

          {/* Items table */}
          <div>
            <p className="text-xs font-black text-yaqut-muted uppercase tracking-wider mb-3">تفاصيل الطلب</p>
            <div className="border border-gray-200 rounded-2xl overflow-hidden print:rounded-none">
              <table className="w-full text-sm">
                <thead className="bg-yaqut-primary text-white print:bg-gray-100 print:text-black">
                  <tr>
                    <th className="text-right px-3 py-2.5 font-bold">المنتج</th>
                    <th className="text-center px-3 py-2.5 font-bold">الكمية</th>
                    <th className="text-center px-3 py-2.5 font-bold">السعر</th>
                    <th className="text-left px-3 py-2.5 font-bold">الإجمالي</th>
                  </tr>
                </thead>
                <tbody>
                  {(order.items || []).map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-3 py-2.5 font-medium text-yaqut-primary">{item.name}</td>
                      <td className="px-3 py-2.5 text-center text-gray-600">{item.quantity}</td>
                      <td className="px-3 py-2.5 text-center text-gray-600">{Number(item.price).toLocaleString("ar-IQ")}</td>
                      <td className="px-3 py-2.5 text-left font-bold text-yaqut-primary">
                        {(item.price * item.quantity).toLocaleString("ar-IQ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="bg-gray-50 rounded-2xl p-4 print:border print:border-gray-200 print:bg-white space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">المنتجات</span>
              <span className="font-semibold">{itemsTotal.toLocaleString("ar-IQ")} د.ع</span>
            </div>
            {deliveryFee > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">رسوم التوصيل</span>
                <span className="font-semibold">{deliveryFee.toLocaleString("ar-IQ")} د.ع</span>
              </div>
            )}
            <div className="flex justify-between border-t border-gray-200 pt-2 mt-1">
              <span className="font-black text-yaqut-primary text-base">الإجمالي الكلي</span>
              <span className="font-black text-yaqut-gold text-xl">
                {Number(order.total).toLocaleString("ar-IQ")} د.ع
              </span>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 pt-2">
            شكراً لتعاملكم مع مكتبة الياقوت 💛
          </p>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="flex-1 bg-yaqut-primary text-white py-3 rounded-2xl font-black btn-press flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            طباعة الفاتورة
          </button>
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-2xl border-2 border-gray-200 text-gray-600 font-bold btn-press"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [updating, setUpdating] = useState<number | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);

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
                      {order.governorate && (
                        <span className="text-xs text-gray-400 font-medium">📍 {order.governorate}</span>
                      )}
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

                    {/* Instagram */}
                    {order.instagramUsername && (
                      <div>
                        <p className="text-xs font-bold text-yaqut-muted mb-1">انستقرام</p>
                        <a
                          href={`https://instagram.com/${order.instagramUsername}`}
                          target="_blank" rel="noopener noreferrer"
                          className="text-sm font-bold text-pink-600 hover:underline"
                          dir="ltr"
                        >
                          @{order.instagramUsername}
                        </a>
                      </div>
                    )}

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
                      <div className="space-y-1 mt-2 pt-2 border-t border-gray-200">
                        {Number(order.deliveryFee) > 0 && (
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>رسوم التوصيل ({order.governorate})</span>
                            <span>{Number(order.deliveryFee).toLocaleString("ar-IQ")} د.ع</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-sm font-bold text-yaqut-primary">الإجمالي الكلي</span>
                          <span className="text-sm font-black text-yaqut-gold">
                            {Number(order.total).toLocaleString("ar-IQ")} د.ع
                          </span>
                        </div>
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

                    {/* Actions row */}
                    <div className="flex gap-2 flex-wrap">
                      <a
                        href={`tel:${order.customerPhone}`}
                        className="flex items-center gap-2 bg-yaqut-primary text-white px-4 py-2.5 rounded-xl text-sm font-bold btn-press"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                        </svg>
                        اتصل بـ {order.customerName}
                      </a>

                      <button
                        onClick={() => setInvoiceOrder(order)}
                        className="flex items-center gap-2 bg-yaqut-gold text-yaqut-primary px-4 py-2.5 rounded-xl text-sm font-bold btn-press"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        فاتورة
                      </button>
                    </div>
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

      {/* Invoice Modal */}
      {invoiceOrder && (
        <InvoiceModal order={invoiceOrder} onClose={() => setInvoiceOrder(null)} />
      )}
    </div>
  );
}
