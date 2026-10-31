import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  CheckCircle2,
  Clock,
  MessageCircle,
  Landmark,
  Smartphone,
  Zap,
  Receipt,
  ShieldCheck,
} from "lucide-react";
import { getOrderByCode } from "@/lib/queries";
import { formatDZD, store, waLink } from "@/lib/site";
import { CopyField } from "@/components/copy-field";
import { Reveal } from "@/components/motion";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "تم استلام طلبك",
};

const METHOD_LABEL: Record<string, string> = {
  ccp: "تحويل CCP",
  baridimob: "BaridiMob / RIP",
  flexy: "فليكسي",
};

export default async function SuccessPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const data = await getOrderByCode(code);
  if (!data) notFound();

  const { order, items } = data;
  const item = items[0];
  const method = order.paymentMethod;

  const waMsg = `مرحباً، أنا ${order.customerName}.
طلبي رقم: ${order.code}
الاشتراك: ${item?.productName ?? ""} — ${item?.planLabel ?? ""}
المبلغ: ${formatDZD(order.totalDzd)}
طريقة الدفع: ${METHOD_LABEL[method] ?? method}
هذا إشعار الدفع:`;

  return (
    <div className="mx-auto max-w-3xl px-4 pt-14 sm:px-6">
      <Reveal>
        <div className="text-center">
          <span className="animate-pop-in mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15 ring-2 ring-emerald-400/40">
            <CheckCircle2 className="h-10 w-10 text-emerald-400" strokeWidth={1.8} />
          </span>
          <h1 className="mt-6 text-3xl font-black text-white sm:text-4xl">
            تم استلام طلبك بنجاح
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-zinc-400">
            شكراً {order.customerName}! بقيت خطوة أخيرة: أكمل الدفع بالمبلغ
            أدناه ثم أرسل الإشعار عبر واتساب ليتم التفعيل فوراً.
          </p>
        </div>
      </Reveal>

      {/* Order summary */}
      <Reveal delay={0.08}>
        <div className="glass mt-8 rounded-[2rem] p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/8 pb-5">
            <div>
              <p className="text-[11px] font-bold text-zinc-500">رقم الطلب</p>
              <p className="font-mono text-2xl font-black tracking-widest text-white" dir="ltr">
                {order.code}
              </p>
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-amber-400/10 px-3.5 py-1.5 text-xs font-black text-amber-300 ring-1 ring-amber-400/30">
              <Clock className="h-3.5 w-3.5" />
              في انتظار الدفع
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 py-5">
            <div className="flex items-center gap-3">
              <span className="glass flex h-11 w-11 items-center justify-center rounded-xl">
                <Receipt className="h-5 w-5 text-violet-300" />
              </span>
              <div>
                <p className="text-sm font-extrabold text-white">
                  {item?.productName}
                </p>
                <p className="text-xs text-zinc-500">المدة: {item?.planLabel}</p>
              </div>
            </div>
            <p className="text-xl font-black text-white" dir="ltr">
              {formatDZD(order.totalDzd)}
            </p>
          </div>

          {/* Payment instructions */}
          <div className="rounded-2xl border border-violet-500/25 bg-violet-500/6 p-5">
            <h2 className="flex items-center gap-2 text-sm font-black text-white">
              <Landmark className="h-4.5 w-4.5 text-violet-300" />
              تعليمات الدفع — {METHOD_LABEL[method] ?? method}
            </h2>

            <div className="mt-4 space-y-3">
              {(method === "ccp" || method === "flexy") && (
                <CopyField value={store.ccp} label="حوّل المبلغ إلى حساب CCP التالي:" />
              )}
              {(method === "baridimob" || method === "flexy") && (
                <CopyField value={store.rip} label="أو عبر BaridiMob إلى RIP:" />
              )}
              {method === "ccp" && (
                <CopyField value={store.rip} label="أو عبر BaridiMob (RIP) إن كان أسهل لك:" />
              )}
              {method === "flexy" && (
                <CopyField
                  value={store.whatsapp}
                  label="أو أرسل رصيد فليكسي إلى الرقم:"
                />
              )}
            </div>

            <p className="mt-4 text-[11px] leading-6 text-zinc-400">
              المبلغ المطلوب بالضبط:{" "}
              <span className="font-black text-white" dir="ltr">
                {formatDZD(order.totalDzd)}
              </span>{" "}
              — صوّر وصلة التحويل أو لقطة شاشة للإشعار.
            </p>
          </div>

          <a
            href={waLink(waMsg)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-glow mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-emerald-600 to-green-600 py-4 text-base font-black text-white transition hover:brightness-110"
          >
            <MessageCircle className="h-5 w-5" />
            أرسل إشعار الدفع عبر واتساب
          </a>

          <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] font-semibold text-zinc-500">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            رسالة واتساب جاهزة تلقائياً — أرفق فقط صورة الإشعار
          </p>
        </div>
      </Reveal>

      {/* Timeline */}
      <Reveal delay={0.12}>
        <div className="glass mt-6 rounded-[2rem] p-6 sm:p-8">
          <h2 className="text-sm font-black text-white">ماذا يحدث الآن؟</h2>
          <ol className="mt-5 space-y-5">
            {[
              {
                icon: Smartphone,
                title: "أرسل الإشعار",
                text: "اضغط زر واتساب أعلاه وأرفق صورة وصلة الدفع أو لقطة الشاشة.",
              },
              {
                icon: Zap,
                title: "نؤكد الدفع ونفعّل",
                text: `${store.deliveryPromise} — نراجع التحويل ونفعّل اشتراكك مباشرة.`,
              },
              {
                icon: CheckCircle2,
                title: "تستلم كل التفاصيل",
                text: "نرسل لك بيانات الدخول أو الدعوة على واتساب مع التعليمات.",
              },
            ].map((s, i) => (
              <li key={s.title} className="flex items-start gap-4">
                <span className="flex flex-col items-center">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-500/15 text-violet-300 ring-1 ring-violet-400/30">
                    <s.icon className="h-4.5 w-4.5" />
                  </span>
                  {i < 2 && <span className="mt-1 h-6 w-px bg-white/10" />}
                </span>
                <span className="pt-1">
                  <span className="block text-sm font-extrabold text-white">
                    {i + 1}. {s.title}
                  </span>
                  <span className="mt-1 block text-xs leading-6 text-zinc-400">
                    {s.text}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </Reveal>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/track"
          className="glass rounded-full px-6 py-3 text-sm font-bold text-zinc-200 transition hover:bg-white/8"
        >
          تتبّع حالة الطلب لاحقاً
        </Link>
        <Link
          href="/shop"
          className="glass rounded-full px-6 py-3 text-sm font-bold text-zinc-200 transition hover:bg-white/8"
        >
          مواصلة التسوق
        </Link>
      </div>
    </div>
  );
}
