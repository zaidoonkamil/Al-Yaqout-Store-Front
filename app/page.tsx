import { api } from "@/lib/api";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import AdsCarousel from "@/components/AdsCarousel";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export const dynamic = "force-dynamic";

const GRADIENT_COLORS = [
  { from: "#1D4ED8", to: "#4F46E5" },
  { from: "#7C3AED", to: "#DB2777" },
  { from: "#0D9488", to: "#0284C7" },
  { from: "#D97706", to: "#DC2626" },
  { from: "#BE185D", to: "#9333EA" },
  { from: "#059669", to: "#0891B2" },
  { from: "#9333EA", to: "#0D9488" },
  { from: "#DC2626", to: "#D97706" },
];

const FEATURES = [
  { icon: "🚚", title: "توصيل سريع", desc: "لجميع مناطق البصرة" },
  { icon: "✅", title: "جودة مضمونة", desc: "منتجات أصلية 100%" },
  { icon: "💬", title: "دعم متواصل", desc: "نرد عليك في أي وقت" },
];

export default async function HomePage() {
  const [products, ads, categories] = await Promise.all([
    api.getProducts().catch(() => []),
    api.getAds().catch(() => []),
    api.getCategories().catch(() => []),
  ]);

  const latest   = products.slice(0, 8);
  const featured = products.slice(0, 4);

  return (
    <>
      <Navbar />
      <div className="pb-20 md:pb-0">

        {/* ══════════════════════════════════
            HERO CAROUSEL
        ══════════════════════════════════ */}
        <AdsCarousel ads={ads} />

        {/* ══════════════════════════════════
            INFO STRIP
        ══════════════════════════════════ */}
        <div className="bg-yaqut-primary/95">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between gap-4 overflow-x-auto carousel-container">
            <div className="flex items-center gap-6 flex-shrink-0">
              <div className="flex items-center gap-2 text-white/80 text-xs font-medium flex-shrink-0">
                <span className="text-yaqut-gold">🚚</span> توصيل لجميع مناطق البصرة
              </div>
              <div className="w-px h-4 bg-white/20 hidden md:block" />
              <div className="flex items-center gap-2 text-white/80 text-xs font-medium flex-shrink-0 hidden md:flex">
                <span className="text-yaqut-gold">✅</span> منتجات أصلية وعالية الجودة
              </div>
              <div className="w-px h-4 bg-white/20 hidden md:block" />
              <div className="flex items-center gap-2 text-white/80 text-xs font-medium flex-shrink-0 hidden md:flex">
                <span className="text-yaqut-gold">📞</span> 07839957101
              </div>
            </div>
            <a href="https://www.instagram.com/_alyaqout_library" target="_blank" rel="noopener noreferrer"
              className="flex-shrink-0 flex items-center gap-1.5 text-white/60 hover:text-white text-xs font-medium transition-colors">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
              _alyaqout_library
            </a>
          </div>
        </div>

        {/* ══════════════════════════════════
            MAIN CONTENT
        ══════════════════════════════════ */}
        <div className="max-w-7xl mx-auto px-4 md:px-8">

          {/* ── CATEGORIES ── */}
          <section className="mt-7 md:mt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-yaqut-primary font-black text-lg md:text-2xl">تسوق حسب الفئة</h2>
            </div>

            {/* Mobile: horizontal scroll / Desktop: grid */}
            <div className={`flex gap-3 overflow-x-auto carousel-container pb-2 md:grid md:overflow-visible`}
              style={{ gridTemplateColumns: categories.length > 0 ? `repeat(${Math.min(categories.length, 5)}, minmax(0, 1fr))` : undefined }}>
              {categories.map((cat, i) => {
                const colors = GRADIENT_COLORS[i % GRADIENT_COLORS.length];
                return (
                  <Link key={cat.id} href={`/products?cat=${encodeURIComponent(cat.name)}`}
                    className="flex-shrink-0 md:flex-shrink group btn-press">
                    <div className="w-24 md:w-full rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
                      <div className="h-20 md:h-28 flex flex-col items-center justify-center gap-2 relative"
                        style={{ background: `linear-gradient(135deg, ${colors.from}, ${colors.to})` }}>
                        <div className="absolute top-1 right-1 w-12 h-12 rounded-full bg-white/10" />
                        <div className="absolute bottom-1 left-1 w-8 h-8 rounded-full bg-white/10" />
                        <span className="text-2xl md:text-3xl relative z-10 drop-shadow">{cat.emoji}</span>
                        <span className="text-white font-black text-xs md:text-sm relative z-10">{cat.name}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* ── FEATURED BANNER ── */}
          {featured.length > 0 && (
            <section className="mt-8 md:mt-12">
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-l from-yaqut-primary via-[#2D1B69] to-[#4C1D95] p-6 md:p-10">
                {/* Decorative */}
                <div className="absolute top-0 left-0 w-40 h-40 rounded-full bg-yaqut-gold/10 blur-3xl" />
                <div className="absolute bottom-0 right-0 w-40 h-40 rounded-full bg-purple-400/10 blur-3xl" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div>
                    <p className="text-yaqut-gold font-bold text-sm tracking-widest uppercase mb-2">مكتبة الياقوت · البصرة</p>
                    <h2 className="text-white font-black text-2xl md:text-4xl leading-tight">
                      اكتشف أجمل<br className="md:hidden" /> المنتجات
                    </h2>
                    <p className="text-white/60 text-sm md:text-base mt-2">
                      مستلزمات رسم · قرطاسية · طباعة · وأكثر
                    </p>
                    <Link href="/products"
                      className="inline-flex items-center gap-2 mt-4 bg-yaqut-gold text-yaqut-primary px-6 py-3 rounded-2xl font-black text-sm btn-press shadow-gold">
                      تصفح المنتجات
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                    </Link>
                  </div>

                  {/* Mini product preview */}
                  <div className="flex gap-3 overflow-x-auto md:overflow-visible carousel-container">
                    {featured.map((p) => {
                      const img = p.image ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${p.image}` : null;
                      return (
                        <Link key={p.id} href={`/product/${p.id}`}
                          className="flex-shrink-0 w-20 md:w-24 btn-press">
                          <div className="aspect-square rounded-xl overflow-hidden bg-white/10 border border-white/20">
                            {img ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={img} alt={p.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-white/10">
                                <span className="text-white/40 text-2xl">📦</span>
                              </div>
                            )}
                          </div>
                          <p className="text-white/80 text-[10px] font-medium mt-1 text-center line-clamp-1">{p.name}</p>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ── LATEST PRODUCTS ── */}
          <section className="mt-10 md:mt-14">
            <div className="flex items-center justify-between mb-5 md:mb-7">
              <div>
                <h2 className="text-yaqut-primary font-black text-xl md:text-3xl">أحدث المنتجات</h2>
                <p className="text-yaqut-muted text-sm mt-0.5">اكتشف ما وصل جديد لمكتبتنا</p>
              </div>
              <Link href="/products"
                className="group flex items-center gap-1.5 bg-white border border-gray-200 hover:border-yaqut-purple hover:bg-purple-50 text-yaqut-purple px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 btn-press shadow-sm">
                عرض الكل
                <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
            </div>

            {latest.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-3xl shadow-card">
                <div className="w-20 h-20 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">📦</span>
                </div>
                <p className="text-yaqut-primary font-bold text-lg">لا توجد منتجات حالياً</p>
                <p className="text-yaqut-muted text-sm mt-1">سيتم إضافة المنتجات قريباً</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
                {latest.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </section>

          {/* ── FEATURES ── */}
          <section className="mt-10 md:mt-14">
            <div className="grid grid-cols-3 gap-3 md:gap-5">
              {FEATURES.map((f) => (
                <div key={f.title}
                  className="bg-white rounded-2xl p-4 md:p-6 shadow-card text-center hover:shadow-card-hover transition-all duration-300">
                  <div className="w-11 h-11 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-purple-50 to-amber-50 flex items-center justify-center mx-auto mb-3 text-2xl md:text-3xl">
                    {f.icon}
                  </div>
                  <p className="text-yaqut-primary font-black text-xs md:text-base">{f.title}</p>
                  <p className="text-yaqut-muted text-[10px] md:text-sm mt-0.5 hidden md:block">{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── CONTACT / CTA ── */}
          <section className="mt-8 md:mt-12">
            <div className="rounded-3xl bg-white shadow-card overflow-hidden">
              <div className="bg-gradient-to-l from-yaqut-primary to-yaqut-purple p-6 md:p-8 text-center">
                <p className="text-yaqut-gold font-bold text-xs tracking-widest mb-2">تواصل معنا</p>
                <h3 className="text-white font-black text-xl md:text-3xl">نحن هنا لمساعدتك</h3>
                <p className="text-white/60 text-sm mt-1">لديك سؤال؟ تواصل معنا مباشرة</p>
              </div>
              <div className="p-5 md:p-7 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                <a href="tel:07839957101"
                  className="flex items-center gap-3 p-4 rounded-2xl bg-yaqut-primary/5 hover:bg-yaqut-primary hover:text-white group transition-all duration-200 btn-press">
                  <div className="w-10 h-10 rounded-xl bg-yaqut-primary flex items-center justify-center flex-shrink-0 group-hover:bg-white/20">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-black text-yaqut-primary group-hover:text-white text-sm transition-colors">اتصل بنا</p>
                    <p className="text-yaqut-muted group-hover:text-white/70 text-xs transition-colors" dir="ltr">07839957101</p>
                  </div>
                </a>

                <a href="https://www.instagram.com/_alyaqout_library" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-2xl bg-pink-50 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 group transition-all duration-200 btn-press">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-black text-gray-700 group-hover:text-white text-sm transition-colors">انستقرام</p>
                    <p className="text-gray-400 group-hover:text-white/70 text-xs transition-colors">_alyaqout_library</p>
                  </div>
                </a>

                <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.013 3.5-4.697 3.5-8.318a6.5 6.5 0 00-13 0c0 3.62 1.556 6.305 3.5 8.318a19.579 19.579 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-black text-amber-700 text-sm">موقعنا</p>
                    <p className="text-amber-500/80 text-xs">البصرة – توصيل متوفر</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── FOOTER ── */}
          <footer className="mt-8 md:mt-10 pb-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-7 h-7">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.svg" alt="مكتبة الياقوت" className="w-full h-full" style={{ filter: "invert(9%) sepia(66%) saturate(1200%) hue-rotate(233deg) brightness(40%)" }} />
              </div>
              <span className="text-yaqut-primary font-black">مكتبة الياقوت</span>
            </div>
            <p className="text-yaqut-muted text-xs">© {new Date().getFullYear()} جميع الحقوق محفوظة · البصرة، العراق</p>
          </footer>

        </div>
      </div>
      <BottomNav />
    </>
  );
}
