import { sql } from "drizzle-orm";
import { classifyDbError, db, hasDatabaseUrl } from "@/db";

export const dynamic = "force-dynamic";

/**
 * تشخيص سريع — افتح /api/health في المتصفح:
 *  ok: true                 → كل شيء جاهز
 *  problem: no-database-url → أضف DATABASE_URL في Vercel
 *  problem: connection      → DATABASE_URL خطأ (استخدم pooler 6543)
 *  problem: missing-tables  → شغّل supabase-setup.sql في Supabase
 */
export async function GET() {
  if (!hasDatabaseUrl) {
    return Response.json(
      { ok: false, problem: "no-database-url" },
      { status: 503 }
    );
  }
  try {
    await db.execute(sql`select 1`);
  } catch (e) {
    return Response.json(
      {
        ok: false,
        problem: classifyDbError(e) === "schema" ? "missing-tables" : "connection",
        detail: e instanceof Error ? e.message.slice(0, 300) : String(e).slice(0, 300),
      },
      { status: 503 }
    );
  }
  try {
    const res = await db.execute(sql`select count(*)::int as n from products`);
    const rows = res.rows as Array<{ n: string }>;
    return Response.json({ ok: true, products: rows[0]?.n ?? 0 });
  } catch (e) {
    return Response.json(
      {
        ok: false,
        problem: "missing-tables",
        detail: e instanceof Error ? e.message.slice(0, 300) : String(e).slice(0, 300),
      },
      { status: 503 }
    );
  }
}
