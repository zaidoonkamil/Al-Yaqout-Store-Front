"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.replace("/admin/login");
      return;
    }

    Promise.all([
      api.getProducts(),
      api.getOrders(1, token),
    ])
      .then(([products, ordersData]) => {
        const pending = ordersData.orders.filter((o) => o.status === "pending").length;
        const revenue = ordersData.orders.reduce((s, o) => s + Number(o.total), 0);
        setStats({
          totalProducts: products.length,
          totalOrders: ordersData.total,
          pendingOrders: pending,
          totalRevenue: revenue,
        });
      })
      .catch(() => router.replace("/admin/login"))
      .finally(() => setLoading(false));
  }, [router]);

  const statCards = [
    {
      label: "إجمالي المنتجات",
      value: stats.totalProducts,
      icon: "📦",
      color: "bg-purple-50 text-yaqut-purple",
      href: "/admin/products",
    },
    {
      label: "إجمالي الطلبات",
      value: stats.totalOrders,
      icon: "📋",
      color: "bg-blue-50 text-blue-600",
      href: "/admin/orders",
    },
    {
      label: "طلبات معلقة",
      value: stats.pendingOrders,
      icon: "⏳",
      color: "bg-amber-50 text-amber-600",
      href: "/admin/orders",
    },
    {
      label: "إيرادات (الصفحة الأولى)",
      value: stats.totalRevenue.toLocaleString("ar-IQ") + " د.ع",
      icon: "💰",
      color: "bg-green-50 text-green-600",
      href: "/admin/orders",
    },
  ];

  return (
    <div className="md:mr-56">
      <AdminSidebar />

      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 px-4 py-4 md:px-6">
        <h1 className="text-yaqut-primary font-black text-xl">لوحة التحكم</h1>
        <p className="text-yaqut-muted text-sm">مرحباً بك في إدارة مكتبة الياقوت</p>
      </header>

      <main className="p-4 md:p-6 pb-24 md:pb-6">
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-card animate-pulse h-24" />
            ))}
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {statCards.map((card) => (
                <Link
                  key={card.label}
                  href={card.href}
                  className="bg-white rounded-2xl p-4 shadow-card hover:shadow-card-hover transition-all btn-press"
                >
                  <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center text-xl mb-3`}>
                    {card.icon}
                  </div>
                  <p className="text-2xl font-black text-yaqut-primary">{card.value}</p>
                  <p className="text-yaqut-muted text-xs font-medium mt-0.5">{card.label}</p>
                </Link>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-4 shadow-card">
              <h2 className="font-bold text-yaqut-primary text-sm mb-4">إجراءات سريعة</h2>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/admin/products"
                  className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors btn-press"
                >
                  <span className="text-2xl">➕</span>
                  <span className="text-yaqut-purple font-bold text-sm">إضافة منتج</span>
                </Link>
                <Link
                  href="/admin/orders"
                  className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors btn-press"
                >
                  <span className="text-2xl">📋</span>
                  <span className="text-blue-600 font-bold text-sm">عرض الطلبات</span>
                </Link>
                <Link
                  href="/admin/ads"
                  className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors btn-press"
                >
                  <span className="text-2xl">🖼️</span>
                  <span className="text-amber-600 font-bold text-sm">إعلانات</span>
                </Link>
                <Link
                  href="/"
                  target="_blank"
                  className="flex items-center gap-3 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors btn-press"
                >
                  <span className="text-2xl">🏪</span>
                  <span className="text-green-600 font-bold text-sm">المتجر</span>
                </Link>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
