import { Router, type Request, type Response } from "express";
import { storage } from "./storage";
import { insertInventoryItemSchema, insertSellerSchema, insertTransactionSchema, insertSettingsSchema } from "@shared/schema";

const router = Router();

router.get("/api/inventory", async (_req: Request, res: Response) => {
  try {
    const items = await storage.getInventoryItems();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch inventory items" });
  }
});

router.post("/api/inventory", async (req: Request, res: Response) => {
  try {
    const data = insertInventoryItemSchema.parse(req.body);
    const item = await storage.createInventoryItem(data);
    res.json(item);
  } catch (error) {
    res.status(400).json({ error: "Invalid data" });
  }
});

router.patch("/api/inventory/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const data = insertInventoryItemSchema.partial().parse(req.body);
    const item = await storage.updateInventoryItem(id, data);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json(item);
  } catch (error) {
    res.status(400).json({ error: "Invalid data" });
  }
});

router.delete("/api/inventory/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await storage.deleteInventoryItem(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete item" });
  }
});

router.get("/api/sellers", async (_req: Request, res: Response) => {
  try {
    const sellers = await storage.getSellers();
    res.json(sellers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sellers" });
  }
});

router.post("/api/sellers", async (req: Request, res: Response) => {
  try {
    const data = insertSellerSchema.parse(req.body);
    const seller = await storage.createSeller(data);
    res.json(seller);
  } catch (error) {
    res.status(400).json({ error: "Invalid data" });
  }
});

router.patch("/api/sellers/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const data = insertSellerSchema.partial().parse(req.body);
    const seller = await storage.updateSeller(id, data);
    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }
    res.json(seller);
  } catch (error) {
    res.status(400).json({ error: "Invalid data" });
  }
});

router.delete("/api/sellers/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await storage.deleteSeller(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete seller" });
  }
});

router.get("/api/transactions", async (_req: Request, res: Response) => {
  try {
    const transactions = await storage.getTransactions();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

router.post("/api/transactions", async (req: Request, res: Response) => {
  try {
    const data = insertTransactionSchema.parse(req.body);
    const transaction = await storage.createTransaction(data);
    res.json(transaction);
  } catch (error) {
    res.status(400).json({ error: "Invalid data" });
  }
});

router.patch("/api/transactions/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const data = insertTransactionSchema.partial().parse(req.body);
    const transaction = await storage.updateTransaction(id, data);
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.json(transaction);
  } catch (error) {
    res.status(400).json({ error: "Invalid data" });
  }
});

router.delete("/api/transactions/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await storage.deleteTransaction(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete transaction" });
  }
});

router.get("/api/settings", async (_req: Request, res: Response) => {
  try {
    const settings = await storage.getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

router.patch("/api/settings", async (req: Request, res: Response) => {
  try {
    const data = insertSettingsSchema.partial().parse(req.body);
    const settings = await storage.updateSettings(data);
    res.json(settings);
  } catch (error) {
    res.status(400).json({ error: "Invalid data" });
  }
});

export default router;
