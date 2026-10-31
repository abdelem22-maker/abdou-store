import "dotenv/config";
import { writeFileSync } from "node:fs";
import { asc, sql as dsql } from "drizzle-orm";
import { db } from "../src/db";
import { categories, products, plans } from "../src/db/schema";

function str(v: string | null | undefined): string {
  if (v == null) return "NULL";
  return `'${v.replace(/'/g, "''")}'`;
}

function jsonb(v: unknown): string {
  return str(JSON.stringify(v ?? [])) + "::jsonb";
}

async function main() {
  const cats = await db.select().from(categories).orderBy(asc(categories.sort));
  const prods = await db.select().from(products).orderBy(asc(products.id));
  const pls = await db.select().from(plans).orderBy(asc(plans.id));

  const ddl = `-- ============================================================
-- عبدو ستور — متجر اشتراكات رقمية
-- انسخ هذا الملف كاملاً والصقه في Supabase → SQL Editor → Run
-- تنبيه: يحذف جداول المتجر القديمة (categories/products/plans/orders)
-- إذا كنت تريد الاحتفاظ ببيانات متجر الملابس، أنشئ مشروع Supabase جديداً.
-- ============================================================

drop table if exists order_items cascade;
drop table if exists orders cascade;
drop table if exists plans cascade;
drop table if exists products cascade;
drop table if exists categories cascade;

create table categories (
  id serial primary key,
  slug text not null unique,
  name text not null,
  sort integer not null default 0
);

create table products (
  id serial primary key,
  category_id integer not null references categories(id),
  slug text not null unique,
  name text not null,
  brand text not null default 'generic',
  tagline text not null default '',
  description text not null default '',
  features jsonb not null default '[]'::jsonb,
  badge text,
  rating real not null default 4.8,
  sales_count integer not null default 0,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
create index products_category_idx on products(category_id);

create table plans (
  id serial primary key,
  product_id integer not null references products(id) on delete cascade,
  label text not null,
  months integer not null default 1,
  price_dzd integer not null,
  compare_at_dzd integer,
  sort integer not null default 0,
  is_active boolean not null default true
);
create index plans_product_idx on plans(product_id);

create table orders (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  customer_name text not null,
  phone text not null,
  wilaya text not null,
  payment_method text not null default 'ccp',
  notes text not null default '',
  status text not null default 'pending',
  total_dzd integer not null,
  created_at timestamptz not null default now()
);
create index orders_code_idx on orders(code);
create index orders_phone_idx on orders(phone);

create table order_items (
  id serial primary key,
  order_id uuid not null references orders(id) on delete cascade,
  product_name text not null,
  plan_label text not null,
  months integer not null default 1,
  unit_price_dzd integer not null,
  quantity integer not null default 1
);
create index order_items_order_idx on order_items(order_id);

-- ============ البيانات الجاهزة (الكتالوج) ============
`;

  const catValues = cats
    .map((c) => `(${c.id}, ${str(c.slug)}, ${str(c.name)}, ${c.sort})`)
    .join(",\n");

  const prodValues = prods
    .map(
      (p) =>
        `(${p.id}, ${p.categoryId}, ${str(p.slug)}, ${str(p.name)}, ${str(p.brand)}, ${str(p.tagline)}, ${str(p.description)}, ${jsonb(p.features)}, ${str(p.badge)}, ${p.rating}, ${p.salesCount}, ${p.isFeatured}, ${p.isActive})`
    )
    .join(",\n");

  const planValues = pls
    .map(
      (pl) =>
        `(${pl.id}, ${pl.productId}, ${str(pl.label)}, ${pl.months}, ${pl.priceDzd}, ${pl.compareAtDzd ?? "NULL"}, ${pl.sort}, ${pl.isActive})`
    )
    .join(",\n");

  const seed = `
insert into categories (id, slug, name, sort) values
${catValues};

insert into products (id, category_id, slug, name, brand, tagline, description, features, badge, rating, sales_count, is_featured, is_active) values
${prodValues};

insert into plans (id, product_id, label, months, price_dzd, compare_at_dzd, sort, is_active) values
${planValues};

select setval(pg_get_serial_sequence('categories','id'), (select max(id) from categories));
select setval(pg_get_serial_sequence('products','id'), (select max(id) from products));
select setval(pg_get_serial_sequence('plans','id'), (select max(id) from plans));
`;

  writeFileSync("supabase-setup.sql", ddl + seed, "utf8");
  const lines = (ddl + seed).split("\n").length;
  const [{ n }] = await db
    .select({ n: dsql<number>`count(*)::int` })
    .from(products);
  console.log(`supabase-setup.sql written: ${n} products, ${pls.length} plans, ${lines} lines`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
