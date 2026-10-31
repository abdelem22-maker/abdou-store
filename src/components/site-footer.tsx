import Link from "next/link";
import { Zap, ShieldCheck, Clock, Landmark, Smartphone, KeyRound } from "lucide-react";
import { store, waLink } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-white/8 bg-black/30">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-700 text-white">
              <Zap className="h-4.5 w-4.5" strokeWidth={2.2} />
            </span>
            <span className="text-lg font-extrabold text-white">
              {store.shortName}
              <span className="text-violet-400">.</span>
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-7 text-zinc-400">
            متجرك الجزائري للاشتراكات الرقمية الأصلية: منصات المشاهدة، الذكاء
            الاصطناعي، الموسيقى وأدوات التصميم — بأسعار مناسبة ودفع محلي سهل،
            مع تفعيل سريع وضمان كامل.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-zinc-300">
            <span className="glass flex items-center gap-1.5 rounded-full px-3 py-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              ضمان كامل طيلة الاشتراك
            </span>
            <span className="glass flex items-center gap-1.5 rounded-full px-3 py-1.5">
              <Clock className="h-3.5 w-3.5 text-cyan-400" />
              تفعيل خلال 5–30 دقيقة
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-extrabold text-white">روابط سريعة</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-zinc-400">
            <li>
              <Link href="/shop" className="transition hover:text-white">
                كل الاشتراكات
              </Link>
            </li>
            <li>
              <Link href="/track" className="transition hover:text-white">
                تتبّع طلبك
              </Link>
            </li>
            <li>
              <a
                href={waLink("مرحباً، أحتاج مساعدة في اختيار اشتراك.")}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-white"
              >
                الدعم عبر واتساب
              </a>
            </li>
            <li>
              <Link
                href="/admin?key=demo"
                className="inline-flex items-center gap-1.5 text-zinc-600 transition hover:text-zinc-400"
              >
                <KeyRound className="h-3.5 w-3.5" />
                لوحة التحكم
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-extrabold text-white">طرق الدفع</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-zinc-400">
            <li className="flex items-center gap-2">
              <Landmark className="h-4 w-4 text-amber-400" />
              تحويل CCP — البريد الجزائري
            </li>
            <li className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-cyan-400" />
              BaridiMob — تحويل RIP
            </li>
            <li className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-violet-400" />
              فليكسي (رصيد هاتف)
            </li>
          </ul>
          <p className="mt-4 text-xs leading-6 text-zinc-500">
            بعد الدفع أرسل إشعار التحويل عبر واتساب ليتم تفعيل اشتراكك فوراً.
          </p>
        </div>
      </div>

      <div className="border-t border-white/6 py-5 text-center text-xs text-zinc-600">
        {store.name} — جميع الحقوق محفوظة {new Date().getFullYear()} · صُنع
        بحب في الجزائر
      </div>
    </footer>
  );
}
