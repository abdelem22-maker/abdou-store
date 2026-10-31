import Link from "next/link";
import { Star, Flame, ChevronLeft } from "lucide-react";
import { BrandMark, brandOf } from "@/lib/brands";
import { formatDZD } from "@/lib/site";

export type ProductCardData = {
  slug: string;
  name: string;
  brand: string;
  tagline: string;
  badge: string | null;
  rating: number;
  salesCount: number;
  categoryName: string;
  minPrice: number;
  minMonths: number;
};

export function ProductCard({ p }: { p: ProductCardData }) {
  const accent = brandOf(p.brand).soft;
  const unit = p.minMonths <= 1 ? "شهرياً" : `لـ ${p.minMonths} أشهر`;

  return (
    <Link
      href={`/product/${p.slug}`}
      className="card-hover group glass relative flex flex-col overflow-hidden rounded-3xl p-5"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-24 h-48 w-48 rounded-full opacity-25 blur-3xl transition-opacity duration-500 group-hover:opacity-50"
        style={{ background: accent }}
      />

      <div className="flex items-start justify-between">
        <BrandMark brand={p.brand} className="h-14 w-14" />
        {p.badge && (
          <span className="flex items-center gap-1 rounded-full bg-amber-400/10 px-2.5 py-1 text-[11px] font-bold text-amber-300 ring-1 ring-amber-400/30">
            <Flame className="h-3 w-3" />
            {p.badge}
          </span>
        )}
      </div>

      <h3 className="mt-4 text-lg font-extrabold text-white">{p.name}</h3>
      <p className="mt-1 line-clamp-2 text-[13px] leading-6 text-zinc-400">
        {p.tagline}
      </p>

      <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
        <span className="flex items-center gap-1 font-bold text-amber-300">
          <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
          {p.rating.toFixed(1)}
        </span>
        <span aria-hidden>•</span>
        <span>+{p.salesCount.toLocaleString("en-US")} عملية شراء</span>
        <span aria-hidden>•</span>
        <span className="rounded-full bg-white/6 px-2 py-0.5 text-[11px] font-semibold text-zinc-300">
          {p.categoryName}
        </span>
      </div>

      <div className="mt-5 flex items-end justify-between border-t border-white/6 pt-4">
        <div>
          <p className="text-[11px] font-semibold text-zinc-500">ابتداءً من</p>
          <p className="text-lg font-black text-white">
            {formatDZD(p.minPrice)}
            <span className="mr-1 text-[11px] font-semibold text-zinc-500">
              / {unit}
            </span>
          </p>
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/6 text-zinc-300 transition-all duration-300 group-hover:bg-violet-600 group-hover:text-white">
          <ChevronLeft className="h-4.5 w-4.5" />
        </span>
      </div>
    </Link>
  );
}
