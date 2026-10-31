import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders, ORDER_STATUSES } from "@/db/schema";
import { eq } from "drizzle-orm";
import { store } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest) {
  const key = req.headers.get("x-admin-key") ?? "";
  if (!key || key !== store.adminKey) {
    return NextResponse.json({ error: "غير مصرّح." }, { status: 401 });
  }

  let body: { code?: string; status?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "طلب غير صالح." }, { status: 400 });
  }

  const code = body.code?.trim().toUpperCase();
  const status = body.status ?? "";
  if (!code || !(ORDER_STATUSES as readonly string[]).includes(status)) {
    return NextResponse.json({ error: "بيانات غير صحيحة." }, { status: 400 });
  }

  const [updated] = await db
    .update(orders)
    .set({ status })
    .where(eq(orders.code, code))
    .returning({ code: orders.code });

  if (!updated) {
    return NextResponse.json({ error: "الطلب غير موجود." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, code: updated.code, status });
}
