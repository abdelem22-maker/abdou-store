"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/cn";

export function CopyField({
  value,
  label,
  ltr = true,
  className,
}: {
  value: string;
  label?: string;
  ltr?: boolean;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = value;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className={className}>
      {label && (
        <p className="mb-1.5 text-[11px] font-bold text-zinc-500">{label}</p>
      )}
      <div className="glass flex items-center gap-2 rounded-xl px-3 py-2.5">
        <span
          dir={ltr ? "ltr" : "rtl"}
          className="flex-1 truncate font-mono text-sm font-bold tracking-wide text-white"
        >
          {value}
        </span>
        <button
          onClick={copy}
          className={cn(
            "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition",
            copied
              ? "bg-emerald-500/15 text-emerald-300"
              : "bg-white/8 text-zinc-300 hover:bg-white/12 hover:text-white"
          )}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          {copied ? "تم النسخ" : "نسخ"}
        </button>
      </div>
    </div>
  );
}
