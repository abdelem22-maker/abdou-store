import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

export type DB = NodePgDatabase<typeof schema>;

const databaseUrl = process.env.DATABASE_URL ?? "";

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

// لا نرمي خطأً عند غياب DATABASE_URL — بدلاً منه يعرض الموقع
// صفحة شرح واضحة تخبر الزائر/المالك بالضبط ما ينقص.
const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  new Pool(
    databaseUrl
      ? {
          connectionString: databaseUrl,
          max: 5,
          connectionTimeoutMillis: 6000,
          idleTimeoutMillis: 30000,
          keepAlive: true,
          allowExitOnIdle: true,
        }
      : {
          connectionString: "postgresql://invalid:invalid@127.0.0.1:1/invalid",
          max: 1,
          connectionTimeoutMillis: 1500,
        }
  );

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db: DB = drizzle(pool);

/** هل وُجد DATABASE_URL أصلاً في بيئة التشغيل؟ */
export const hasDatabaseUrl = databaseUrl.length > 0;

export type DbProblem = "missing" | "connection" | "schema" | "other";

export function classifyDbError(e: unknown): DbProblem {
  if (!hasDatabaseUrl) return "missing";
  const raw =
    e instanceof Error
      ? `${e.message} ${(e as Error & { code?: string }).code ?? ""}`
      : String(e);
  const m = raw.toLowerCase();
  if (m.includes("does not exist")) return "schema";
  if (
    [
      "econnrefused",
      "etimedout",
      "timeout",
      "getaddrinfo",
      "eai_again",
      "password authentication",
      "connection terminated",
      "exceeds the maximum",
      "socket hang up",
      "econnreset",
      "no pg_hba.conf",
      "ssl",
      "certificate",
      "invalid connection",
      "role",
    ].some((k) => m.includes(k))
  ) {
    return "connection";
  }
  return "other";
}
