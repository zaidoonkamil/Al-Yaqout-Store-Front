import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "لوحة التحكم | مكتبة الياقوت",
  robots: "noindex",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-gray-50 font-cairo">{children}</div>;
}
