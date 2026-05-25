import type { Metadata, Viewport } from "next";
import "./globals.css";
import PWARegister from "@/components/PWARegister";

export const metadata: Metadata = {
  title: "مكتبة الياقوت",
  description: "مكتبة متكاملة لاحتياجاتك الدراسية والفنية | مستلزمات رسم | مستلزمات طباعة | البصرة",
  keywords: "مكتبة الياقوت, مستلزمات رسم, مستلزمات طباعة, كتب, البصرة",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "الياقوت",
  },
  openGraph: {
    title: "مكتبة الياقوت",
    description: "مكتبة متكاملة لاحتياجاتك الدراسية والفنية",
    locale: "ar_IQ",
    type: "website",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1E0D45",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="الياقوت" />
      </head>
      <body className="font-cairo antialiased">
        <PWARegister />
        {children}
      </body>
    </html>
  );
}
