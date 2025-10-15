import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download, Plus, Trash2, FileText, Receipt, History } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { inventoryAPI, settingsAPI, billsAPI } from "@/lib/api";
import BottomNav from "@/components/BottomNav";
import SideNav from "@/components/SideNav";

interface InventoryItem {
  id: number;
  name: string;
  sellingPrice: number;
  unit: string;
  quantity: number;
}

interface Customer {
  id: number;
  name: string;
  phone?: string;
  notes?: string;
}

interface BillItem {
  inventoryItemId: number;
  name: string;
  quantity: string;
  rate: number;
  total: number;
  unit: string;
}

export default function Billing() {
  const navigate = useNavigate();
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [itemQuantity, setItemQuantity] = useState<string>("");
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [amountPaid, setAmountPaid] = useState<string>("");
  const [showNewCustomerDialog, setShowNewCustomerDialog] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  const [newCustomerNotes, setNewCustomerNotes] = useState("");
  const [lastSavedBillNumber, setLastSavedBillNumber] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: inventoryItems = [] } = useQuery<InventoryItem[]>({
    queryKey: ["/api/inventory"],
    queryFn: inventoryAPI.getAll,
  });

  const { data: customers = [] } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
    queryFn: async () => {
      const response = await fetch("/api/customers");
      if (!response.ok) throw new Error("Failed to fetch customers");
      return response.json();
    },
  });

  const { data: settings } = useQuery({
    queryKey: ["/api/settings"],
    queryFn: settingsAPI.get,
  });

  const createCustomerMutation = useMutation({
    mutationFn: async (data: { name: string; phone?: string; notes?: string }) => {
      const response = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create customer");
      }
      return response.json();
    },
    onSuccess: (customer) => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      setSelectedCustomer(customer.id.toString());
      setLastSavedBillNumber(null); // Reset saved state when new customer is added
      setShowNewCustomerDialog(false);
      setNewCustomerName("");
      setNewCustomerPhone("");
      setNewCustomerNotes("");
      toast.success("Customer added successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const createBillMutation = useMutation({
    mutationFn: billsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bills"] });
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
    },
  });

  const addItemToBill = () => {
    if (!selectedItem || !itemQuantity) {
      toast.error("Please select an item and enter quantity");
      return;
    }

    const item = inventoryItems.find((i) => i.id === parseInt(selectedItem));
    if (!item) {
      toast.error("Item not found");
      return;
    }

    const quantityNum = parseFloat(itemQuantity);
    
    if (item.unit.toLowerCase() !== "kg" && !Number.isInteger(quantityNum)) {
      toast.error("For non-kg items, please enter whole numbers only");
      return;
    }

    if (quantityNum <= 0) {
      toast.error("Quantity must be greater than 0");
      return;
    }

    if (quantityNum > item.quantity) {
      toast.error(`Not enough stock. Available: ${item.quantity} ${item.unit}`);
      return;
    }

    const total = parseFloat((quantityNum * item.sellingPrice).toFixed(2));

    setBillItems([
      ...billItems,
      {
        inventoryItemId: item.id,
        name: item.name,
        quantity: itemQuantity,
        rate: item.sellingPrice,
        total,
        unit: item.unit,
      },
    ]);

    setSelectedItem("");
    setItemQuantity("");
    setLastSavedBillNumber(null); // Reset saved state when items change
  };

  const removeItemFromBill = (index: number) => {
    setBillItems(billItems.filter((_, i) => i !== index));
    setLastSavedBillNumber(null); // Reset saved state when items change
  };

  const subtotal = parseFloat(billItems.reduce((sum, item) => sum + item.total, 0).toFixed(2));
  const totalAmount = subtotal;
  const paidAmount = parseFloat(amountPaid || "0");
  const balanceDue = totalAmount - paidAmount;

  const generateBillNumber = () => {
    const timestamp = Date.now();
    return `BILL-${timestamp}`;
  };

  const handleNewCustomerClick = () => {
    setShowNewCustomerDialog(true);
  };

  const createNewCustomer = () => {
    if (!newCustomerName.trim()) {
      toast.error("Please enter customer name");
      return;
    }
    createCustomerMutation.mutate({
      name: newCustomerName.trim(),
      phone: newCustomerPhone || undefined,
      notes: newCustomerNotes || undefined,
    });
  };

  const saveBill = async () => {
    if (billItems.length === 0) {
      toast.error("Please add at least one item to the bill");
      return;
    }

    try {
      const billNumber = generateBillNumber();
      const today = format(new Date(), "yyyy-MM-dd");
      const paid = parseFloat(amountPaid || "0");
      const balance = totalAmount - paid;
      const status = balance <= 0 ? "paid" : paid > 0 ? "partially_paid" : "due";

      const billData = {
        billNumber,
        customerId: selectedCustomer ? parseInt(selectedCustomer) : undefined,
        subtotal,
        totalAmount,
        amountPaid: paid,
        balanceDue: balance,
        status,
        date: today,
        items: billItems,
      };

      await createBillMutation.mutateAsync(billData);
      setLastSavedBillNumber(billNumber);
      toast.success("Bill saved successfully! You can now download PDF.");
      
      return billNumber;
    } catch (error) {
      toast.error("Failed to save bill");
      throw error;
    }
  };

  const generatePDF = () => {
    if (billItems.length === 0) {
      toast.error("Please add at least one item to the bill");
      return;
    }

    if (!lastSavedBillNumber) {
      toast.error("Please save the bill first before generating PDF");
      return;
    }

    try {
      const billNumber = lastSavedBillNumber;
      const customer = customers.find(c => c.id === parseInt(selectedCustomer));
      const paid = parseFloat(amountPaid || "0");
      const balance = totalAmount - paid;
      
      const doc = new jsPDF();
      
      doc.setFontSize(20);
      doc.text(settings?.shopName || "Store Name", 105, 20, { align: "center" });
      
      doc.setFontSize(10);
      if (settings?.shopPhone) {
        doc.text(`Phone: ${settings.shopPhone}`, 105, 28, { align: "center" });
      }
      
      doc.setFontSize(12);
      doc.text(`Bill Number: ${billNumber}`, 20, 45);
      doc.text(`Date: ${format(new Date(), "dd/MM/yyyy")}`, 20, 52);
      
      if (customer) {
        doc.text(`Customer: ${customer.name}`, 20, 59);
        if (customer.phone) {
          doc.text(`Phone: ${customer.phone}`, 20, 66);
        }
      }
      
      const tableData = billItems.map((item) => [
        item.name,
        `${item.quantity} ${item.unit}`,
        `Rs.${item.rate}`,
        `Rs.${item.total}`,
      ]);
      
      autoTable(doc, {
        startY: customer ? 75 : 65,
        head: [["Item Name", "Quantity", "Rate", "Total"]],
        body: tableData,
        theme: "grid",
        headStyles: { fillColor: [34, 197, 94] },
      });
      
      const finalY = (doc as any).lastAutoTable.finalY + 10;
      
      doc.setFontSize(12);
      doc.text(`Subtotal: Rs.${subtotal}`, 20, finalY);
      doc.text(`Amount Paid: Rs.${paidAmount}`, 20, finalY + 7);
      doc.setFont(undefined, 'bold');
      doc.text(`Balance Due: Rs.${balance.toFixed(2)}`, 20, finalY + 14);
      
      if (balance <= 0) {
        doc.setTextColor(0, 128, 0);
        doc.text("PAID IN FULL", 105, finalY + 25, { align: "center" });
      }
      
      doc.save(`${billNumber}.pdf`);
      toast.success("PDF downloaded successfully");
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate PDF");
    }
  };

  const saveAndDownloadPDF = async () => {
    try {
      await saveBill();
      // Small delay to ensure state is updated
      setTimeout(() => {
        generatePDF();
        // Reset form after both operations
        setBillItems([]);
        setSelectedCustomer("");
        setAmountPaid("");
        setLastSavedBillNumber(null);
      }, 100);
    } catch (error) {
      console.error("Error in save and download:", error);
    }
  };

  const newBill = () => {
    setBillItems([]);
    setSelectedItem("");
    setItemQuantity("");
    setSelectedCustomer("");
    setAmountPaid("");
    setLastSavedBillNumber(null);
    toast.success("Ready for new bill");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <SideNav />
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-6 py-8 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Billing</h1>
            <p className="text-primary-foreground/90 text-sm">ബില്ലിംഗ്</p>
          </div>
          <Receipt className="h-10 w-10" />
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-4">
        <div className="flex justify-end gap-2">
          <Button onClick={() => navigate("/billing-history")} variant="outline" size="sm">
            <History className="w-4 h-4 mr-2" />
            Billing History
          </Button>
          <Button onClick={newBill} variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            New Bill
          </Button>
        </div>

        {/* Customer Selection */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle>Customer Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Select Customer (Optional)</Label>
                <Select value={selectedCustomer} onValueChange={(value) => {
                  setSelectedCustomer(value);
                  setLastSavedBillNumber(null); // Reset saved state when customer changes
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose or add customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id.toString()}>
                        {customer.name} {customer.phone ? `- ${customer.phone}` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button onClick={handleNewCustomerClick} variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Customer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle>Add Items</CardTitle>
          </CardHeader>
          <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Select Item</Label>
              <Select value={selectedItem} onValueChange={setSelectedItem}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an item" />
                </SelectTrigger>
                <SelectContent>
                  {inventoryItems.map((item) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {item.name} - Rs.{item.sellingPrice} ({item.quantity} {item.unit} available)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input
                type="number"
                step={selectedItem && inventoryItems.find(i => i.id === parseInt(selectedItem))?.unit.toLowerCase() === "kg" ? "0.01" : "1"}
                value={itemQuantity}
                onChange={(e) => setItemQuantity(e.target.value)}
                placeholder="Enter quantity"
              />
            </div>

            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button onClick={addItemToBill} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add to Bill
              </Button>
            </div>
          </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle>Bill Items</CardTitle>
          </CardHeader>
          <CardContent>
          {billItems.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No items added yet</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {billItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.quantity} {item.unit}</TableCell>
                      <TableCell>Rs.{item.rate}</TableCell>
                      <TableCell>Rs.{item.total}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItemFromBill(index)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-6 space-y-4">
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg">
                    <span>Total Amount:</span>
                    <span className="font-semibold">Rs.{totalAmount}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Amount Paid</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={amountPaid}
                      onChange={(e) => {
                        setAmountPaid(e.target.value);
                        setLastSavedBillNumber(null); // Reset saved state when payment changes
                      }}
                      placeholder="Enter amount paid"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Balance Due</Label>
                    <Input
                      type="text"
                      value={`Rs.${balanceDue.toFixed(2)}`}
                      readOnly
                      className={balanceDue > 0 ? "text-red-600 font-semibold" : "text-green-600 font-semibold"}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button onClick={saveBill} variant="outline" size="lg">
                    <FileText className="w-4 h-4 mr-2" />
                    Save Bill
                  </Button>
                  <Button onClick={generatePDF} variant="outline" size="lg" disabled={!lastSavedBillNumber}>
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button onClick={saveAndDownloadPDF} size="lg">
                    <Download className="w-4 h-4 mr-2" />
                    Save & Download PDF
                  </Button>
                </div>
              </div>
            </>
          )}
          </CardContent>
        </Card>
      </div>

      {/* New Customer Dialog */}
      <Dialog open={showNewCustomerDialog} onOpenChange={setShowNewCustomerDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>
              Enter customer details. Name is required.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Customer Name *</Label>
              <Input
                value={newCustomerName}
                onChange={(e) => setNewCustomerName(e.target.value)}
                placeholder="Enter customer name"
              />
            </div>
            <div className="space-y-2">
              <Label>Phone (Optional)</Label>
              <Input
                value={newCustomerPhone}
                onChange={(e) => setNewCustomerPhone(e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
            <div className="space-y-2">
              <Label>Notes (Optional)</Label>
              <Input
                value={newCustomerNotes}
                onChange={(e) => setNewCustomerNotes(e.target.value)}
                placeholder="Enter any notes"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewCustomerDialog(false)}>
              Cancel
            </Button>
            <Button onClick={createNewCustomer}>
              Add Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
}
