import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  Clock,
  Landmark,
  MessageCircle,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Truck,
  Zap,
} from "lucide-react";
import { getCatalog } from "@/lib/queries";
import { store, waLink, formatDZD, PAYMENT_METHODS } from "@/lib/site";
import { ProductCard } from "@/components/product-card";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { Faq } from "@/components/faq";
import { BrandMark } from "@/lib/brands";

export const dynamic = "force-dynamic";

const STEPS = [
  {
    icon: Sparkles,
    title: "اختر اشتراكك",
    text: "تصفّح المتجر واختر الخدمة والمدة التي تناسبك: شهر، 3 أشهر أو سنة كاملة.",
  },
  {
    icon: Smartphone,
    title: "أكّد طلبك وادفع",
    text: "املأ استمارة بسيطة، ثم حوّل المبلغ عبر CCP أو BaridiMob أو فليكسي.",
  },
  {
    icon: Zap,
    title: "استلم في دقائق",
    text: "أرسل إشعار الدفع على واتساب واستلم حسابك مفعّلاً خلال 5–30 دقيقة.",
  },
];

const STATS = [
  { value: "+12,500", label: "اشتراك تم تسليمه" },
  { value: "4.8/5", label: "تقييم زبائننا" },
  { value: "30 دقيقة", label: "أقصى مدة للتفعيل" },
  { value: "100%", label: "ضمان الاستبدال" },
];

