"use client";

import { useState } from "react";
import {
  CheckCircle2,
  CircleDashed,
  Loader2,
  Search,
  XCircle,
  PackageCheck,
  Banknote,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { formatDZD, STATUS_LABELS } from "@/lib/site";

type TrackResult = {
  code: string;
  status: string;
  customerName: string;
  paymentMethod: string;
  totalDzd: number;
  createdAt: string;
  items: { productName: string; planLabel: string }[];
};

const STEPS = [
  { key: "pending", label: "في انتظار الدفع", icon: CircleDashed },
  { key: "paid", label: "تم تأكيد الدفع", icon: Banknote },
  { key: "delivered", label: "تم التسليم", icon: PackageCheck },
];

export function TrackForm() {
  const [code, setCode] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TrackResult | null>(null);

  async function search(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(
        `/api/orders?code=${encodeURIComponent(code.trim())}&phone=${encodeURIComponent(phone.trim())}`
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "لم نجد الطلب.");
      } else {
        setResult(data as TrackResult);
      }
    } catch {
      setError("تعذّر الاتصال، حاول مجدداً.");
    }
    setLoading(false);
  }

  const cancelado = result?.status === "cancelled";
  const activeIdx = STEPS.findIndex((s) => s.key === result?.status);

  return (
    <div className="mt-9">
      <form onSubmit={search} className="glass rounded-[2rem] p-6 sm:p-8">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-[11px] font-bold text-zinc-400">
              رقم الطلب
            </label>
            <input
              className="input-dark font-mono text-sm tracking-widest uppercase"
              dir="ltr"
              placeholder="مثال: 4X9K2P"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 6))}
              required
              minLength={4}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-bold text-zinc-400">
              رقم الهاتف
            </label>
            <input
              className="input-dark text-sm"
              dir="ltr"
              inputMode="numeric"
              placeholder="05/06/07 ××××××××"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              required
            />
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-xl bg-rose-500/10 px-4 py-3 text-xs font-bold text-rose-300 ring-1 ring-rose-500/30">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-glow mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-violet-600 to-indigo-600 py-3.5 text-sm font-black text-white transition hover:brightness-110 disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="h-4.5 w-4.5 animate-spin" />
          ) : (
            <Search className="h-4.5 w-4.5" />
          )}
          ابحث عن طلبي
        </button>
      </form>

      {result && (
        <div className="glass animate-pop-in mt-6 rounded-[2rem] p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold text-zinc-500">
                مرحباً {result.customerName}
              </p>
              <p className="font-mono text-xl font-black tracking-widest text-white" dir="ltr">
                {result.code}
              </p>
            </div>
            <span
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-black ring-1",
                cancelado
                  ? "bg-rose-500/10 text-rose-300 ring-rose-500/30"
                  : result.status === "delivered"
                    ? "bg-emerald-500/10 text-emerald-300 ring-emerald-500/30"
                    : result.status === "paid"
                      ? "bg-cyan-400/10 text-cyan-300 ring-cyan-400/30"
                      : "bg-amber-400/10 text-amber-300 ring-amber-400/30"
              )}
            >
              {cancelado ? <XCircle className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
              {STATUS_LABELS[result.status] ?? result.status}
            </span>
          </div>

          <div className="mt-5 space-y-1.5 text-sm text-zinc-300">
            {result.items.map((it, i) => (
              <div key={i} className="flex items-center justify-between gap-3 rounded-xl bg-white/[0.03] px-4 py-3">
                <span className="font-bold text-white">{it.productName}</span>
                <span className="text-xs text-zinc-500">{it.planLabel}</span>
              </div>
            ))}
          </div>

          <p className="mt-4 text-sm font-black text-white" dir="ltr">
            {formatDZD(result.totalDzd)}
          </p>

          {/* Timeline */}
          {cancelado ? (
            <p className="mt-6 rounded-xl bg-rose-500/8 px-4 py-3 text-xs leading-6 text-rose-300">
              هذا الطلب ملغي. إن كان ذلك خطأ، تواصل معنا عبر واتساب مع ذكر رقم
              الطلب وسنحلّ الأمر فوراً.
            </p>
          ) : (
            <ol className="mt-6 space-y-0">
              {STEPS.map((s, i) => {
                const done = activeIdx >= i;
                const current = activeIdx === i;
                return (
                  <li key={s.key} className="flex items-start gap-4">
                    <span className="flex flex-col items-center">
                      <span
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-full ring-1 transition",
                          done
                            ? "bg-violet-500/20 text-violet-300 ring-violet-400/40"
                            : "bg-white/4 text-zinc-600 ring-white/10"
                        )}
                      >
                        <s.icon className="h-4.5 w-4.5" />
                      </span>
                      {i < STEPS.length - 1 && (
                        <span
                          className={cn(
                            "h-7 w-px",
                            activeIdx > i ? "bg-violet-400/50" : "bg-white/10"
                          )}
                        />
                      )}
                    </span>
                    <span className="pt-2">
                      <span
                        className={cn(
                          "block text-sm font-extrabold",
                          done ? "text-white" : "text-zinc-600"
                        )}
                      >
                        {s.label}
                      </span>
                      {current && s.key === "pending" && (
                        <span className="mt-1 block text-[11px] leading-5 text-zinc-500">
                          أكمل الدفع وأرسل الإشعار عبر واتساب إن لم تفعل بعد.
                        </span>
                      )}
                      {current && s.key === "paid" && (
                        <span className="mt-1 block text-[11px] leading-5 text-zinc-500">
                          الدفع مؤكد — التفعيل جارٍ، ستصلك التفاصيل على واتساب.
                        </span>
                      )}
                    </span>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      )}
    </div>
  );
}
