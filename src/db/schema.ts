import { relations } from "drizzle-orm";
import { pgEnum, pgTable, serial, numeric, varchar, smallint, integer } from "drizzle-orm/pg-core";

export const esimsType = pgEnum("esims_type", ["roaming", "local"]);

export const esimsPlan = pgEnum("esims_plan", ["unlimited", "quota"]);

export const esimsDataUnit = pgEnum("esims_data_unit", ["gb", "mb", "unlimited"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username").notNull(),
  email: varchar("email").notNull().unique(),
  password: varchar("password").notNull(),
});

export const countries = pgTable("countries", {
  code: varchar("code").primaryKey().unique().notNull(),
  name: varchar("name").unique().notNull(),
});

export const esims = pgTable("esims", {
  id: serial("id").primaryKey(),
  type: esimsType("type").notNull(),
  plan: esimsPlan("plan").notNull(),
  dataUnit: esimsDataUnit("data_unit").notNull(),
  priceInUsd: numeric("price_in_usd", { precision: 10, scale: 2 }).notNull(),
  durationInDays: smallint("duration_in_days").notNull(),
  countryCode: varchar("country_code")
    .references(() => countries.code, { onDelete: "cascade" })
    .notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
});

export const orderItems = pgTable("order_items", {
  orderId: integer("order_id")
    .references(() => orders.id, { onDelete: "cascade" })
    .notNull(),
  esimId: integer("esim_id")
    .references(() => esims.id, { onDelete: "cascade" })
    .notNull(),
  quantity: smallint("quantity").notNull(),
});

export const countriesRelation = relations(countries, ({ many }) => ({
  esims: many(esims),
}));

export const esimsRelation = relations(esims, ({ one }) => ({
  esim: one(countries, {
    fields: [esims.countryCode],
    references: [countries.code],
  }),
}));

export const usersRelation = relations(users, ({ many }) => ({
  orders: many(orders),
}));

export const ordersRelation = relations(orders, ({ one }) => ({
  order: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
}));

export const esimsOrderItemsRelation = relations(esims, ({ many }) => ({
  orderItems: many(orderItems),
}));

export const ordersOrderItemsRelation = relations(esims, ({ many }) => ({
  orderItems: many(orderItems),
}));

export const orderItemsRelation = relations(orderItems, ({ one }) => ({
  esim: one(esims, {
    fields: [orderItems.esimId],
    references: [esims.id],
  }),
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
}));
