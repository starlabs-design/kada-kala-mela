import { db } from "./db";
import { inventoryItems, sellers, transactions, settings, bills, billItems } from "@shared/schema";
import type { 
  InventoryItem, 
  InsertInventoryItem, 
  Seller, 
  InsertSeller, 
  Transaction, 
  InsertTransaction,
  Settings,
  InsertSettings,
  Bill,
  InsertBill,
  BillItem,
  InsertBillItem
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getInventoryItems(): Promise<InventoryItem[]>;
  getInventoryItem(id: number): Promise<InventoryItem | undefined>;
  createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem>;
  updateInventoryItem(id: number, item: Partial<InsertInventoryItem>): Promise<InventoryItem | undefined>;
  deleteInventoryItem(id: number): Promise<void>;

  getSellers(): Promise<Seller[]>;
  getSeller(id: number): Promise<Seller | undefined>;
  createSeller(seller: InsertSeller): Promise<Seller>;
  updateSeller(id: number, seller: Partial<InsertSeller>): Promise<Seller | undefined>;
  deleteSeller(id: number): Promise<void>;

  getTransactions(): Promise<Transaction[]>;
  getTransaction(id: number): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: number, transaction: Partial<InsertTransaction>): Promise<Transaction | undefined>;
  deleteTransaction(id: number): Promise<void>;

  getSettings(): Promise<Settings | undefined>;
  updateSettings(settings: Partial<InsertSettings>): Promise<Settings>;

  getBills(): Promise<Bill[]>;
  getBill(id: number): Promise<Bill | undefined>;
  createBill(bill: InsertBill): Promise<Bill>;
  getBillItems(billId: number): Promise<BillItem[]>;
  createBillItem(item: InsertBillItem): Promise<BillItem>;
}

export class DbStorage implements IStorage {
  async getInventoryItems(): Promise<InventoryItem[]> {
    return await db.select().from(inventoryItems).orderBy(desc(inventoryItems.createdAt));
  }

  async getInventoryItem(id: number): Promise<InventoryItem | undefined> {
    const result = await db.select().from(inventoryItems).where(eq(inventoryItems.id, id));
    return result[0];
  }

  async createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem> {
    const result = await db.insert(inventoryItems).values(item).returning();
    return result[0];
  }

  async updateInventoryItem(id: number, item: Partial<InsertInventoryItem>): Promise<InventoryItem | undefined> {
    const result = await db.update(inventoryItems).set(item).where(eq(inventoryItems.id, id)).returning();
    return result[0];
  }

  async deleteInventoryItem(id: number): Promise<void> {
    await db.delete(inventoryItems).where(eq(inventoryItems.id, id));
  }

  async getSellers(): Promise<Seller[]> {
    return await db.select().from(sellers).orderBy(desc(sellers.createdAt));
  }

  async getSeller(id: number): Promise<Seller | undefined> {
    const result = await db.select().from(sellers).where(eq(sellers.id, id));
    return result[0];
  }

  async createSeller(seller: InsertSeller): Promise<Seller> {
    const result = await db.insert(sellers).values(seller).returning();
    return result[0];
  }

  async updateSeller(id: number, seller: Partial<InsertSeller>): Promise<Seller | undefined> {
    const result = await db.update(sellers).set(seller).where(eq(sellers.id, id)).returning();
    return result[0];
  }

  async deleteSeller(id: number): Promise<void> {
    await db.delete(sellers).where(eq(sellers.id, id));
  }

  async getTransactions(): Promise<Transaction[]> {
    return await db.select().from(transactions).orderBy(desc(transactions.date), desc(transactions.createdAt));
  }

  async getTransaction(id: number): Promise<Transaction | undefined> {
    const result = await db.select().from(transactions).where(eq(transactions.id, id));
    return result[0];
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const result = await db.insert(transactions).values(transaction).returning();
    return result[0];
  }

  async updateTransaction(id: number, transaction: Partial<InsertTransaction>): Promise<Transaction | undefined> {
    const result = await db.update(transactions).set(transaction).where(eq(transactions.id, id)).returning();
    return result[0];
  }

  async deleteTransaction(id: number): Promise<void> {
    await db.delete(transactions).where(eq(transactions.id, id));
  }

  async getSettings(): Promise<Settings | undefined> {
    const result = await db.select().from(settings).limit(1);
    if (result.length === 0) {
      const defaultSettings = await db.insert(settings).values({}).returning();
      return defaultSettings[0];
    }
    return result[0];
  }

  async updateSettings(data: Partial<InsertSettings>): Promise<Settings> {
    const existing = await this.getSettings();
    if (existing) {
      const result = await db.update(settings).set(data).where(eq(settings.id, existing.id)).returning();
      return result[0];
    }
    const result = await db.insert(settings).values(data).returning();
    return result[0];
  }

  async getBills(): Promise<Bill[]> {
    return await db.select().from(bills).orderBy(desc(bills.createdAt));
  }

  async getBill(id: number): Promise<Bill | undefined> {
    const result = await db.select().from(bills).where(eq(bills.id, id));
    return result[0];
  }

  async createBill(bill: InsertBill): Promise<Bill> {
    const result = await db.insert(bills).values(bill).returning();
    return result[0];
  }

  async getBillItems(billId: number): Promise<BillItem[]> {
    return await db.select().from(billItems).where(eq(billItems.billId, billId));
  }

  async createBillItem(item: InsertBillItem): Promise<BillItem> {
    const result = await db.insert(billItems).values(item).returning();
    return result[0];
  }
}

export const storage = new DbStorage();
