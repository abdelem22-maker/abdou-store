import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Cairo } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { store } from "@/lib/site";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: `${store.name} — اشتراكات رقمية أصلية بأفضل الأسعار`,
    template: `%s — ${store.name}`,
  },
  description:
    "متجر جزائري للاشتراكات الرقمية: Netflix، Gemini Pro، Canva Pro، ChatGPT Plus، Spotify والمزيد. دفع عبر CCP وBaridiMob، وتفعيل فوري عبر واتساب مع ضمان كامل.",
  keywords: [
    "اشتراكات رقمية الجزائر",
    "نتفليكس الجزائر",
    "Gemini Pro",
    "Canva Pro",
    "CCP",
    "BaridiMob",
  ],
};

export const viewport: Viewport = {
  themeColor: "#07070e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className="flex min-h-dvh flex-col font-sans">
        <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
          <div className="absolute -top-40 right-1/2 h-[480px] w-[820px] translate-x-1/2 rounded-full bg-violet-700/14 blur-[140px]" />
          <div className="absolute bottom-0 left-[-200px] h-[420px] w-[520px] rounded-full bg-cyan-500/8 blur-[140px]" />
        </div>
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
