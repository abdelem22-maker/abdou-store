export const store = {
  name: process.env.NEXT_PUBLIC_STORE_NAME ?? "عبدو ستور",
  shortName: "عبدو ستور",
  tagline: "اشتراكاتك الرقمية الأصلية — تفعيل فوري وضمان كامل",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "213555000000",
  ccp: process.env.NEXT_PUBLIC_CCP ?? "0012345678 — مفتاح 45",
  rip: process.env.NEXT_PUBLIC_RIP ?? "00799999001234567890",
  adminKey: process.env.ADMIN_KEY ?? "abdou2026",
  deliveryPromise: "التفعيل خلال 5 إلى 30 دقيقة بعد تأكيد الدفع",
};

export function waLink(text: string) {
  return `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(text)}`;
}

export function formatDZD(n: number) {
  return `${Math.round(n).toLocaleString("en-US")} دج`;
}

export const PAYMENT_METHODS = [
  {
    id: "ccp",
    label: "تحويل CCP",
    hint: "من حسابك البريدي أو من أي مكتب بريد",
  },
  {
    id: "baridimob",
    label: "BaridiMob / RIP",
    hint: "تحويل فوري عبر تطبيق بريدي موب",
  },
  {
    id: "flexy",
    label: "فليكسي",
    hint: "رصيد موبيليس / جيزي / أوريدو",
  },
] as const;

export type PaymentMethodId = (typeof PAYMENT_METHODS)[number]["id"];

export const STATUS_LABELS: Record<string, string> = {
  pending: "في انتظار الدفع",
  paid: "تم الدفع",
  delivered: "تم التسليم",
  cancelled: "ملغي",
};
