"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { STATUS_LABELS } from "@/lib/site";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-400/10 text-amber-300 ring-amber-400/30",
  paid: "bg-cyan-400/10 text-cyan-300 ring-cyan-400/30",
  delivered: "bg-emerald-500/10 text-emerald-300 ring-emerald-500/30",
  cancelled: "bg-rose-500/10 text-rose-300 ring-rose-500/30",
};

export function AdminStatusSelect({
  code,
  status,
  adminKey,
}: {
  code: string;
  status: string;
  adminKey: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState(false);

  async function update(next: string) {
    setValue(next);
    setError(false);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({ code, status: next }),
      });
      if (!res.ok) {
        setError(true);
        setValue(status);
      } else {
        startTransition(() => router.refresh());
      }
    } catch {
      setError(true);
      setValue(status);
    }
  }

  return (
    <span className="inline-flex items-center gap-1.5">
      <select
        value={value}
        onChange={(e) => update(e.target.value)}
        className={cn(
          "cursor-pointer rounded-full px-3 py-1.5 text-[11px] font-black ring-1 outline-none",
          STATUS_STYLES[value] ?? "bg-white/5 text-zinc-300 ring-white/15"
        )}
      >
        {Object.entries(STATUS_LABELS).map(([k, v]) => (
          <option key={k} value={k} className="bg-[#12131f] text-white">
            {v}
          </option>
        ))}
      </select>
      {pending && <Loader2 className="h-3.5 w-3.5 animate-spin text-zinc-500" />}
      {error && <span className="text-[10px] font-bold text-rose-400">فشل!</span>}
    </span>
  );
}
