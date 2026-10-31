import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  uuid,
  real,
  jsonb,
  index,
} from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  sort: integer("sort").notNull().default(0),
});

export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    brand: text("brand").notNull().default("generic"),
    tagline: text("tagline").notNull().default(""),
    description: text("description").notNull().default(""),
    features: jsonb("features").$type<string[]>().notNull().default([]),
    badge: text("badge"),
    rating: real("rating").notNull().default(4.8),
    salesCount: integer("sales_count").notNull().default(0),
    isFeatured: boolean("is_featured").notNull().default(false),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("products_category_idx").on(t.categoryId)]
);

export const plans = pgTable(
  "plans",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    label: text("label").notNull(),
    months: integer("months").notNull().default(1),
    priceDzd: integer("price_dzd").notNull(),
    compareAtDzd: integer("compare_at_dzd"),
    sort: integer("sort").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
  },
  (t) => [index("plans_product_idx").on(t.productId)]
);

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    code: text("code").notNull().unique(),
    customerName: text("customer_name").notNull(),
    phone: text("phone").notNull(),
    wilaya: text("wilaya").notNull(),
    paymentMethod: text("payment_method").notNull().default("ccp"),
    notes: text("notes").notNull().default(""),
    status: text("status").notNull().default("pending"),
    totalDzd: integer("total_dzd").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("orders_code_idx").on(t.code), index("orders_phone_idx").on(t.phone)]
);

export const orderItems = pgTable(
  "order_items",
  {
    id: serial("id").primaryKey(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productName: text("product_name").notNull(),
    planLabel: text("plan_label").notNull(),
    months: integer("months").notNull().default(1),
    unitPriceDzd: integer("unit_price_dzd").notNull(),
    quantity: integer("quantity").notNull().default(1),
  },
  (t) => [index("order_items_order_idx").on(t.orderId)]
);

export const ORDER_STATUSES = ["pending", "paid", "delivered", "cancelled"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Plan = typeof plans.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
