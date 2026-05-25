"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart";

export default function Navbar() {
  const pathname = usePathname();
  const count = useCart((s) => s.getCount());
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (pathname.startsWith("/admin")) return null;

  const links = [
    { href: "/", label: "الرئيسية" },
    { href: "/products", label: "المنتجات" },
  ];

  return (
    <header
      className="sticky top-0 z-50 bg-yaqut-primary shadow-lg"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-14 md:h-16 flex items-center justify-between gap-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 btn-press flex-shrink-0">
          <div className="w-12 h-12 flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="مكتبة الياقوت" className="w-full h-full" style={{ filter: "invert(73%) sepia(54%) saturate(726%) hue-rotate(4deg) brightness(92%)" }} />
          </div>
          <div className="leading-none">
            <p className="text-white font-black text-[15px] tracking-wide">مكتبة الياقوت</p>
            <p className="text-yaqut-gold text-[10px] font-semibold tracking-widest opacity-80">AL-YAQUT · البصرة</p>
          </div>
        </Link>

        {/* Desktop nav links — hidden on mobile */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          {links.map((l) => {
            const isActive = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                  isActive
                    ? "bg-yaqut-gold text-yaqut-primary"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Phone — visible on all screens */}
          <a
            href="tel:07839957101"
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-2.5 py-2 rounded-xl text-xs md:text-sm font-semibold transition-colors btn-press"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
            </svg>
            <span>07839957101</span>
          </a>

          {/* Cart */}
          <Link href="/cart" className="relative btn-press">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors">
              <svg className="w-[22px] h-[22px] text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              {mounted && count > 0 && (
                <span className="pulse-badge absolute -top-0.5 -left-0.5 min-w-[18px] h-[18px] bg-yaqut-gold text-yaqut-primary text-[10px] font-black rounded-full flex items-center justify-center px-1">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </div>
          </Link>
        </div>

      </div>
    </header>
  );
}
