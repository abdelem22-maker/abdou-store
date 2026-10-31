import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 pt-24 pb-16 text-center sm:px-6">
      <span className="glass mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-violet-300">
        <Compass className="h-7.5 w-7.5" />
      </span>
      <h1 className="mt-6 text-4xl font-black text-white">404</h1>
      <p className="mt-3 text-sm leading-7 text-zinc-400">
        الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
      </p>
      <Link
        href="/shop"
        className="btn-glow mt-7 inline-flex rounded-full bg-gradient-to-l from-violet-600 to-indigo-600 px-7 py-3.5 text-sm font-black text-white transition hover:brightness-110"
      >
        العودة إلى المتجر
      </Link>
    </div>
  );
}
