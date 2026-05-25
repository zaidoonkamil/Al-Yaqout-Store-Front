"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { api, type Ad, imageUrl } from "@/lib/api";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminAdsPage() {
  const router = useRouter();
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [image, setImage] = useState<File | null>(null);
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
    api.getAllAds(token)
      .then(setAds)
      .catch(() => router.replace("/admin/login"))
      .finally(() => setLoading(false));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) { setError("الصورة مطلوبة"); return; }
    setSubmitting(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("image", image);
      if (title) fd.append("title", title);
      if (link) fd.append("link", link);
      await api.createAd(fd, token);
      setShowModal(false);
      setTitle(""); setLink(""); setImage(null);
      load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.deleteAd(id, token);
      setAds((prev) => prev.filter((a) => a.id !== id));
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
          <h1 className="text-yaqut-primary font-black text-xl">الإعلانات</h1>
          <p className="text-yaqut-muted text-sm">{ads.length} إعلان</p>
        </div>
        <button
          onClick={() => { setError(""); setShowModal(true); }}
          className="flex items-center gap-2 bg-yaqut-purple text-white px-4 py-2 rounded-xl font-bold text-sm btn-press"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          إضافة إعلان
        </button>
      </header>

      <main className="p-4 md:p-6 pb-24 md:pb-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-card animate-pulse">
                <div className="aspect-[16/7] bg-gray-200" />
                <div className="p-3 h-10" />
              </div>
            ))}
          </div>
        ) : ads.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-5xl">🖼️</span>
            <p className="text-yaqut-muted mt-3 font-medium">لا توجد إعلانات</p>
            <button onClick={() => setShowModal(true)} className="mt-4 bg-yaqut-purple text-white px-6 py-2.5 rounded-xl font-bold btn-press">
              أضف إعلان
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ads.map((ad) => {
              const img = imageUrl(ad.image);
              return (
                <div key={ad.id} className="bg-white rounded-2xl overflow-hidden shadow-card">
                  <div className="aspect-[16/7] bg-gray-100 relative overflow-hidden">
                    {img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={img} alt={ad.title || "إعلان"} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <svg className="w-12 h-12 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div className={`absolute top-2 left-2 w-2 h-2 rounded-full ${ad.active ? "bg-green-500" : "bg-gray-400"}`} />
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-yaqut-primary text-sm">{ad.title || "بدون عنوان"}</p>
                      <p className="text-xs text-yaqut-muted">{ad.active ? "نشط" : "غير نشط"}</p>
                    </div>
                    <button
                      onClick={() => setDeleteId(ad.id)}
                      className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 btn-press"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end md:items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-3xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-yaqut-primary font-black text-lg">إضافة إعلان</h2>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center btn-press">✕</button>
              </div>

              {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4"><p className="text-red-600 text-sm">{error}</p></div>}

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="text-sm font-bold text-yaqut-primary block mb-1">عنوان الإعلان (اختياري)</label>
                  <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-yaqut-purple" placeholder="عنوان الإعلان" />
                </div>
                <div>
                  <label className="text-sm font-bold text-yaqut-primary block mb-1">رابط (اختياري)</label>
                  <input value={link} onChange={(e) => setLink(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-yaqut-purple" placeholder="https://..." dir="ltr" />
                </div>
                <div>
                  <label className="text-sm font-bold text-yaqut-primary block mb-1">الصورة *</label>
                  <input ref={fileRef} type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} className="hidden" />
                  <button type="button" onClick={() => fileRef.current?.click()} className="w-full border-2 border-dashed border-gray-300 rounded-xl py-6 flex flex-col items-center gap-2 hover:border-yaqut-purple transition-colors btn-press">
                    {image ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={URL.createObjectURL(image)} alt="preview" className="w-full h-24 object-cover rounded-lg" />
                        <span className="text-xs text-yaqut-purple font-medium">{image.name}</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                        <span className="text-xs text-gray-400">اختر صورة الإعلان (نسبة 16:7 مثالية)</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 border-2 border-gray-200 py-3 rounded-xl font-bold btn-press text-sm">إلغاء</button>
                  <button type="submit" disabled={submitting} className="flex-1 bg-yaqut-purple text-white py-3 rounded-xl font-bold btn-press disabled:opacity-60 flex items-center justify-center gap-2 text-sm">
                    {submitting ? <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> : "إضافة"}
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
            <h3 className="font-black text-yaqut-primary text-lg mb-2">حذف الإعلان؟</h3>
            <p className="text-yaqut-muted text-sm mb-5">لا يمكن التراجع عن هذا الإجراء.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 border-2 border-gray-200 py-2.5 rounded-xl font-bold btn-press text-sm">إلغاء</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 bg-red-500 text-white py-2.5 rounded-xl font-bold btn-press text-sm">حذف</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
