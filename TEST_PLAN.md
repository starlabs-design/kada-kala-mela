# Kada Manager - User Test Plan

## Test Execution Date
October 14, 2025

## Test Objective
Comprehensive end-to-end testing of Kada Manager application with realistic dummy data for a Kerala shopkeeper scenario.

## Test Scenario
**Shop Profile:** "Raju's General Store" - A small grocery and provisions store in Kochi, Kerala
**Owner:** Raju Kumar
**Phone:** +91 9876543210

## Test Cases

### 1. Shop Settings Configuration
**Objective:** Verify shop details can be added and saved
- [ ] Navigate to Settings page
- [ ] Enter shop name: "Raju's General Store"
- [ ] Enter owner name: "Raju Kumar"
- [ ] Enter phone number: "+91 9876543210"
- [ ] Click Save Changes
- [ ] Verify success message appears
- [ ] Refresh page and verify data persists

### 2. Sellers Management
**Objective:** Test adding, editing, and managing seller contacts
- [ ] Add Seller 1: Ramesh Tea Supplier (Tea & Snacks, Calicut Market)
- [ ] Add Seller 2: Lakshmi Rice Mill (Rice & Grains, Ernakulam)
- [ ] Add Seller 3: Suresh Provisions Wholesale (Groceries, Kochi)
- [ ] Add Seller 4: Anita Spices Trader (Spices, Kozhikode)
- [ ] Test search functionality
- [ ] Test Call/WhatsApp button links
- [ ] Test edit functionality
- [ ] Test delete functionality (delete one seller)

### 3. Inventory Management
**Objective:** Test complete inventory CRUD operations
- [ ] Add Item 1: Chai Powder (Tea & Snacks, 10 kg, ₹500/kg, Low stock: 5kg)
- [ ] Add Item 2: Basmati Rice (Rice & Grains, 50 kg, ₹120/kg, Low stock: 10kg)
- [ ] Add Item 3: Sugar (Groceries, 25 kg, ₹45/kg, Low stock: 5kg)
- [ ] Add Item 4: Coconut Oil (Oil, 15 liters, ₹200/L, Low stock: 3L)
- [ ] Add Item 5: Red Chilli Powder (Spices, 5 kg, ₹350/kg, Low stock: 2kg)
- [ ] Add Item 6: Turmeric Powder (Spices, 8 kg, ₹300/kg, Low stock: 2kg)
- [ ] Add Item 7: Wheat Flour (Grains, 30 kg, ₹40/kg, Low stock: 10kg)
- [ ] Add Item 8: Toor Dal (Pulses, 20 kg, ₹150/kg, Low stock: 5kg)
- [ ] Test search functionality
- [ ] Test edit functionality (update price)
- [ ] Test low stock alerts visibility

### 4. Expense Transactions
**Objective:** Test expense tracking with various categories
- [ ] Add Expense 1: Electricity Bill - ₹3,500 (Bills & Utilities)
- [ ] Add Expense 2: Rent Payment - ₹15,000 (Rent)
- [ ] Add Expense 3: Stock Purchase from Lakshmi Rice Mill - ₹12,000 (Inventory Purchase)
- [ ] Add Expense 4: Employee Salary - ₹8,000 (Salaries)
- [ ] Add Expense 5: Shop Repairs - ₹2,500 (Maintenance)
- [ ] Filter by Expense type
- [ ] Test edit functionality
- [ ] Verify total expense calculation

### 5. Income Transactions
**Objective:** Test income/sales tracking
- [ ] Add Income 1: Daily Sales - ₹5,000 (Sales)
- [ ] Add Income 2: Daily Sales - ₹6,500 (Sales)
- [ ] Add Income 3: Daily Sales - ₹4,200 (Sales)
- [ ] Add Income 4: Daily Sales - ₹7,800 (Sales)
- [ ] Add Income 5: Daily Sales - ₹5,500 (Sales)
- [ ] Filter by Income type
- [ ] Test with linked inventory items
- [ ] Verify total income calculation

### 6. Dashboard Verification
**Objective:** Verify dashboard metrics accuracy
- [ ] Check Today's Profit calculation
- [ ] Verify Total Sales display
- [ ] Verify Total Expenses display
- [ ] Test quick action navigation buttons
- [ ] Check if metrics update in real-time

### 7. Reports Generation
**Objective:** Test reporting functionality
- [ ] Test "This Week" report view
- [ ] Test "This Month" report view
- [ ] Test "Custom Month" date picker
- [ ] Verify Total Sales calculation
- [ ] Verify Total Expenses calculation
- [ ] Verify Net Profit calculation
- [ ] Check Category Performance data
- [ ] Test with various date ranges

### 8. Pricing List
**Objective:** Test pricing list and export functionality
- [ ] Verify all inventory items appear in pricing list
- [ ] Test search functionality
- [ ] Test PDF download button
- [ ] Verify pricing accuracy

### 9. Theme & Preferences
**Objective:** Test dark mode and preferences
- [ ] Toggle dark mode ON
- [ ] Verify theme persists after page refresh
- [ ] Check UI readability in dark mode
- [ ] Toggle dark mode OFF
- [ ] Test on multiple pages

### 10. Backup & Restore
**Objective:** Test data backup and restore functionality
- [ ] Download backup file
- [ ] Verify JSON structure
- [ ] Clear some data (delete 2 items)
- [ ] Upload backup file
- [ ] Verify all data restored correctly
- [ ] Check relational integrity

## Test Data Summary

### Sellers (4 total)
1. Ramesh Tea Supplier - +91 9876543211
2. Lakshmi Rice Mill - +91 9876543212
3. Suresh Provisions Wholesale - +91 9876543213
4. Anita Spices Trader - +91 9876543214

### Inventory Items (8 total)
1. Chai Powder - ₹500/kg
2. Basmati Rice - ₹120/kg
3. Sugar - ₹45/kg
4. Coconut Oil - ₹200/L
5. Red Chilli Powder - ₹350/kg
6. Turmeric Powder - ₹300/kg
7. Wheat Flour - ₹40/kg
8. Toor Dal - ₹150/kg

### Expenses (5 total) = ₹41,000
1. Electricity Bill - ₹3,500
2. Rent - ₹15,000
3. Stock Purchase - ₹12,000
4. Salaries - ₹8,000
5. Repairs - ₹2,500

### Income (5 total) = ₹29,000
1-5. Daily Sales totaling ₹29,000

### Expected Calculations
- Total Income: ₹29,000
- Total Expenses: ₹41,000
- Net Profit: -₹12,000 (Loss)

## Test Results
Results will be documented after test execution.
