import { db } from "@/db";
import {
  categories,
  orderItems,
  orders,
  plans,
  products,
  type Category,
  type OrderItem,
  type Plan,
  type Product,
} from "@/db/schema";
import { and, desc, eq, inArray } from "drizzle-orm";

export type CatalogCard = {
  id: number;
  slug: string;
  name: string;
  brand: string;
  tagline: string;
  description: string;
  features: string[];
  badge: string | null;
  rating: number;
  salesCount: number;
  isFeatured: boolean;
  categoryId: number;
  categorySlug: string;
  categoryName: string;
  minPrice: number;
  minMonths: number;
  plans: Plan[];
};

export async function getCatalog(): Promise<{
  categories: Category[];
  cards: CatalogCard[];
}> {
  const [cats, prods, allPlans] = await Promise.all([
    db.select().from(categories),
    db.select().from(products).where(eq(products.isActive, true)),
    db.select().from(plans).where(eq(plans.isActive, true)),
  ]);

  const catById = new Map(cats.map((c) => [c.id, c]));
  const plansByProduct = new Map<number, Plan[]>();
  for (const pl of allPlans) {
    const list = plansByProduct.get(pl.productId) ?? [];
    list.push(pl);
    plansByProduct.set(pl.productId, list);
  }

  const cards: CatalogCard[] = [];
  for (const p of prods) {
    const list = (plansByProduct.get(p.id) ?? []).sort(
      (a, b) => a.priceDzd - b.priceDzd
    );
    if (list.length === 0) continue;
    const cheapest = list[0];
    const cat = catById.get(p.categoryId);
    cards.push({
      id: p.id,
      slug: p.slug,
      name: p.name,
      brand: p.brand,
      tagline: p.tagline,
      description: p.description,
      features: p.features,
      badge: p.badge,
      rating: p.rating,
      salesCount: p.salesCount,
      isFeatured: p.isFeatured,
      categoryId: p.categoryId,
      categorySlug: cat?.slug ?? "",
      categoryName: cat?.name ?? "",
      minPrice: cheapest.priceDzd,
      minMonths: cheapest.months,
      plans: list,
    });
  }

  return {
    categories: cats.sort((a, b) => a.sort - b.sort),
    cards: cards.sort((a, b) => b.salesCount - a.salesCount),
  };
}

export async function getProductBySlug(slug: string): Promise<{
  product: Product;
  plans: Plan[];
  category: Category | null;
  related: CatalogCard[];
} | null> {
  const [p] = await db
    .select()
    .from(products)
    .where(and(eq(products.slug, slug), eq(products.isActive, true)))
    .limit(1);
  if (!p) return null;

  const [productPlans, catRows, catalog] = await Promise.all([
    db
      .select()
      .from(plans)
      .where(and(eq(plans.productId, p.id), eq(plans.isActive, true))),
    db.select().from(categories).where(eq(categories.id, p.categoryId)).limit(1),
    getCatalog(),
  ]);

  const related = catalog.cards
    .filter((c) => c.categoryId === p.categoryId && c.slug !== p.slug)
    .slice(0, 4);

  return {
    product: p,
    plans: productPlans.sort((a, b) => a.sort - b.sort),
    category: catRows[0] ?? null,
    related:
      related.length > 0
        ? related
        : catalog.cards.filter((c) => c.slug !== p.slug).slice(0, 4),
  };
}

export async function getOrderByCode(code: string) {
  const normalized = code.trim().toUpperCase();
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.code, normalized))
    .limit(1);
  if (!order) return null;
  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id));
  return { order, items };
}

export async function listOrders() {
  const all = await db
    .select()
    .from(orders)
    .orderBy(desc(orders.createdAt))
    .limit(200);
  if (all.length === 0) {
    return { orders: all, itemsByOrder: new Map<string, OrderItem[]>() };
  }
  const items = await db
    .select()
    .from(orderItems)
    .where(
      inArray(
        orderItems.orderId,
        all.map((o) => o.id)
      )
    );
  const itemsByOrder = new Map<string, OrderItem[]>();
  for (const it of items) {
    const list = itemsByOrder.get(it.orderId) ?? [];
    list.push(it);
    itemsByOrder.set(it.orderId, list);
  }
  return { orders: all, itemsByOrder };
}
