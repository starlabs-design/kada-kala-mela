// Test Data Seeding Script for Kada Manager
// This script populates the database with comprehensive test data

const API_BASE = "http://localhost:5000/api";

async function seedTestData() {
  console.log("🌱 Starting test data seeding...\n");

  try {
    // 1. Update Shop Settings
    console.log("1️⃣ Updating shop settings...");
    const settingsResponse = await fetch(`${API_BASE}/settings`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shopName: "Raju's General Store",
        ownerName: "Raju Kumar",
        shopPhone: "+91 9876543210",
      }),
    });
    console.log("✅ Shop settings updated\n");

    // 2. Add Sellers
    console.log("2️⃣ Adding sellers...");
    const sellers = [
      {
        name: "Lakshmi Rice Mill",
        phone: "+91 9876543212",
        productType: "Rice & Grains",
        address: "Ernakulam",
        notes: "Premium quality rice supplier",
      },
      {
        name: "Suresh Provisions Wholesale",
        phone: "+91 9876543213",
        productType: "Groceries",
        address: "Kochi",
        notes: "Bulk grocery supplier",
      },
      {
        name: "Anita Spices Trader",
        phone: "+91 9876543214",
        productType: "Spices",
        address: "Kozhikode",
        notes: "Authentic Kerala spices",
      },
    ];

    const sellerIds = [];
    for (const seller of sellers) {
      const response = await fetch(`${API_BASE}/sellers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(seller),
      });
      const data = await response.json();
      sellerIds.push(data.id);
      console.log(`   ✓ Added: ${seller.name}`);
    }
    console.log(`✅ ${sellers.length} sellers added\n`);

    // 3. Add Inventory Items
    console.log("3️⃣ Adding inventory items...");
    const inventoryItems = [
      {
        name: "Basmati Rice",
        category: "Rice & Grains",
        quantity: 50,
        unit: "kg",
        purchasePrice: 100,
        sellingPrice: 120,
        sellerId: sellerIds[0],
        lowStockAlert: true,
      },
      {
        name: "Sugar",
        category: "Groceries",
        quantity: 25,
        unit: "kg",
        purchasePrice: 40,
        sellingPrice: 45,
        sellerId: sellerIds[1],
        lowStockAlert: true,
      },
      {
        name: "Coconut Oil",
        category: "Oil",
        quantity: 15,
        unit: "liters",
        purchasePrice: 180,
        sellingPrice: 200,
        sellerId: sellerIds[1],
        lowStockAlert: true,
      },
      {
        name: "Red Chilli Powder",
        category: "Spices",
        quantity: 5,
        unit: "kg",
        purchasePrice: 320,
        sellingPrice: 350,
        sellerId: sellerIds[2],
        lowStockAlert: true,
      },
      {
        name: "Turmeric Powder",
        category: "Spices",
        quantity: 8,
        unit: "kg",
        purchasePrice: 280,
        sellingPrice: 300,
        sellerId: sellerIds[2],
        lowStockAlert: true,
      },
      {
        name: "Wheat Flour",
        category: "Grains",
        quantity: 30,
        unit: "kg",
        purchasePrice: 35,
        sellingPrice: 40,
        sellerId: sellerIds[0],
        lowStockAlert: false,
      },
      {
        name: "Toor Dal",
        category: "Pulses",
        quantity: 20,
        unit: "kg",
        purchasePrice: 130,
        sellingPrice: 150,
        sellerId: sellerIds[1],
        lowStockAlert: true,
      },
    ];

    for (const item of inventoryItems) {
      const response = await fetch(`${API_BASE}/inventory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      console.log(`   ✓ Added: ${item.name} (${item.quantity} ${item.unit})`);
    }
    console.log(`✅ ${inventoryItems.length} inventory items added\n`);

    // 4. Add Expense Transactions
    console.log("4️⃣ Adding expense transactions...");
    const today = new Date().toISOString().split('T')[0];
    const expenses = [
      {
        type: "expense" as const,
        category: "Bills & Utilities",
        amount: 3500,
        date: today,
        notes: "Monthly electricity bill",
      },
      {
        type: "expense" as const,
        category: "Rent",
        amount: 15000,
        date: today,
        notes: "Shop rent for the month",
      },
      {
        type: "expense" as const,
        category: "Inventory Purchase",
        amount: 12000,
        date: today,
        notes: "Stock purchase from Lakshmi Rice Mill",
      },
      {
        type: "expense" as const,
        category: "Salaries",
        amount: 8000,
        date: today,
        notes: "Employee salary payment",
      },
      {
        type: "expense" as const,
        category: "Maintenance",
        amount: 2500,
        date: today,
        notes: "Shop repairs and maintenance",
      },
    ];

    let totalExpenses = 0;
    for (const expense of expenses) {
      const response = await fetch(`${API_BASE}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expense),
      });
      totalExpenses += expense.amount;
      console.log(`   ✓ Added: ${expense.category} - ₹${expense.amount}`);
    }
    console.log(`✅ ${expenses.length} expenses added (Total: ₹${totalExpenses})\n`);

    // 5. Add Income Transactions
    console.log("5️⃣ Adding income transactions...");
    const income = [
      {
        type: "income" as const,
        category: "Sales",
        amount: 5000,
        date: today,
        notes: "Daily sales - Day 1",
      },
      {
        type: "income" as const,
        category: "Sales",
        amount: 6500,
        date: today,
        notes: "Daily sales - Day 2",
      },
      {
        type: "income" as const,
        category: "Sales",
        amount: 4200,
        date: today,
        notes: "Daily sales - Day 3",
      },
      {
        type: "income" as const,
        category: "Sales",
        amount: 7800,
        date: today,
        notes: "Daily sales - Day 4",
      },
      {
        type: "income" as const,
        category: "Sales",
        amount: 5500,
        date: today,
        notes: "Daily sales - Day 5",
      },
    ];

    let totalIncome = 0;
    for (const inc of income) {
      const response = await fetch(`${API_BASE}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inc),
      });
      totalIncome += inc.amount;
      console.log(`   ✓ Added: ${inc.notes} - ₹${inc.amount}`);
    }
    console.log(`✅ ${income.length} income transactions added (Total: ₹${totalIncome})\n`);

    // Summary
    console.log("📊 TEST DATA SUMMARY");
    console.log("=".repeat(50));
    console.log(`✅ Shop Settings: Updated`);
    console.log(`✅ Sellers: ${sellers.length} added`);
    console.log(`✅ Inventory Items: ${inventoryItems.length} added`);
    console.log(`✅ Expense Transactions: ${expenses.length} added (₹${totalExpenses})`);
    console.log(`✅ Income Transactions: ${income.length} added (₹${totalIncome})`);
    console.log(`\n💰 Net Profit: ₹${totalIncome - totalExpenses} ${totalIncome - totalExpenses >= 0 ? '(Profit)' : '(Loss)'}`);
    console.log("=".repeat(50));
    console.log("\n✨ Test data seeding completed successfully!");

  } catch (error) {
    console.error("❌ Error seeding test data:", error);
    throw error;
  }
}

// Run the seeding
seedTestData();
