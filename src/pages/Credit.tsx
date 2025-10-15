import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CreditCard, DollarSign, AlertCircle, User } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import SideNav from "@/components/SideNav";

interface Customer {
  id: number;
  name: string;
  phone?: string;
}

interface Bill {
  id: number;
  billNumber: string;
  customerId?: number;
  totalAmount: number;
  amountPaid: number;
  balanceDue: number;
  status: string;
  date: string;
}

interface CustomerDue {
  customerId: number;
  customerName: string;
  customerPhone?: string;
  totalDue: number;
  pendingBillsCount: number;
  bills: Bill[];
}

export default function Credit() {
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDue | null>(null);
  const [selectedBillId, setSelectedBillId] = useState<string>("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentRemarks, setPaymentRemarks] = useState("");
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const queryClient = useQueryClient();

  const { data: bills = [], isLoading } = useQuery<Bill[]>({
    queryKey: ["/api/bills"],
    queryFn: async () => {
      const response = await fetch("/api/bills");
      if (!response.ok) throw new Error("Failed to fetch bills");
      return response.json();
    },
  });

  const { data: customers = [] } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
    queryFn: async () => {
      const response = await fetch("/api/customers");
      if (!response.ok) throw new Error("Failed to fetch customers");
      return response.json();
    },
  });

  const addPaymentMutation = useMutation({
    mutationFn: async ({ billId, amount, remarks }: { billId: number; amount: number; remarks?: string }) => {
      const response = await fetch(`/api/bills/${billId}/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, remarks }),
      });
      if (!response.ok) throw new Error("Failed to add payment");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bills"] });
      setShowPaymentDialog(false);
      setPaymentAmount("");
      setPaymentRemarks("");
      setSelectedBillId("");
      setSelectedCustomer(null);
      toast.success("Payment recorded successfully");
    },
    onError: () => {
      toast.error("Failed to record payment");
    },
  });

  // Group bills by customer and calculate total due per customer
  const customerDues: CustomerDue[] = customers
    .map(customer => {
      const customerBills = bills.filter(
        bill => bill.customerId === customer.id && (bill.status === "due" || bill.status === "partially_paid")
      );
      
      if (customerBills.length === 0) return null;
      
      const totalDue = customerBills.reduce((sum, bill) => sum + bill.balanceDue, 0);
      
      return {
        customerId: customer.id,
        customerName: customer.name,
        customerPhone: customer.phone,
        totalDue,
        pendingBillsCount: customerBills.length,
        bills: customerBills,
      };
    })
    .filter((cd): cd is CustomerDue => cd !== null)
    .sort((a, b) => b.totalDue - a.totalDue); // Sort by highest due first

  const totalOutstanding = customerDues.reduce((sum, cd) => sum + cd.totalDue, 0);

  const handlePaymentClick = (customer: CustomerDue) => {
    setSelectedCustomer(customer);
    setShowPaymentDialog(true);
  };

  const handlePaymentSubmit = () => {
    if (!selectedCustomer || !selectedBillId) {
      toast.error("Please select a bill");
      return;
    }
    
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const selectedBill = selectedCustomer.bills.find(b => b.id === parseInt(selectedBillId));
    if (!selectedBill) {
      toast.error("Bill not found");
      return;
    }

    if (amount > selectedBill.balanceDue) {
      toast.error("Payment amount cannot exceed balance due");
      return;
    }

    addPaymentMutation.mutate({
      billId: parseInt(selectedBillId),
      amount,
      remarks: paymentRemarks || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-background lg:ml-[280px]">
      <SideNav />
      {/* Header */}
      <div className="bg-primary text-primary-foreground pl-6 pr-16 lg:px-6 py-8 rounded-b-3xl shadow-lg">
        <h1 className="text-2xl font-bold mb-2">Credit Tracking</h1>
        <p className="text-primary-foreground/90 text-sm">ക്രെഡിറ്റ് ട്രാക്കിംഗ്</p>
      </div>

      <div className="px-4 -mt-4 space-y-4">
        {/* Total Due Summary */}
        <Card className="shadow-lg border-0 bg-gradient-to-r from-red-500/10 to-orange-500/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Outstanding</p>
                <p className="text-3xl font-bold text-destructive">Rs.{totalOutstanding.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground mt-1">{customerDues.length} customers with pending dues</p>
              </div>
              <AlertCircle className="h-12 w-12 text-destructive" />
            </div>
          </CardContent>
        </Card>

        {/* Customer Dues List */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle>Customer Due Payments</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center text-muted-foreground py-8">Loading...</p>
            ) : customerDues.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No pending payments</p>
            ) : (
              <div className="space-y-4">
                {customerDues.map((customer) => (
                  <Card key={customer.customerId} className="border shadow-sm">
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-primary/10 rounded-full">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-lg">{customer.customerName}</p>
                            {customer.customerPhone && (
                              <p className="text-sm text-muted-foreground">{customer.customerPhone}</p>
                            )}
                            <p className="text-sm text-muted-foreground mt-1">
                              {customer.pendingBillsCount} pending {customer.pendingBillsCount === 1 ? 'bill' : 'bills'}
                            </p>
                          </div>
                        </div>

                        <div className="border-t pt-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm text-muted-foreground">Total Due</p>
                              <p className="text-2xl font-bold text-red-600">Rs.{customer.totalDue.toFixed(2)}</p>
                            </div>
                            <Button
                              onClick={() => handlePaymentClick(customer)}
                              size="sm"
                            >
                              <DollarSign className="w-4 h-4 mr-2" />
                              Receive Payment
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Receive Payment</DialogTitle>
            <DialogDescription>
              Record payment for {selectedCustomer?.customerName}
            </DialogDescription>
          </DialogHeader>
          
          {selectedCustomer && (
            <div className="space-y-4">
              <div className="bg-muted p-3 rounded-md space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Customer:</span>
                  <span className="font-semibold">{selectedCustomer.customerName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Outstanding:</span>
                  <span className="font-semibold text-red-600">Rs.{selectedCustomer.totalDue.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Select Bill *</Label>
                <Select value={selectedBillId} onValueChange={setSelectedBillId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a bill to pay" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedCustomer.bills.map((bill) => (
                      <SelectItem key={bill.id} value={bill.id.toString()}>
                        {bill.billNumber} - Rs.{bill.balanceDue.toFixed(2)} due ({format(new Date(bill.date), "dd/MM/yy")})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedBillId && (() => {
                const bill = selectedCustomer.bills.find(b => b.id === parseInt(selectedBillId));
                return bill ? (
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-md space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Bill Total:</span>
                      <span className="font-semibold">Rs.{bill.totalAmount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Already Paid:</span>
                      <span className="font-semibold text-green-600">Rs.{bill.amountPaid}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Balance Due:</span>
                      <span className="font-semibold text-red-600">Rs.{bill.balanceDue}</span>
                    </div>
                  </div>
                ) : null;
              })()}

              <div className="space-y-2">
                <Label>Payment Amount *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="Enter amount"
                />
              </div>

              <div className="space-y-2">
                <Label>Remarks (Optional)</Label>
                <Input
                  value={paymentRemarks}
                  onChange={(e) => setPaymentRemarks(e.target.value)}
                  placeholder="Any notes about this payment"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowPaymentDialog(false);
              setSelectedBillId("");
              setPaymentAmount("");
              setPaymentRemarks("");
            }}>
              Cancel
            </Button>
            <Button onClick={handlePaymentSubmit}>
              Record Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
