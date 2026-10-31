"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, MessageCircle, Zap } from "lucide-react";
import { cn } from "@/lib/cn";
import { store, waLink } from "@/lib/site";

const LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/shop", label: "المتجر" },
  { href: "/track", label: "تتبّع طلبك" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled || open
          ? "glass-strong border-b border-white/8"
          : "border-b border-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="btn-glow flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-700 text-white transition-transform duration-300 group-hover:rotate-6">
            <Zap className="h-4.5 w-4.5" strokeWidth={2.2} />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-white">
            {store.shortName}
            <span className="text-violet-400">.</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => {
            const active =
              l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                  active
                    ? "bg-white/8 text-white"
                    : "text-zinc-400 hover:text-white"
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={waLink("مرحباً، أريد الاستفسار عن الاشتراكات المتوفرة.")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-glow hidden items-center gap-2 rounded-full bg-gradient-to-l from-violet-600 to-indigo-600 px-4 py-2 text-sm font-bold text-white transition hover:brightness-110 sm:flex"
          >
            <MessageCircle className="h-4 w-4" />
            تواصل معنا
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            className="glass flex h-10 w-10 items-center justify-center rounded-xl text-zinc-200 md:hidden"
            aria-label="القائمة"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-white/8 px-4 py-3 md:hidden">
          {LINKS.map((l) => {
            const active =
              l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "block rounded-xl px-4 py-3 text-sm font-bold",
                  active ? "bg-white/8 text-white" : "text-zinc-400"
                )}
              >
                {l.label}
              </Link>
            );
          })}
          <a
            href={waLink("مرحباً، أريد الاستفسار عن الاشتراكات المتوفرة.")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-violet-600 to-indigo-600 px-4 py-3 text-sm font-bold text-white"
          >
            <MessageCircle className="h-4 w-4" />
            تواصل معنا عبر واتساب
          </a>
        </nav>
      )}
    </header>
  );
}
