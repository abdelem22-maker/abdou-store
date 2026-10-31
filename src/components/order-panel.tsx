"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BadgePercent,
  Check,
  ChevronDown,
  Landmark,
  Loader2,
  Smartphone,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { formatDZD, PAYMENT_METHODS } from "@/lib/site";
import { WILAYAS } from "@/lib/wilayas";

type PlanLite = {
  id: number;
  label: string;
  months: number;
  priceDzd: number;
  compareAtDzd: number | null;
};

const PAY_ICONS: Record<string, typeof Landmark> = {
  ccp: Landmark,
  baridimob: Smartphone,
  flexy: Zap,
};

export function OrderPanel({
  product,
  plans,
}: {
  product: { id: number; name: string; brand: string };
  plans: PlanLite[];
}) {
  const router = useRouter();
  const [planId, setPlanId] = useState(plans[0]?.id ?? 0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [wilaya, setWilaya] = useState("");
  const [payment, setPayment] = useState("ccp");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selected = useMemo(
    () => plans.find((p) => p.id === planId) ?? plans[0],
    [plans, planId]
  );

  const phoneValid = /^(05|06|07)\d{8}$/.test(phone.trim());
  const canSubmit =
    !loading &&
    !!selected &&
    name.trim().length >= 2 &&
    phoneValid &&
    wilaya.length > 0;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          planId: selected.id,
          customerName: name.trim(),
          phone: phone.trim(),
          wilaya,
          paymentMethod: payment,
          notes: notes.trim(),
        }),
      });
      const data = (await res.json()) as { code?: string; error?: string };
      if (!res.ok || !data.code) {
        setError(data.error ?? "حدث خطأ، حاول مجدداً.");
        setLoading(false);
        return;
      }
      router.push(`/success/${data.code}`);
    } catch {
      setError("تعذّر الاتصال بالخادم، تحقق من الإنترنت وحاول مجدداً.");
      setLoading(false);
    }
  }

  const perMonth =
    selected && selected.months > 0
      ? Math.round(selected.priceDzd / selected.months)
      : 0;

  return (
    <form
      onSubmit={submit}
      className="glass rounded-[2rem] p-6 sm:p-8"
      id="order"
    >
      <h2 className="text-xl font-black text-white">أتمم طلبك الآن</h2>
      <p className="mt-1 text-xs text-zinc-400">
        اختر المدة، أدخل معلوماتك، وادفع محلياً — التفعيل خلال دقائق.
      </p>

      {/* Plans */}
      <div className="mt-6 space-y-2.5">
        {plans.map((p) => {
          const active = p.id === planId;
          return (
            <button
              type="button"
              key={p.id}
              onClick={() => setPlanId(p.id)}
              className={cn(
                "flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 text-right transition-all",
                active
                  ? "border-violet-500/60 bg-violet-500/10 shadow-[0_0_30px_-10px_rgba(139,92,246,0.5)]"
                  : "border-white/8 bg-white/[0.03] hover:border-white/20"
              )}
            >
              <span className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full border-2 transition",
                    active
                      ? "border-violet-400 bg-violet-500 text-white"
                      : "border-zinc-600"
                  )}
                >
                  {active && <Check className="h-3 w-3" strokeWidth={3.5} />}
                </span>
                <span>
                  <span className="block text-sm font-extrabold text-white">
                    {p.label}
                  </span>
                  {p.compareAtDzd && (
                    <span className="mt-0.5 flex items-center gap-1 text-[10px] font-bold text-emerald-300">
                      <BadgePercent className="h-3 w-3" />
                      وفّر {formatDZD(p.compareAtDzd - p.priceDzd)}
                    </span>
                  )}
                </span>
              </span>
              <span className="text-left">
                <span className="block text-base font-black text-white" dir="ltr">
                  {formatDZD(p.priceDzd)}
                </span>
                {p.compareAtDzd && (
                  <span className="text-[11px] font-semibold text-zinc-500 line-through" dir="ltr">
                    {formatDZD(p.compareAtDzd)}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* Customer info */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-[11px] font-bold text-zinc-400">
            الاسم الكامل
          </label>
          <input
            className="input-dark text-sm"
            placeholder="مثال: أمين بوعلام"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[11px] font-bold text-zinc-400">
            رقم الهاتف (واتساب)
          </label>
          <input
            className="input-dark text-sm"
            placeholder="05/06/07 ××××××××"
            dir="ltr"
            inputMode="numeric"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
            required
          />
          {phone.length > 0 && !phoneValid && (
            <p className="mt-1 text-[10px] font-bold text-rose-400">
              الرقم يجب أن يبدأ بـ 05 أو 06 أو 07 ويتكوّن من 10 أرقام
            </p>
          )}
        </div>
        <div className="relative">
          <label className="mb-1.5 block text-[11px] font-bold text-zinc-400">
            الولاية
          </label>
          <select
            className="input-dark pl-9 text-sm"
            value={wilaya}
            onChange={(e) => setWilaya(e.target.value)}
            required
          >
            <option value="" disabled>
              اختر ولايتك
            </option>
            {WILAYAS.map((w, i) => (
              <option key={w} value={w}>
                {i + 1} — {w}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute bottom-3.5 left-3 h-4 w-4 text-zinc-500" />
        </div>
        <div>
          <label className="mb-1.5 block text-[11px] font-bold text-zinc-400">
            ملاحظة (اختياري)
          </label>
          <input
            className="input-dark text-sm"
            placeholder="أي تفاصيل إضافية..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>

      {/* Payment */}
      <div className="mt-6">
        <p className="mb-2.5 text-[11px] font-bold text-zinc-400">طريقة الدفع</p>
        <div className="grid grid-cols-3 gap-2.5">
          {PAYMENT_METHODS.map((m) => {
            const Icon = PAY_ICONS[m.id] ?? Zap;
            const active = payment === m.id;
            return (
              <button
                type="button"
                key={m.id}
                onClick={() => setPayment(m.id)}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-2xl border px-2 py-3.5 text-center transition",
                  active
                    ? "border-cyan-400/60 bg-cyan-400/10 text-white"
                    : "border-white/8 bg-white/[0.03] text-zinc-400 hover:border-white/20"
                )}
              >
                <Icon className={cn("h-5 w-5", active ? "text-cyan-300" : "text-zinc-500")} />
                <span className="text-[11px] font-black">{m.label}</span>
                <span className="hidden text-[9.5px] leading-4 text-zinc-500 sm:block">
                  {m.hint}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Total + submit */}
      <div className="mt-6 flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-5 py-4">
        <div>
          <p className="text-[11px] font-bold text-zinc-500">الإجمالي</p>
          <p className="text-2xl font-black text-white" dir="ltr">
            {selected ? formatDZD(selected.priceDzd) : "—"}
          </p>
        </div>
        {selected && selected.months > 1 && (
          <p className="text-left text-[11px] font-semibold leading-5 text-zinc-500">
            أي حوالي
            <span className="block text-sm font-black text-cyan-300" dir="ltr">
              {formatDZD(perMonth)} / شهر
            </span>
          </p>
        )}
      </div>

      {error && (
        <p className="mt-4 rounded-xl bg-rose-500/10 px-4 py-3 text-xs font-bold text-rose-300 ring-1 ring-rose-500/30">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        className={cn(
          "btn-glow mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-violet-600 to-indigo-600 py-4 text-base font-black text-white transition",
          canSubmit ? "hover:brightness-110" : "cursor-not-allowed opacity-50"
        )}
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            جارٍ إرسال طلبك...
          </>
        ) : (
          <>تأكيد الطلب — {selected ? formatDZD(selected.priceDzd) : ""}</>
        )}
      </button>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] font-semibold text-zinc-500">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
        لا تدفع الآن — تظهر لك تعليمات الدفع في الخطوة التالية
      </p>
    </form>
  );
}
