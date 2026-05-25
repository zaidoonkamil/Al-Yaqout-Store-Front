"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { api, type Product, imageUrl } from "@/lib/api";
import AdminSidebar from "@/components/AdminSidebar";

const CATEGORIES = ["كتب", "رسم", "طباعة", "قرطاسية", "هدايا", "أخرى"];

interface FormState {
  name: string;
  description: string;
  price: string;
  category: string;
  inStock: boolean;
  image: File | null;
}

const emptyForm: FormState = {
  name: "",
  description: "",
  price: "",
  category: "",
  inStock: true,
  image: null,
};

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : "";

  useEffect(() => {
    if (!token) { router.replace("/admin/login"); return; }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const load = () => {
    setLoading(true);
    api.getProducts()
      .then(setProducts)
      .catch(() => router.replace("/admin/login"))
      .finally(() => setLoading(false));
  };

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setShowModal(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name,
      description: p.description || "",
      price: String(p.price),
      category: p.category || "",
      inStock: p.inStock,
      image: null,
    });
    setError("");
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) { setError("الاسم والسعر مطلوبان"); return; }
    setSubmitting(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description);
      fd.append("price", form.price);
      fd.append("category", form.category);
      fd.append("inStock", String(form.inStock));
      if (form.image) fd.append("image", form.image);

      if (editing) {
        await api.updateProduct(editing.id, fd, token);
      } else {
        await api.createProduct(fd, token);
      }
      setShowModal(false);
      load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.deleteProduct(id, token);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setDeleteId(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "فشل الحذف");
    }
  };

  return (
    <div className="md:mr-56">
      <AdminSidebar />

      <header className="bg-white border-b border-gray-200 px-4 py-4 md:px-6 flex items-center justify-between">
        <div>
          <h1 className="text-yaqut-primary font-black text-xl">المنتجات</h1>
          <p className="text-yaqut-muted text-sm">{products.length} منتج</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-yaqut-purple text-white px-4 py-2 rounded-xl font-bold text-sm btn-press"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          إضافة منتج
        </button>
      </header>

      <main className="p-4 md:p-6 pb-24 md:pb-6">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-card animate-pulse">
                <div className="aspect-square bg-gray-200" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-5xl">📦</span>
            <p className="text-yaqut-muted mt-3 font-medium">لا توجد منتجات</p>
            <button onClick={openAdd} className="mt-4 bg-yaqut-purple text-white px-6 py-2.5 rounded-xl font-bold btn-press">
              أضف أول منتج
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {products.map((p) => {
              const img = imageUrl(p.image);
              return (
                <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-card">
                  <div className="aspect-square bg-gray-50 overflow-hidden relative">
                    {img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={img} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <svg className="w-10 h-10 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    {!p.inStock && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        نفذ
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="font-bold text-yaqut-primary text-sm line-clamp-1">{p.name}</p>
                    <p className="text-yaqut-gold font-black text-sm mt-0.5">
                      {Number(p.price).toLocaleString("ar-IQ")} د.ع
                    </p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => openEdit(p)}
                        className="flex-1 bg-blue-50 text-blue-600 py-1.5 rounded-lg text-xs font-bold btn-press hover:bg-blue-100"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => setDeleteId(p.id)}
                        className="flex-1 bg-red-50 text-red-500 py-1.5 rounded-lg text-xs font-bold btn-press hover:bg-red-100"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end md:items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div
            className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-yaqut-primary font-black text-lg">
                  {editing ? "تعديل المنتج" : "إضافة منتج جديد"}
                </h2>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 btn-press">
                  ✕
                </button>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="text-sm font-bold text-yaqut-primary block mb-1">اسم المنتج *</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-yaqut-purple"
                    placeholder="أدخل اسم المنتج"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-yaqut-primary block mb-1">الوصف</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-yaqut-purple resize-none"
                    placeholder="وصف المنتج..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-bold text-yaqut-primary block mb-1">السعر (د.ع) *</label>
                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-yaqut-purple"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-yaqut-primary block mb-1">الفئة</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-yaqut-purple bg-white"
                    >
                      <option value="">اختر...</option>
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div
                      onClick={() => setForm((f) => ({ ...f, inStock: !f.inStock }))}
                      className={`w-12 h-6 rounded-full transition-colors flex items-center ${form.inStock ? "bg-green-500" : "bg-gray-300"}`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform mx-0.5 ${form.inStock ? "translate-x-6" : "translate-x-0"}`} />
                    </div>
                    <span className="text-sm font-semibold text-yaqut-primary">
                      {form.inStock ? "متوفر في المخزن" : "غير متوفر"}
                    </span>
                  </label>
                </div>

                <div>
                  <label className="text-sm font-bold text-yaqut-primary block mb-1">
                    الصورة {editing ? "(اتركه فارغاً للإبقاء على الصورة الحالية)" : ""}
                  </label>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => setForm((f) => ({ ...f, image: e.target.files?.[0] || null }))}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="w-full border-2 border-dashed border-gray-300 rounded-xl py-6 flex flex-col items-center gap-2 hover:border-yaqut-purple transition-colors btn-press"
                  >
                    {form.image ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={URL.createObjectURL(form.image)}
                          alt="preview"
                          className="w-20 h-20 object-cover rounded-xl"
                        />
                        <span className="text-xs text-yaqut-purple font-medium">{form.image.name}</span>
                      </>
                    ) : editing?.image ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imageUrl(editing.image) || ""}
                          alt="current"
                          className="w-20 h-20 object-cover rounded-xl"
                        />
                        <span className="text-xs text-gray-400">انقر لتغيير الصورة</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                        <span className="text-xs text-gray-400">اختر صورة</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 border-2 border-gray-200 text-gray-600 py-3 rounded-xl font-bold btn-press"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-yaqut-purple text-white py-3 rounded-xl font-bold btn-press disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : editing ? "حفظ التغييرات" : "إضافة المنتج"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
              <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h3 className="font-black text-yaqut-primary text-lg mb-1">تأكيد الحذف</h3>
            <p className="text-yaqut-muted text-sm mb-5">هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 border-2 border-gray-200 py-2.5 rounded-xl font-bold btn-press text-sm">
                إلغاء
              </button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 bg-red-500 text-white py-2.5 rounded-xl font-bold btn-press text-sm">
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
