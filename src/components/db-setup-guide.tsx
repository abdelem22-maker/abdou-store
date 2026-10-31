import { Database, AlertTriangle, Hammer, Rocket, SearchX } from "lucide-react";
import { classifyDbError } from "@/db";
import { cn } from "@/lib/cn";

const PROBLEMS: Record<
  string,
  { title: string; text: string; first: string }
> = {
  missing: {
    title: "لم يُضبط DATABASE_URL في مشروع Vercel",
    text: "الموقع يملك قاعدة بيانات Supabase خاصة، لكنه لا يجد عنوانها. أضف متغير البيئة DATABASE_URL ثم أعد النشر.",
    first: "الخطوة 2 في الأسفل",
  },
  connection: {
    title: "لا يمكن الوصول إلى قاعدة بيانات Supabase",
    text: "الاتصال مرفوض غالباً لأن الرابط: (1) من نوع Direct Connection (منفذ 5432) وليس Transaction Pooler (منفذ 6543)، أو (2) ما زال يحتوي على [YOUR-PASSWORD] مكان كلمة السر، أو (3) كلمة السر غير صحيحة.",
    first: "الخطوة 2 في الأسفل",
  },
  schema: {
    title: "الاتصال نجح، لكن جداول المتجر غير موجودة",
    text: "تم الوصول إلى Supabase لكن الجداول فارغة. الصق ملف supabase-setup.sql في محرر SQL وتشغيله.",
    first: "الخطوة 1 في الأسفل",
  },
  other: {
    title: "حدث خطأ غير متوقع أثناء الاتصال بقاعدة البيانات",
    text: "نسخ الخطأ التقني أدناه ستساعدك على إصلاحه بسرعة.",
    first: "راجع الخطأ التقني أسفله",
  },
};

function Step({
  n,
  icon: Icon,
  title,
  children,
}: {
  n: number;
  icon: typeof Database;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass flex gap-4 rounded-2xl p-5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/30 to-cyan-500/20 text-violet-300 ring-1 ring-violet-400/30">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <h3 className="text-sm font-black text-white">
          {n}. {title}
        </h3>
        <div className="mt-2 text-[13px] leading-7 text-zinc-400">{children}</div>
      </div>
    </div>
  );
}

