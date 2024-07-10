import { relations, sql } from "drizzle-orm";
import {
  pgEnum,
  pgTable,
  serial,
  numeric,
  varchar,
  smallint,
  integer,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

export const updateTimestamp = sql<string>`CURRENT_TIMESTAMP`;

export const esimsType = pgEnum("esims_type", ["roaming", "local"]);

export const esimsPlan = pgEnum("esims_plan", ["unlimited", "quota"]);

export const esimsDataUnit = pgEnum("esims_data_unit", ["gb", "mb", "unlimited"]);

export const usersSchema = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username").notNull(),
  email: varchar("email").notNull().unique(),
  password: varchar("password").notNull(),
  createdAt: timestamp("created_at", { precision: 6, withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true }).defaultNow().notNull(),
});

export const countriesSchema = pgTable("countries", {
  code: varchar("code").primaryKey().unique().notNull(),
  name: varchar("name").unique().notNull(),
  createdAt: timestamp("created_at", { precision: 6, withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true }).defaultNow().notNull(),
});

export const esimsSchema = pgTable("esims", {
  id: serial("id").primaryKey(),
  type: esimsType("type").notNull(),
  plan: esimsPlan("plan").notNull(),
  dataUnit: esimsDataUnit("data_unit").notNull(),
  dataAmount: integer("data_amount").notNull(),
  priceInUsd: numeric("price_in_usd", { precision: 10, scale: 2 }).notNull(),
  durationInDays: smallint("duration_in_days").notNull(),
  countryCode: varchar("country_code")
    .references(() => countriesSchema.code, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at", { precision: 6, withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true }).defaultNow().notNull(),
});

export const ordersSchema = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => usersSchema.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at", { precision: 6, withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true }).defaultNow().notNull(),
});

export const orderItemsSchema = pgTable("order_items", {
  orderId: integer("order_id")
    .primaryKey()
    .references(() => ordersSchema.id, { onDelete: "cascade" })
    .notNull(),
  esimId: integer("esim_id")
    .references(() => esimsSchema.id, { onDelete: "cascade" })
    .notNull(),
  quantity: smallint("quantity").notNull(),
  createdAt: timestamp("created_at", { precision: 6, withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true }).defaultNow().notNull(),
});

export const sessionSchema = pgTable("session", {
  sessionId: varchar("session_id").primaryKey().unique().notNull(),
  token: varchar("token").unique(),
  userId: integer("user_id")
    .references(() => usersSchema.id, { onDelete: "cascade" })
    .notNull(),
  expiresAt: timestamp("expires_at", {
    precision: 6,
    withTimezone: true,
    mode: "string",
  }).notNull(),
  isRevoked: boolean("is_revoked").notNull().default(false),
  createdAt: timestamp("created_at", { precision: 6, withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true }).defaultNow().notNull(),
});

export const countriesRelation = relations(countriesSchema, ({ many }) => ({
  esims: many(esimsSchema),
}));

export const esimsRelation = relations(esimsSchema, ({ one }) => ({
  esim: one(countriesSchema, {
    fields: [esimsSchema.countryCode],
    references: [countriesSchema.code],
  }),
}));

export const usersRelation = relations(usersSchema, ({ many }) => ({
  orders: many(ordersSchema),
  session: many(sessionSchema),
}));

export const ordersRelation = relations(ordersSchema, ({ one }) => ({
  order: one(usersSchema, {
    fields: [ordersSchema.userId],
    references: [usersSchema.id],
  }),
}));

export const esimsOrderItemsRelation = relations(esimsSchema, ({ many }) => ({
  orderItems: many(orderItemsSchema),
}));

export const ordersOrderItemsRelation = relations(esimsSchema, ({ many }) => ({
  orderItems: many(orderItemsSchema),
}));

export const orderItemsRelation = relations(orderItemsSchema, ({ one }) => ({
  esim: one(esimsSchema, {
    fields: [orderItemsSchema.esimId],
    references: [esimsSchema.id],
  }),
  order: one(ordersSchema, {
    fields: [orderItemsSchema.orderId],
    references: [ordersSchema.id],
  }),
}));

export const sessionRelation = relations(sessionSchema, ({ one }) => ({
  user: one(usersSchema, {
    fields: [sessionSchema.userId],
    references: [usersSchema.id],
  }),
}));
