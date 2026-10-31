import type { Metadata } from "next";
import {
  Lock,
  Banknote,
  Clock,
  PackageCheck,
  XCircle,
  Inbox,
} from "lucide-react";
import { listOrders } from "@/lib/queries";
import { formatDZD, STATUS_LABELS, store } from "@/lib/site";
import { AdminStatusSelect } from "@/components/admin-order-row";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "لوحة التحكم",
  robots: { index: false, follow: false },
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>;
}) {
  const { key } = await searchParams;

  if (!key || key !== store.adminKey) {
    return (
      <div className="mx-auto max-w-md px-4 pt-24 pb-10 sm:px-6">
        <div className="glass rounded-[2rem] p-10 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-300 ring-1 ring-rose-500/30">
            <Lock className="h-6.5 w-6.5" />
          </span>
          <h1 className="mt-5 text-xl font-black text-white">منطقة محمية</h1>
          <p className="mt-2 text-sm leading-7 text-zinc-400">
            هذه الصفحة خاصة بصاحب المتجر. أضف مفتاح الإدارة إلى الرابط:
            <br />
            <code
              dir="ltr"
              className="mt-2 inline-block rounded-lg bg-black/40 px-3 py-1.5 font-mono text-xs text-violet-300"
            >
              /admin?key=YOUR_KEY
            </code>
          </p>
          <p className="mt-4 text-[11px] leading-5 text-zinc-600">
            عرّف المفتاح بمتغيّر البيئة ADMIN_KEY (القيمة الافتراضية: abdou2026).
          </p>
        </div>
      </div>
    );
  }

  const { orders: all, itemsByOrder } = await listOrders();

  const count = (s: string) => all.filter((o) => o.status === s).length;
  const revenue = all
    .filter((o) => o.status === "paid" || o.status === "delivered")
    .reduce((sum, o) => sum + o.totalDzd, 0);

  const stats = [
    { label: "بانتظار الدفع", value: count("pending"), icon: Clock, tone: "text-amber-300" },
    { label: "مدفوعة", value: count("paid"), icon: Banknote, tone: "text-cyan-300" },
    { label: "مسلَّمة", value: count("delivered"), icon: PackageCheck, tone: "text-emerald-300" },
    { label: "ملغية", value: count("cancelled"), icon: XCircle, tone: "text-rose-300" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">لوحة التحكم</h1>
          <p className="mt-1.5 text-sm text-zinc-400">
            {all.length} طلب — المداخيل المؤكدة:{" "}
            <span className="font-black text-emerald-300" dir="ltr">
              {formatDZD(revenue)}
            </span>
          </p>
        </div>
        <span className="glass rounded-full px-4 py-1.5 text-[11px] font-bold text-zinc-400">
          آخر 200 طلب
        </span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="glass rounded-2xl p-4">
            <s.icon className={`h-5 w-5 ${s.tone}`} />
            <p className="mt-2 text-2xl font-black text-white">{s.value}</p>
            <p className="text-[11px] font-bold text-zinc-500">{s.label}</p>
          </div>
        ))}
      </div>

      {all.length === 0 ? (
        <div className="glass mt-8 rounded-[2rem] p-14 text-center">
          <Inbox className="mx-auto h-10 w-10 text-zinc-600" />
          <p className="mt-4 text-sm font-bold text-zinc-400">
            لا توجد طلبات بعد — أول طلب سيظهر هنا.
          </p>
        </div>
      ) : (
        <div className="glass mt-8 overflow-x-auto rounded-[2rem]">
          <table className="w-full min-w-[820px] text-right text-sm">
            <thead>
              <tr className="border-b border-white/8 text-[11px] font-black text-zinc-500">
                <th className="px-5 py-4">الطلب</th>
                <th className="px-4 py-4">الزبون</th>
                <th className="px-4 py-4">الاشتراك</th>
                <th className="px-4 py-4">المبلغ</th>
                <th className="px-4 py-4">الدفع عبر</th>
                <th className="px-4 py-4">الحالة</th>
                <th className="px-4 py-4">التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {all.map((o) => {
                const items = itemsByOrder.get(o.id) ?? [];
                return (
                  <tr
                    key={o.id}
                    className="border-b border-white/5 align-top transition hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-4">
                      <span className="font-mono text-sm font-black tracking-widest text-white" dir="ltr">
                        {o.code}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-bold text-white">{o.customerName}</p>
                      <p className="mt-0.5 font-mono text-xs text-zinc-500" dir="ltr">
                        {o.phone}
                      </p>
                      <p className="mt-0.5 text-[11px] text-zinc-600">{o.wilaya}</p>
                    </td>
                    <td className="px-4 py-4">
                      {items.map((it) => (
                        <p key={it.id} className="text-xs leading-6 text-zinc-300">
                          <span className="font-bold text-white">{it.productName}</span>
                          <span className="text-zinc-500"> — {it.planLabel}</span>
                        </p>
                      ))}
                      {o.notes && (
                        <p className="mt-1 max-w-[200px] truncate text-[11px] text-zinc-500">
                          ملاحظة: {o.notes}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-4 font-black whitespace-nowrap text-white" dir="ltr">
                      {formatDZD(o.totalDzd)}
                    </td>
                    <td className="px-4 py-4 text-xs font-bold text-zinc-400">
                      {o.paymentMethod === "ccp"
                        ? "CCP"
                        : o.paymentMethod === "baridimob"
                          ? "BaridiMob"
                          : "فليكسي"}
                    </td>
                    <td className="px-4 py-4">
                      <AdminStatusSelect
                        code={o.code}
                        status={o.status}
                        adminKey={key}
                      />
                    </td>
                    <td className="px-4 py-4 text-xs whitespace-nowrap text-zinc-500">
                      {new Date(o.createdAt).toLocaleDateString("fr-DZ", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
