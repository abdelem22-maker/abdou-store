import type { Metadata } from "next";
import { PackageSearch } from "lucide-react";
import { Reveal } from "@/components/motion";
import { TrackForm } from "@/components/track-form";

export const metadata: Metadata = {
  title: "تتبّع طلبك",
  description: "أدخل رقم الطلب ورقم هاتفك لمعرفة حالة اشتراكك.",
};

export default function TrackPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pt-14 sm:px-6">
      <Reveal>
        <div className="text-center">
          <span className="glass mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-violet-300">
            <PackageSearch className="h-7.5 w-7.5" />
          </span>
          <h1 className="mt-5 text-3xl font-black text-white sm:text-4xl">
            تتبّع <span className="text-gradient">طلبك</span>
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-zinc-400">
            أدخل رقم الطلب (6 أحرف) ورقم الهاتف الذي طلبت به لعرض الحالة
            الحالية لاشتراكك.
          </p>
        </div>
      </Reveal>
      <Reveal delay={0.1}>
        <TrackForm />
      </Reveal>
    </div>
  );
}
