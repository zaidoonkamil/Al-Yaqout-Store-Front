"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, type Category } from "@/lib/api";
import AdminSidebar from "@/components/AdminSidebar";

const EMOJI_SUGGESTIONS = ["📚","🎨","🖨️","🖊️","🎁","📖","🖍️","✏️","📐","📌","🗂️","📓","🖌️","🎀","📦","🔖","📝","💡","🃏","📜"];

export default function AdminCategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", emoji: "📦", sortOrder: "0" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : "";

  useEffect(() => {
    if (!token) { router.replace("/admin/login"); return; }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const load = () => {
    setLoading(true);
    api.getAllCategories(token)
      .then(setCategories)
      .catch(() => router.replace("/admin/login"))
      .finally(() => setLoading(false));
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", emoji: "📦", sortOrder: String(categories.length + 1) });
    setError("");
    setShowModal(true);
  };

  const openEdit = (c: Category) => {
    setEditing(c);
    setForm({ name: c.name, emoji: c.emoji, sortOrder: String(c.sortOrder) });
    setError("");
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError("اسم القسم مطلوب"); return; }
    setSubmitting(true);
    setError("");
    try {
      const data = { name: form.name.trim(), emoji: form.emoji, sortOrder: parseInt(form.sortOrder) || 0 };
      if (editing) {
        await api.updateCategory(editing.id, data, token);
      } else {
        await api.createCategory(data, token);
      }
      setShowModal(false);
      load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (cat: Category) => {
    try {
      const updated = await api.updateCategory(cat.id, { active: !cat.active }, token);
      setCategories((prev) => prev.map((c) => c.id === cat.id ? updated : c));
    } catch (err) {
      alert(err instanceof Error ? err.message : "فشل");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.deleteCategory(id, token);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      setDeleteId(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "فشل الحذف");
    }
  };

  return (
    <div className="md:mr-56">
      <AdminSidebar />

      <header className="bg-white border-b border-gray-200 px-4 py-4 md:px-6 flex items-center justify-between">
        <div>
          <h1 className="text-yaqut-primary font-black text-xl">الأقسام</h1>
          <p className="text-yaqut-muted text-sm">{categories.length} قسم</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-yaqut-purple text-white px-4 py-2 rounded-xl font-bold text-sm btn-press">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          إضافة قسم
        </button>
      </header>

      <main className="p-4 md:p-6 pb-24 md:pb-6">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5 text-sm text-amber-800 font-medium">
          💡 الأقسام تظهر في الصفحة الرئيسية وصفحة المنتجات. عطّل أي قسم لإخفائه بدون حذفه.
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-card animate-pulse h-16" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {categories.map((cat) => (
              <div key={cat.id}
                className={`bg-white rounded-2xl p-4 shadow-card flex items-center gap-3 transition-opacity ${!cat.active ? "opacity-50" : ""}`}>

                {/* Emoji */}
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-2xl flex-shrink-0">
                  {cat.emoji}
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <p className="font-black text-yaqut-primary">{cat.name}</p>
                  <p className="text-xs text-yaqut-muted">ترتيب: {cat.sortOrder}</p>
                </div>

                {/* Active toggle */}
                <button onClick={() => handleToggle(cat)}
                  className={`w-12 h-6 rounded-full flex items-center transition-colors flex-shrink-0 ${cat.active ? "bg-green-500" : "bg-gray-300"}`}>
                  <div className={`w-4 h-4 rounded-full bg-white shadow mx-1 transition-transform ${cat.active ? "translate-x-6" : "translate-x-0"}`} />
                </button>

                {/* Edit */}
                <button onClick={() => openEdit(cat)}
                  className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center btn-press hover:bg-blue-100 flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>

                {/* Delete */}
                <button onClick={() => setDeleteId(cat.id)}
                  className="w-9 h-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center btn-press hover:bg-red-100 flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end md:items-center justify-center p-4"
          onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-3xl w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-yaqut-primary font-black text-lg">
                  {editing ? "تعديل القسم" : "قسم جديد"}
                </h2>
                <button onClick={() => setShowModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 btn-press">✕</button>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Preview */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-3xl">
                    {form.emoji}
                  </div>
                  <div>
                    <p className="font-black text-yaqut-primary text-base">{form.name || "اسم القسم"}</p>
                    <p className="text-xs text-yaqut-muted">معاينة</p>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="text-sm font-bold text-yaqut-primary block mb-1">اسم القسم *</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-yaqut-purple"
                    placeholder="مثال: قرطاسية"
                  />
                </div>

                {/* Emoji picker */}
                <div>
                  <label className="text-sm font-bold text-yaqut-primary block mb-2">الإيموجي</label>
                  <input
                    value={form.emoji}
                    onChange={(e) => setForm((f) => ({ ...f, emoji: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-yaqut-purple mb-2 text-center text-2xl"
                    placeholder="📦"
                  />
                  <div className="flex flex-wrap gap-2">
                    {EMOJI_SUGGESTIONS.map((em) => (
                      <button key={em} type="button"
                        onClick={() => setForm((f) => ({ ...f, emoji: em }))}
                        className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all btn-press ${form.emoji === em ? "bg-yaqut-purple/20 ring-2 ring-yaqut-purple" : "bg-gray-100 hover:bg-gray-200"}`}>
                        {em}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort order */}
                <div>
                  <label className="text-sm font-bold text-yaqut-primary block mb-1">الترتيب</label>
                  <input
                    type="number"
                    value={form.sortOrder}
                    onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-yaqut-purple"
                    min="0"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)}
                    className="flex-1 border-2 border-gray-200 text-gray-600 py-3 rounded-xl font-bold btn-press">إلغاء</button>
                  <button type="submit" disabled={submitting}
                    className="flex-1 bg-yaqut-purple text-white py-3 rounded-xl font-bold btn-press disabled:opacity-60 flex items-center justify-center gap-2">
                    {submitting ? <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> : editing ? "حفظ" : "إضافة"}
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
            <p className="font-black text-yaqut-primary text-lg mb-2">حذف القسم؟</p>
            <p className="text-yaqut-muted text-sm mb-5">المنتجات المرتبطة بهذا القسم لن تُحذف</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 border-2 border-gray-200 py-2.5 rounded-xl font-bold btn-press text-sm">إلغاء</button>
              <button onClick={() => handleDelete(deleteId)}
                className="flex-1 bg-red-500 text-white py-2.5 rounded-xl font-bold btn-press text-sm">حذف</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
