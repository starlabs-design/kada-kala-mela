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
  lowStockAlert: boolean("low_stock_alert").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertInventoryItemSchema = createInsertSchema(inventoryItems, {
  name: z.string().min(1),
  category: z.string().min(1),
  quantity: z.number().int().min(0),
  unit: z.string().min(1),
  purchasePrice: z.number().int().min(0),
  sellingPrice: z.number().int().min(0),
  lowStockAlert: z.boolean(),
}).omit({
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

export const insertSellerSchema = createInsertSchema(sellers, {
  name: z.string().min(1),
  phone: z.string().min(1),
  productType: z.string().min(1),
  address: z.string().optional(),
  notes: z.string().optional(),
}).omit({
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

export const insertTransactionSchema = createInsertSchema(transactions, {
  type: z.enum(["income", "expense"]),
  category: z.string().min(1),
  amount: z.number().int(),
  date: z.string().min(1),
  notes: z.string().optional(),
}).omit({
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
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSettingsSchema = createInsertSchema(settings, {
  shopName: z.string().optional(),
  ownerName: z.string().optional(),
  shopPhone: z.string().optional(),
  language: z.string().optional(),
  darkMode: z.boolean().optional(),
}).omit({
  id: true,
  updatedAt: true,
});

export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type Settings = typeof settings.$inferSelect;
