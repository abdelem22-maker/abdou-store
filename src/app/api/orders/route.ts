import { NextRequest, NextResponse } from "next/server";
import { randomInt } from "crypto";
import { db } from "@/db";
import { orderItems, orders, plans, products } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { PAYMENT_METHODS } from "@/lib/site";
import { WILAYAS } from "@/lib/wilayas";

export const dynamic = "force-dynamic";

const CODE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

function makeCode() {
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += CODE_ALPHABET[randomInt(0, CODE_ALPHABET.length)];
  }
  return code;
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "طلب غير صالح." }, { status: 400 });
  }

  const {
    productId,
    planId,
    customerName,
    phone,
    wilaya,
    paymentMethod,
    notes,
  } = (body ?? {}) as Record<string, unknown>;

  const name = typeof customerName === "string" ? customerName.trim() : "";
  const phoneStr = typeof phone === "string" ? phone.trim() : "";
  const wilayaStr = typeof wilaya === "string" ? wilaya.trim() : "";
  const payStr = typeof paymentMethod === "string" ? paymentMethod : "ccp";
  const notesStr = typeof notes === "string" ? notes.trim().slice(0, 500) : "";

  if (typeof productId !== "number" || typeof planId !== "number") {
    return NextResponse.json({ error: "اختر العرض والمدة." }, { status: 400 });
  }
  if (name.length < 2 || name.length > 80) {
    return NextResponse.json({ error: "أدخل اسماً صحيحاً." }, { status: 400 });
  }
  if (!/^(05|06|07)\d{8}$/.test(phoneStr)) {
    return NextResponse.json(
      { error: "رقم الهاتف يجب أن يبدأ بـ 05/06/07 ويتكوّن من 10 أرقام." },
      { status: 400 }
    );
  }
  if (!WILAYAS.includes(wilayaStr)) {
    return NextResponse.json({ error: "اختر ولاية صحيحة." }, { status: 400 });
  }
  if (!PAYMENT_METHODS.some((m) => m.id === payStr)) {
    return NextResponse.json({ error: "طريقة دفع غير صحيحة." }, { status: 400 });
  }

  const [plan] = await db
    .select()
    .from(plans)
    .where(
      and(eq(plans.id, planId), eq(plans.productId, productId), eq(plans.isActive, true))
    )
    .limit(1);
  if (!plan) {
    return NextResponse.json({ error: "هذا العرض غير متوفر حالياً." }, { status: 404 });
  }

  const [product] = await db
    .select()
    .from(products)
    .where(and(eq(products.id, plan.productId), eq(products.isActive, true)))
    .limit(1);
  if (!product) {
    return NextResponse.json({ error: "هذا المنتج غير متوفر حالياً." }, { status: 404 });
  }

  // الأسعار تُحسب من قاعدة البيانات فقط — لا نثق أبداً في ما يرسله المتصفح
  const total = plan.priceDzd;
  const code = makeCode();

  try {
    const [order] = await db
      .insert(orders)
      .values({
        code,
        customerName: name,
        phone: phoneStr,
        wilaya: wilayaStr,
        paymentMethod: payStr,
        notes: notesStr,
        status: "pending",
        totalDzd: total,
      })
      .returning();

    await db.insert(orderItems).values({
      orderId: order.id,
      productName: product.name,
      planLabel: plan.label,
      months: plan.months,
      unitPriceDzd: plan.priceDzd,
      quantity: 1,
    });

    return NextResponse.json({ code: order.code, totalDzd: order.totalDzd });
  } catch (err) {
    console.error("order create failed", err);
    return NextResponse.json(
      { error: "تعذّر تسجيل الطلب، حاول مجدداً بعد لحظات." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code")?.trim().toUpperCase() ?? "";
  const phone = req.nextUrl.searchParams.get("phone")?.trim() ?? "";

  if (code.length < 4 || !/^(05|06|07)\d{8}$/.test(phone)) {
    return NextResponse.json(
      { error: "أدخل رقم الطلب ورقم الهاتف بشكل صحيح." },
      { status: 400 }
    );
  }

  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.code, code))
    .limit(1);

  if (!order || order.phone !== phone) {
    return NextResponse.json({ error: "لم نجد طلباً بهذه المعلومات." }, { status: 404 });
  }

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id));

  return NextResponse.json({
    code: order.code,
    status: order.status,
    customerName: order.customerName.split(" ")[0] ?? order.customerName,
    wilaya: order.wilaya,
    paymentMethod: order.paymentMethod,
    totalDzd: order.totalDzd,
    createdAt: order.createdAt,
    items: items.map((i) => ({
      productName: i.productName,
      planLabel: i.planLabel,
      unitPriceDzd: i.unitPriceDzd,
      quantity: i.quantity,
    })),
  });
}
