"use client";
import { useState, useEffect, useCallback } from "react";
import type { Ad } from "@/lib/api";
import { imageUrl } from "@/lib/api";

interface Props { ads: Ad[] }

export default function AdsCarousel({ ads }: Props) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback((idx: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(idx);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning]);

  const next = useCallback(() => {
    goTo((current + 1) % ads.length);
  }, [current, ads.length, goTo]);

  useEffect(() => {
    if (ads.length <= 1) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [ads.length, next]);

  /* ── Fallback hero when no ads ── */
  if (!ads.length) {
    return (
      <div className="relative w-full h-[260px] md:h-[520px] overflow-hidden bg-yaqut-primary">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-8 right-8 w-64 h-64 rounded-full bg-yaqut-gold blur-3xl" />
          <div className="absolute bottom-8 left-8 w-64 h-64 rounded-full bg-purple-400 blur-3xl" />
        </div>
        {/* Decorative circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[700px] md:h-[700px] rounded-full border border-white/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] md:w-[500px] md:h-[500px] rounded-full border border-white/5" />

        <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
          <div className="w-16 h-16 md:w-24 md:h-24 mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="مكتبة الياقوت" className="w-full h-full" style={{ filter: "invert(73%) sepia(54%) saturate(726%) hue-rotate(4deg) brightness(92%)" }} />
          </div>
          <h1 className="text-white font-black text-2xl md:text-5xl leading-tight">مكتبة الياقوت</h1>
          <p className="text-yaqut-gold font-semibold text-sm md:text-xl mt-2 md:mt-3 tracking-wide">
            مكتبة متكاملة لاحتياجاتك الدراسية والفنية
          </p>
          <p className="text-white/50 text-xs md:text-base mt-1">📍 البصرة – توصيل متوفر</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[260px] md:h-[520px] overflow-hidden bg-yaqut-primary select-none">
      {/* Slides */}
      {ads.map((ad, i) => {
        const src = imageUrl(ad.image);
        return (
          <div
            key={ad.id}
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
            style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
          >
            {src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src} alt={ad.title || `إعلان ${i + 1}`}
                className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-yaqut-primary to-yaqut-purple flex items-center justify-center">
                <span className="text-white text-2xl font-bold">{ad.title}</span>
              </div>
            )}
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            {/* Title overlay */}
            {ad.title && (
              <div className="absolute bottom-12 md:bottom-16 right-5 md:right-10 z-10"
                style={{ opacity: i === current ? 1 : 0, transition: "opacity 0.7s ease, transform 0.7s ease",
                  transform: i === current ? "translateY(0)" : "translateY(10px)" }}>
                <p className="text-white font-black text-lg md:text-3xl drop-shadow-lg">{ad.title}</p>
              </div>
            )}
          </div>
        );
      })}

      {/* Bottom dots */}
      {ads.length > 1 && (
        <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {ads.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-400 ${
                i === current ? "w-6 md:w-8 h-2 bg-yaqut-gold" : "w-2 h-2 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}

      {/* Arrow buttons — desktop */}
      {ads.length > 1 && (
        <>
          <button onClick={() => goTo((current - 1 + ads.length) % ads.length)}
            className="hidden md:flex absolute right-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm items-center justify-center text-white transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button onClick={next}
            className="hidden md:flex absolute left-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm items-center justify-center text-white transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}
