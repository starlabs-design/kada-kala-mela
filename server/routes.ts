import { Router, type Request, type Response } from "express";
import { storage } from "./storage";
import { insertInventoryItemSchema, insertSellerSchema, insertTransactionSchema, insertSettingsSchema, insertBillSchema, insertBillItemSchema, insertCustomerSchema, insertPaymentSchema } from "@shared/schema";

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
    console.log("Transaction POST request body:", JSON.stringify(req.body, null, 2));
    const data = insertTransactionSchema.parse(req.body);
    console.log("Parsed transaction data:", JSON.stringify(data, null, 2));
    const transaction = await storage.createTransaction(data);
    res.json(transaction);
  } catch (error) {
    console.error("Transaction validation error:", error);
    res.status(400).json({ error: "Invalid data", details: error instanceof Error ? error.message : String(error) });
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

router.get("/api/bills", async (_req: Request, res: Response) => {
  try {
    const bills = await storage.getBills();
    res.json(bills);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bills" });
  }
});

router.get("/api/bills/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const bill = await storage.getBill(id);
    if (!bill) {
      return res.status(404).json({ error: "Bill not found" });
    }
    const items = await storage.getBillItems(id);
    res.json({ ...bill, items });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bill" });
  }
});

router.post("/api/bills", async (req: Request, res: Response) => {
  try {
    const { items, ...billData } = req.body;
    const billDataParsed = insertBillSchema.parse(billData);
    const bill = await storage.createBill(billDataParsed);
    
    if (items && Array.isArray(items)) {
      for (const item of items) {
        const itemData = insertBillItemSchema.parse({ ...item, billId: bill.id });
        await storage.createBillItem(itemData);
        
        const inventoryItem = await storage.getInventoryItem(item.inventoryItemId);
        if (inventoryItem) {
          const quantityNum = parseFloat(item.quantity);
          const newQuantity = inventoryItem.quantity - quantityNum;
          await storage.updateInventoryItem(item.inventoryItemId, { 
            quantity: Math.max(0, newQuantity)
          });
        }
      }
    }
    
    const billItems = await storage.getBillItems(bill.id);
    res.json({ ...bill, items: billItems });
  } catch (error) {
    console.error("Bill creation error:", error);
    res.status(400).json({ error: "Invalid data", details: error instanceof Error ? error.message : String(error) });
  }
});

router.get("/api/customers", async (_req: Request, res: Response) => {
  try {
    const customers = await storage.getCustomers();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch customers" });
  }
});

router.post("/api/customers", async (req: Request, res: Response) => {
  try {
    const data = insertCustomerSchema.parse(req.body);
    const existing = await storage.getCustomerByName(data.name);
    if (existing) {
      return res.status(400).json({ error: "Customer with this name already exists" });
    }
    const customer = await storage.createCustomer(data);
    res.json(customer);
  } catch (error) {
    res.status(400).json({ error: "Invalid data" });
  }
});

router.get("/api/bills/customer/:customerId", async (req: Request, res: Response) => {
  try {
    const customerId = parseInt(req.params.customerId);
    const bills = await storage.getBillsByCustomer(customerId);
    res.json(bills);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch customer bills" });
  }
});

router.post("/api/bills/:id/payment", async (req: Request, res: Response) => {
  try {
    const billId = parseInt(req.params.id);
    const { amount, remarks } = req.body;
    
    const bill = await storage.getBill(billId);
    if (!bill) {
      return res.status(404).json({ error: "Bill not found" });
    }
    
    const payment = await storage.createPayment({ billId, amount: parseFloat(amount), remarks });
    
    const newAmountPaid = (bill.amountPaid || 0) + parseFloat(amount);
    const newBalanceDue = bill.totalAmount - newAmountPaid;
    const newStatus = newBalanceDue <= 0 ? "paid" : newBalanceDue < bill.totalAmount ? "partially_paid" : "due";
    
    const updatedBill = await storage.updateBill(billId, {
      amountPaid: newAmountPaid,
      balanceDue: newBalanceDue,
      status: newStatus
    });
    
    res.json({ bill: updatedBill, payment });
  } catch (error) {
    console.error("Payment error:", error);
    res.status(400).json({ error: "Failed to process payment" });
  }
});

router.get("/api/bills/:id/payments", async (req: Request, res: Response) => {
  try {
    const billId = parseInt(req.params.id);
    const payments = await storage.getPayments(billId);
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch payments" });
  }
});

router.get("/api/bills/:id/items", async (req: Request, res: Response) => {
  try {
    const billId = parseInt(req.params.id);
    const items = await storage.getBillItems(billId);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bill items" });
  }
});

export default router;
