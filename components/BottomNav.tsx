"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart";

const navItems = [
  {
    href: "/",
    label: "الرئيسية",
    activeIcon: (
      <svg className="w-[26px] h-[26px]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-1.57-1.57V6.75a.75.75 0 00-.75-.75h-1.5a.75.75 0 00-.75.75v1.635L13.28 3.84a.75.75 0 00-1.06 0l-8.69 8.69a.75.75 0 001.06 1.06l.69-.69V19.5a.75.75 0 00.75.75H9a.75.75 0 00.75-.75v-4.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V19.5a.75.75 0 00.75.75h3.75a.75.75 0 00.75-.75v-5.01l.69.69a.75.75 0 001.06-1.06l-8.69-8.69z" />
      </svg>
    ),
    icon: (
      <svg className="w-[26px] h-[26px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    href: "/products",
    label: "المنتجات",
    activeIcon: (
      <svg className="w-[26px] h-[26px]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M5.25 2.25a3 3 0 00-3 3v4.318a3 3 0 00.879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a18.849 18.849 0 005.441-5.44c.758-1.16.492-2.629-.428-3.548L11.69 3.13A3 3 0 009.568 2.25H5.25z" />
        <path d="M6.375 7.5a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z" />
      </svg>
    ),
    icon: (
      <svg className="w-[26px] h-[26px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
      </svg>
    ),
  },
  {
    href: "/cart",
    label: "السلة",
    activeIcon: (
      <svg className="w-[26px] h-[26px]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
      </svg>
    ),
    icon: (
      <svg className="w-[26px] h-[26px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();
  const count = useCart((s) => s.getCount());
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Hide on pages that have their own fixed bottom action bar
  if (pathname.startsWith("/admin")) return null;
  if (pathname.startsWith("/product/")) return null;
  if (pathname === "/cart") return null;

  return (
    /* md:hidden — يختفي على الكمبيوتر، يظهر فقط على الموبايل */
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-gray-100"
      style={{
        boxShadow: "0 -2px 24px rgba(30,13,69,0.10)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="flex h-[60px]">
        {navItems.map((item) => {
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center gap-[3px] relative btn-press"
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-yaqut-primary rounded-b-full" />
              )}
              <div className={`transition-colors duration-200 ${isActive ? "text-yaqut-primary" : "text-gray-400"} relative`}>
                {isActive ? item.activeIcon : item.icon}
                {item.href === "/cart" && mounted && count > 0 && (
                  <span className="absolute -top-1.5 -left-1.5 min-w-[16px] h-4 bg-yaqut-gold text-yaqut-primary text-[9px] font-black rounded-full flex items-center justify-center px-0.5">
                    {count > 9 ? "9+" : count}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-bold transition-colors duration-200 ${isActive ? "text-yaqut-primary" : "text-gray-400"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