export function DbSetupGuide({ error }: { error: unknown }) {
  const problem = PROBLEMS[classifyDbError(error)];
  const rawMsg =
    error instanceof Error ? `${error.name}: ${error.message}` : String(error);

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <div className="text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-300 ring-1 ring-amber-400/30">
          <SearchX className="h-7.5 w-7.5" />
        </span>
        <h1 className="mt-5 text-3xl font-black text-white">
          الموقع لم يكتمل تجهيزه بعد
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-zinc-400">
          لا تقلق — هذا متوقع في أول نشر على Vercel. اكتشفنا المشكلة التالية:
        </p>
      </div>

      {/* Detected problem */}
      <div className="mt-8 rounded-[2rem] border border-amber-400/30 bg-amber-400/5 p-6">
        <p className="flex items-center gap-2 text-sm font-black text-amber-300">
          <Database className="h-4.5 w-4.5" />
          {problem.title}
        </p>
        <p className="mt-2 text-[13px] leading-7 text-zinc-300">{problem.text}</p>
        <p className="mt-3 text-xs font-bold text-amber-300/90">
          الحل يبدأ من: {problem.first}
        </p>
        <details className="mt-4">
          <summary className="cursor-pointer text-xs font-bold text-zinc-500 transition hover:text-zinc-300">
            عرض الخطأ التقني (للتنبيه)
          </summary>
          <pre
            dir="ltr"
            className="mt-3 max-h-40 overflow-auto rounded-xl bg-black/50 p-4 text-left font-mono text-[11px] leading-5 text-rose-300"
          >
            {rawMsg}
          </pre>
        </details>
      </div>

      {/* Steps */}
      <div className={cn("mt-6 space-y-4")}>
        <Step n={1} icon={Hammer} title="شغّل مخطط قاعدة البيانات في Supabase (مرة واحدة)">
          <p>
            افتح مشروعك على <b className="text-white">supabase.com</b> →{" "}
            <b className="text-white">SQL Editor</b> →{" "}
            <b className="text-white">New query</b> → الصق كامل محتوى ملف{" "}
            <code dir="ltr" className="rounded bg-black/40 px-1.5 py-0.5 font-mono text-[11px] text-cyan-300">
              supabase-setup.sql
            </code>{" "}
            الموجود في مستودعك → اضغط <b className="text-white">Run</b>.
          </p>
          <p className="mt-2">
            نجاح التشغيل = ظهرت كلمة «Success».
          </p>
        </Step>

        <Step n={2} icon={SearchX} title="أضف DATABASE_URL في Vercel">
          <p>
            في مشروعك على <b className="text-white">vercel.com</b> →{" "}
            <b className="text-white">Settings</b> →{" "}
            <b className="text-white">Environment Variables</b> → أضف متغيراً باسم{" "}
            <code dir="ltr" className="rounded bg-black/40 px-1.5 py-0.5 font-mono text-[11px] text-violet-300">
              DATABASE_URL
            </code>{" "}
            (في كل البيئات Production/Preview/Development).
          </p>
          <p className="mt-2">
            قيمته: من Supabase → اضغط زر <b className="text-white">Connect</b> أعلى
            لوحة المشروع → انسخ <b className="text-white">Transaction pooler URI</b>{" "}
            (يجب أن يحتوي على <b dir="ltr">:6543</b>) واستبدل{" "}
            <code dir="ltr" className="font-mono text-[11px] text-amber-300">
              [YOUR-PASSWORD]
            </code>{" "}
            بكلمة سر قاعدة البيانات (من Database → Connection string → كلمة السر).
          </p>
          <pre
            dir="ltr"
            className="mt-3 overflow-auto rounded-xl bg-black/50 p-3 text-left font-mono text-[10.5px] leading-5 text-cyan-200"
          >
            postgresql://postgres.abcd1234:كلمة_سر@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
          </pre>
        </Step>

        <Step n={3} icon={Rocket} title="أعد النشر">
          <p>
            Vercel يقرأ المتغيرات فقط عند البناء: افتح{" "}
            <b className="text-white">Deployments</b> → أحدث نشر →{" "}
            <b className="text-white">⋯</b> → <b className="text-white">Redeploy</b>{" "}
            → <b className="text-white">Redeploy</b>. انتظر دقيقة ثم افتح موقعك
            مجدداً.
          </p>
          <p className="mt-2">
            للتأكد السريع افتح في المتصفح:{" "}
            <code dir="ltr" className="rounded bg-black/40 px-1.5 py-0.5 font-mono text-[11px] text-emerald-300">
              https://abdou-store-alpha.vercel.app/api/health
            </code>{" "}
            — إن ظهر <code dir="ltr" className="font-mono text-emerald-300">{"{ ok: true }"}</code> فقد اكتمل كل شيء.
          </p>
        </Step>
      </div>

      <div className="glass mt-6 rounded-2xl p-5 text-[12px] leading-6 text-zinc-500">
        <p className="flex items-center gap-2 font-black text-zinc-300">
          <AlertTriangle className="h-4 w-4" />
          تنبيه مهم حول GitHub
        </p>
        <p className="mt-1.5">
          إن كان ملف <code dir="ltr" className="font-mono text-zinc-300">.env</code>{" "}
          (الذي يحتوي رابط قاعدة البيانات المحلية 127.0.0.1) مرفوعاً في مستودعك
          على GitHub، فاحذفه من المستودع — Vercel قد يقرأه بدلاً من متغيرات
          البيئة الصحيحة. الملفات في هذا المشروع أصبحت محمية بـ{" "}
          <code dir="ltr" className="font-mono text-zinc-300">.gitignore</code> بدءاً
          من الآن.
        </p>
      </div>
    </div>
  );
}
