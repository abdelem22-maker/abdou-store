import Link from "next/link";
import type { Metadata } from "next";
import { LayoutGrid } from "lucide-react";
import { getCatalog } from "@/lib/queries";
import { ProductCard } from "@/components/product-card";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { cn } from "@/lib/cn";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "المتجر — كل الاشتراكات",
  description: "تصفّح كل الاشتراكات الرقمية المتوفرة بأفضل الأسعار في الجزائر.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const { cards, categories } = await getCatalog();

  const usedSlugs = new Set(cards.map((c) => c.categorySlug));
  const visibleCats = categories.filter((c) => usedSlugs.has(c.slug));
  const filtered = category
    ? cards.filter((c) => c.categorySlug === category)
    : cards;
  const activeCat = visibleCats.find((c) => c.slug === category);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6">
      <Reveal>
        <p className="flex items-center gap-2 text-xs font-black tracking-widest text-violet-400">
          <LayoutGrid className="h-3.5 w-3.5" />
          المتجر
        </p>
        <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">
          {activeCat ? activeCat.name : "كل الاشتراكات"}
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          {filtered.length} اشتراك متاح — اختر واطلب في أقل من دقيقتين.
        </p>
      </Reveal>

      <Reveal delay={0.06}>
        <div className="mt-7 flex flex-wrap gap-2">
          <Link
            href="/shop"
            className={cn(
              "rounded-full px-4 py-2 text-xs font-bold transition",
              !category
                ? "bg-gradient-to-l from-violet-600 to-indigo-600 text-white btn-glow"
                : "glass text-zinc-300 hover:text-white"
            )}
          >
            الكل
          </Link>
          {visibleCats.map((c) => (
            <Link
              key={c.slug}
              href={`/shop?category=${c.slug}`}
              className={cn(
                "rounded-full px-4 py-2 text-xs font-bold transition",
                category === c.slug
                  ? "bg-gradient-to-l from-violet-600 to-indigo-600 text-white btn-glow"
                  : "glass text-zinc-300 hover:text-white"
              )}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </Reveal>

      {filtered.length === 0 ? (
        <div className="glass mt-10 rounded-3xl p-12 text-center text-sm text-zinc-400">
          لا توجد اشتراكات في هذا التصنيف حالياً.
        </div>
      ) : (
        <Stagger className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <StaggerItem key={p.slug}>
              <ProductCard p={p} />
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </div>
  );
}
