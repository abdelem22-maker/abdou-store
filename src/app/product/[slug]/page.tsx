import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, Check, ShieldCheck, Star, Clock, MessageCircle } from "lucide-react";
import { getProductBySlug } from "@/lib/queries";
import { BrandMark, brandOf } from "@/lib/brands";
import { store, waLink } from "@/lib/site";
import { ProductCard } from "@/components/product-card";
import { OrderPanel } from "@/components/order-panel";
import { Reveal } from "@/components/motion";
import { DbSetupGuide } from "@/components/db-setup-guide";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const data = await getProductBySlug(slug);
    if (!data) return { title: "غير موجود" };
    return {
      title: data.product.name,
      description: data.product.tagline,
    };
  } catch {
    return { title: "جارٍ الإعداد" };
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let data: Awaited<ReturnType<typeof getProductBySlug>>;
  try {
    data = await getProductBySlug(slug);
  } catch (e) {
    return <DbSetupGuide error={e} />;
  }
  if (!data) notFound();

  const { product, plans, category, related } = data;
  const accent = brandOf(product.brand).soft;

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
      <Link
        href="/shop"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-400 transition hover:text-white"
      >
        <ArrowRight className="h-3.5 w-3.5" />
        العودة إلى المتجر
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        {/* Brand panel */}
        <Reveal>
          <div className="glass relative overflow-hidden rounded-[2rem] p-8">
            <span
              aria-hidden
              className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full opacity-30 blur-[90px]"
              style={{ background: accent }}
            />
            <div className="relative">
              <div className="flex items-start justify-between">
                <BrandMark brand={product.brand} className="ring-glow h-20 w-20 rounded-3xl" />
                {product.badge && (
                  <span className="rounded-full bg-amber-400/10 px-3 py-1.5 text-xs font-bold text-amber-300 ring-1 ring-amber-400/30">
                    {product.badge}
                  </span>
                )}
              </div>

              <h1 className="mt-6 text-3xl font-black text-white">
                {product.name}
              </h1>
              <p className="mt-2 text-sm leading-7 text-zinc-400">
                {product.description}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
                <span className="flex items-center gap-1 font-black text-amber-300">
                  <Star className="h-4 w-4 fill-amber-300 text-amber-300" />
                  {product.rating.toFixed(1)}
                </span>
                <span className="font-semibold text-zinc-500">
                  +{product.salesCount.toLocaleString("en-US")} عملية شراء
                </span>
                {category && (
                  <span className="rounded-full bg-white/6 px-3 py-1 font-bold text-zinc-300">
                    {category.name}
                  </span>
                )}
              </div>

              <div className="mt-7 border-t border-white/8 pt-6">
                <h2 className="text-sm font-black text-white">ماذا ستحصل عليه؟</h2>
                <ul className="mt-4 space-y-3">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-zinc-300">
                      <span
                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                        style={{ background: `${accent}26`, color: accent }}
                      >
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-7 grid grid-cols-2 gap-3 text-center">
                <div className="glass rounded-2xl px-3 py-3.5">
                  <ShieldCheck className="mx-auto h-5 w-5 text-emerald-400" />
                  <p className="mt-1.5 text-[11px] font-bold text-zinc-300">
                    ضمان كامل طيلة الاشتراك
                  </p>
                </div>
                <div className="glass rounded-2xl px-3 py-3.5">
                  <Clock className="mx-auto h-5 w-5 text-cyan-400" />
                  <p className="mt-1.5 text-[11px] font-bold text-zinc-300">
                    {store.deliveryPromise}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Order panel */}
        <Reveal delay={0.1}>
          <OrderPanel
            product={{
              id: product.id,
              name: product.name,
              brand: product.brand,
            }}
            plans={plans.map((p) => ({
              id: p.id,
              label: p.label,
              months: p.months,
              priceDzd: p.priceDzd,
              compareAtDzd: p.compareAtDzd,
            }))}
          />
        </Reveal>
      </div>

      {/* WhatsApp alternative */}
      <Reveal delay={0.05}>
        <div className="glass mt-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl px-6 py-5">
          <div>
            <p className="text-sm font-extrabold text-white">
              تفضّل الطلب مباشرة بدون استمارة؟
            </p>
            <p className="mt-1 text-xs text-zinc-400">
              راسلنا على واتساب وسنرتّب كل شيء معك خطوة بخطوة.
            </p>
          </div>
          <a
            href={waLink(`مرحباً، أريد طلب ${product.name}. ما هي الخطوات؟`)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-emerald-500/15 px-5 py-3 text-sm font-black text-emerald-300 ring-1 ring-emerald-400/40 transition hover:bg-emerald-500/25"
          >
            <MessageCircle className="h-4.5 w-4.5" />
            اطلب عبر واتساب
          </a>
        </div>
      </Reveal>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16">
          <Reveal>
            <h2 className="text-2xl font-black text-white">قد يعجبك أيضاً</h2>
          </Reveal>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} p={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
