"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

const FAQS = [
  {
    q: "كيف أستلم اشتراكي بعد الطلب؟",
    a: "بعد تأكيد طلبك وإرسال إشعار الدفع عبر واتساب، نفعّل اشتراكك خلال 5 إلى 30 دقيقة ونرسل لك كل التفاصيل (بيانات الدخول أو الدعوة) على واتساب مباشرة.",
  },
  {
    q: "ما هي طرق الدفع المتوفرة؟",
    a: "نقبل التحويل عبر CCP (بريد الجزائر)، BaridiMob عبر رقم RIP، أو فليكسي (رصيد الهاتف). تجد كل الأرقام في صفحة تأكيد الطلب مباشرة بعد إتمامه.",
  },
  {
    q: "هل الاشتراكات أصلية ومضمونة؟",
    a: "نعم، كل اشتراكاتنا رسمية ومضمونة 100٪ طيلة مدة الاشتراك. إذا حدث أي إشكال في الحساب نعوّضك فوراً بحساب جديد أو نسترجع لك المبلغ.",
  },
  {
    q: "هل التفعيل يكون على حسابي الشخصي؟",
    a: "حسب الخدمة: بعض الاشتراكات مثل Canva Pro وYouTube Premium وSpotify تُفعَّل على بريدك مباشرة، وأخرى مثل Netflix تحصل فيها على بروفايل خاص محمي بدبوس PIN. التفاصيل مذكورة في صفحة كل منتج.",
  },
  {
    q: "ماذا لو توقف الاشتراك قبل نهاية المدة؟",
    a: "تواصل معنا عبر واتساب مع رقم طلبك وسنستبدله فوراً مجاناً. الضمان يغطي كامل مدة الاشتراك التي دفعتها.",
  },
];

export function Faq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {FAQS.map((f, i) => {
        const open = openIdx === i;
        return (
          <div
            key={i}
            className={cn(
              "glass overflow-hidden rounded-2xl transition-colors",
              open && "border-violet-500/30"
            )}
          >
            <button
              onClick={() => setOpenIdx(open ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-right"
            >
              <span className="text-sm font-bold text-white sm:text-base">
                {f.q}
              </span>
              <ChevronDown
                className={cn(
                  "h-4.5 w-4.5 shrink-0 text-violet-400 transition-transform duration-300",
                  open && "rotate-180"
                )}
              />
            </button>
            <div
              className={cn(
                "grid transition-all duration-300 ease-out",
                open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-sm leading-7 text-zinc-400">
                  {f.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