export default async function HomePage() {
  const { cards, categories } = await getCatalog();
  const featured = cards.filter((c) => c.isFeatured).slice(0, 7);
  const heroFloaters = cards.slice(0, 5);
  const minPrice = cards.length ? Math.min(...cards.map((c) => c.minPrice)) : 0;

  return (
    <div>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-14 pb-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:pt-20">
          <div>
            <Reveal>
              <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold text-zinc-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                التفعيل متاح الآن — التسليم عبر واتساب
              </span>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="mt-6 text-4xl leading-[1.25] font-black tracking-tight text-white sm:text-5xl lg:text-[3.4rem]">
                كل اشتراكاتك الرقمية،
                <br />
                <span className="text-gradient">بنصف السعر.</span> تفعيل فوري،
                <br className="hidden sm:block" />
                وضمان كامل.
              </h1>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="mt-5 max-w-lg text-base leading-8 text-zinc-400 sm:text-lg">
                نتفليكس، Gemini Pro، Canva Pro، ChatGPT Plus، سبوتيفاي وأكثر —
                ادفع بالدينار عبر CCP أو BaridiMob واستلم حسابك على واتساب خلال
                دقائق، ابتداءً من{" "}
                <span className="font-black text-white">{formatDZD(minPrice)}</span>.
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/shop"
                  className="btn-glow group flex items-center gap-2 rounded-full bg-gradient-to-l from-violet-600 to-indigo-600 px-7 py-3.5 text-sm font-black text-white transition hover:brightness-110"
                >
                  تصفّح الاشتراكات
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                </Link>
                <a
                  href={waLink("مرحباً، أريد شراء اشتراك. ما العروض المتوفرة؟")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold text-zinc-200 transition hover:bg-white/8"
                >
                  <MessageCircle className="h-4 w-4 text-emerald-400" />
                  اطلب عبر واتساب
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.32}>
              <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {STATS.map((s) => (
                  <div key={s.label}>
                    <p className="text-xl font-black text-white sm:text-2xl">
                      {s.value}
                    </p>
                    <p className="mt-1 text-[11px] font-semibold text-zinc-500">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Hero visual */}
          <Reveal delay={0.15} className="relative hidden lg:block">
            <div className="relative">
              <div className="animate-pulse-glow absolute -inset-10 rounded-full bg-violet-600/20 blur-[100px]" />
              <div className="glass relative overflow-hidden rounded-[2rem] p-2">
                <Image
                  src="/images/hero.png"
                  alt="اشتراكات رقمية"
                  width={900}
                  height={700}
                  priority
                  className="h-auto w-full rounded-[1.6rem] object-cover"
                />
                <div className="absolute inset-2 rounded-[1.6rem] bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              </div>

              {heroFloaters.map((c, i) => (
                <div
                  key={c.slug}
                  className="animate-floaty absolute"
                  style={
                    {
                      animationDelay: `${i * 0.9}s`,
                      top: `${6 + i * 18}%`,
                      ...(i % 2 === 0
                        ? { right: "-22px" }
                        : { left: "-26px" }),
                    } as React.CSSProperties
                  }
                >
                  <div className="glass-strong flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 shadow-2xl">
                    <BrandMark brand={c.brand} className="h-8 w-8 rounded-lg" />
                    <div>
                      <p className="text-[11px] font-extrabold text-white">
                        {c.name}
                      </p>
                      <p className="text-[10px] font-bold text-emerald-300">
                        {formatDZD(c.minPrice)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Marquee */}
        <div className="marquee-mask border-y border-white/6 bg-white/[0.02] py-4" dir="ltr">
          <div className="animate-marquee flex w-max flex-row-reverse items-center gap-10">
            {[...cards, ...cards].map((c, i) => (
              <span
                key={`${c.slug}-${i}`}
                className="flex items-center gap-2.5 text-sm font-extrabold text-zinc-500 transition hover:text-white"
              >
                <BrandMark brand={c.brand} className="h-6 w-6 rounded-md" />
                {c.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURED ============ */}
      <section className="mx-auto max-w-6xl px-4 pt-20 sm:px-6">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-xs font-black tracking-widest text-violet-400">
                <Star className="h-3.5 w-3.5 fill-violet-400" />
                الأكثر طلباً
              </p>
              <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">
                اشتراكات يعشقها الزبائن
              </h2>
            </div>
            <Link
              href="/shop"
              className="group flex items-center gap-1.5 text-sm font-bold text-violet-300 transition hover:text-white"
            >
              عرض الكل
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/shop?category=${c.slug}`}
                className="glass rounded-full px-4 py-2 text-xs font-bold text-zinc-300 transition hover:border-violet-500/40 hover:text-white"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </Reveal>

        <Stagger className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <StaggerItem key={p.slug}>
              <ProductCard p={p} />
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* ============ STEPS ============ */}
      <section className="mx-auto max-w-6xl px-4 pt-24 sm:px-6">
        <Reveal>
          <div className="glass relative overflow-hidden rounded-[2rem] px-6 py-12 sm:px-12">
            <div className="absolute -top-32 left-1/2 h-64 w-[600px] -translate-x-1/2 rounded-full bg-violet-600/15 blur-[100px]" />
            <h2 className="relative text-center text-3xl font-black text-white sm:text-4xl">
              اطلب في <span className="text-gradient">3 خطوات</span> فقط
            </h2>
            <p className="relative mx-auto mt-3 max-w-xl text-center text-sm leading-7 text-zinc-400">
              بدون حسابات بنكية أجنبية وبدون بطاقات ائتمان — كل شيء محلي وبسيط.
            </p>

            <Stagger className="relative mt-10 grid gap-6 md:grid-cols-3">
              {STEPS.map((s, i) => (
                <StaggerItem key={s.title}>
                  <div className="glass relative h-full rounded-3xl p-6 text-center">
                    <span className="absolute top-5 left-5 text-4xl font-black text-white/8">
                      {i + 1}
                    </span>
                    <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/25 to-cyan-500/15 text-violet-300 ring-1 ring-violet-400/30">
                      <s.icon className="h-6.5 w-6.5" />
                    </span>
                    <h3 className="mt-4 text-lg font-extrabold text-white">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-zinc-400">
                      {s.text}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </Reveal>
      </section>

      {/* ============ PAYMENTS ============ */}
      <section className="mx-auto max-w-6xl px-4 pt-24 sm:px-6">
        <Reveal>
          <h2 className="text-center text-3xl font-black text-white sm:text-4xl">
            ادفع بالطريقة التي <span className="text-gradient-gold">تريحك</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-7 text-zinc-400">
            {store.deliveryPromise} — دفع محلي 100٪ بدون وسطاء.
          </p>
        </Reveal>

        <Stagger className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { icon: Landmark, ...PAYMENT_METHODS[0] },
            { icon: Smartphone, ...PAYMENT_METHODS[1] },
            { icon: Zap, ...PAYMENT_METHODS[2] },
          ].map((m) => (
            <StaggerItem key={m.id}>
              <div className="card-hover glass rounded-3xl p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-300 ring-1 ring-amber-400/25">
                  <m.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-base font-extrabold text-white">
                  {m.label}
                </h3>
                <p className="mt-1.5 text-[13px] leading-6 text-zinc-400">
                  {m.hint}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.1}>
          <div className="glass mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-2xl px-6 py-4 text-xs font-bold text-zinc-400">
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              ضمان استبدال طيلة الاشتراك
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-cyan-400" />
              {store.deliveryPromise}
            </span>
            <span className="flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 text-violet-400" />
              حسابات أصلية ومرخّصة
            </span>
            <span className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-amber-400" />
              تسليم رقمي — بدون شحن
            </span>
          </div>
        </Reveal>
      </section>

      {/* ============ FAQ ============ */}
      <section className="mx-auto max-w-3xl px-4 pt-24 sm:px-6">
        <Reveal>
          <h2 className="text-center text-3xl font-black text-white sm:text-4xl">
            أسئلة <span className="text-gradient">شائعة</span>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-center text-sm text-zinc-400">
            كل ما تحتاج معرفته قبل طلبك الأول.
          </p>
        </Reveal>
        <Reveal delay={0.1} className="mt-10">
          <Faq />
        </Reveal>
      </section>

      {/* ============ CTA ============ */}
      <section className="mx-auto max-w-6xl px-4 pt-24 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-violet-500/25 bg-gradient-to-l from-violet-950/60 via-[#12102a] to-cyan-950/40 px-6 py-14 text-center sm:px-12">
            <div className="animate-pulse-glow absolute -top-24 right-1/4 h-56 w-56 rounded-full bg-violet-500/25 blur-[90px]" />
            <div className="animate-pulse-glow absolute -bottom-24 left-1/4 h-56 w-56 rounded-full bg-cyan-400/20 blur-[90px]" />
            <h2 className="relative text-3xl font-black text-white sm:text-4xl">
              جاهز لتفعيل اشتراكك؟
            </h2>
            <p className="relative mx-auto mt-3 max-w-lg text-sm leading-7 text-zinc-300">
              راسلنا الآن على واتساب وسنرد عليك في دقائق، أو تصفّح المتجر واطلب
              بنفسك — التفعيل في الحالتين سريع ومضمون.
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
              <a
                href={waLink("مرحباً! أريد تفعيل اشتراك الآن.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-glow flex items-center gap-2 rounded-full bg-gradient-to-l from-violet-600 to-indigo-600 px-7 py-3.5 text-sm font-black text-white transition hover:brightness-110"
              >
                <MessageCircle className="h-4 w-4" />
                تحدث معنا الآن
              </a>
              <Link
                href="/shop"
                className="glass rounded-full px-7 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                تصفّح المتجر
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
