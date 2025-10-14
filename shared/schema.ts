import { pgTable, serial, varchar, integer, boolean, timestamp, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const inventoryItems = pgTable("inventory_items", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  quantity: integer("quantity").notNull().default(0),
  unit: varchar("unit", { length: 50 }).notNull(),
  purchasePrice: integer("purchase_price").notNull(),
  sellingPrice: integer("selling_price").notNull(),
  sellerId: integer("seller_id").references(() => sellers.id, { onDelete: "set null" }),
  lowStockAlert: boolean("low_stock_alert").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

const baseInventorySchema = createInsertSchema(inventoryItems);
export const insertInventoryItemSchema = baseInventorySchema.omit({
  id: true,
  createdAt: true,
});

export type InsertInventoryItem = z.infer<typeof insertInventoryItemSchema>;
export type InventoryItem = typeof inventoryItems.$inferSelect;

export const sellers = pgTable("sellers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  productType: varchar("product_type", { length: 100 }).notNull(),
  address: text("address"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

const baseSellerSchema = createInsertSchema(sellers);
export const insertSellerSchema = baseSellerSchema.omit({
  id: true,
  createdAt: true,
});

export type InsertSeller = z.infer<typeof insertSellerSchema>;
export type Seller = typeof sellers.$inferSelect;

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 10 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  amount: integer("amount").notNull(),
  date: varchar("date", { length: 10 }).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

const baseTransactionSchema = createInsertSchema(transactions);
export const insertTransactionSchema = baseTransactionSchema.omit({
  id: true,
  createdAt: true,
});

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;

export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  shopName: varchar("shop_name", { length: 255 }),
  ownerName: varchar("owner_name", { length: 255 }),
  shopPhone: varchar("shop_phone", { length: 20 }),
  language: varchar("language", { length: 10 }).default("en"),
  darkMode: boolean("dark_mode").default(false),
  lowStockLimitKg: integer("low_stock_limit_kg").default(10),
  lowStockLimitLiters: integer("low_stock_limit_liters").default(10),
  lowStockLimitPack: integer("low_stock_limit_pack").default(10),
  lowStockLimitPieces: integer("low_stock_limit_pieces").default(10),
  lowStockLimitDefault: integer("low_stock_limit_default").default(10),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

const baseSettingsSchema = createInsertSchema(settings);
export const insertSettingsSchema = baseSettingsSchema.omit({
  id: true,
  updatedAt: true,
});

export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type Settings = typeof settings.$inferSelect;
