import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CreditCard, DollarSign, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import BottomNav from "@/components/BottomNav";

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

interface BillWithCustomer extends Bill {
  customerName?: string;
  customerPhone?: string;
}

export default function Credit() {
  const [selectedBill, setSelectedBill] = useState<BillWithCustomer | null>(null);
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
      setSelectedBill(null);
      toast.success("Payment recorded successfully");
    },
    onError: () => {
      toast.error("Failed to record payment");
    },
  });

  const billsWithCustomers: BillWithCustomer[] = bills.map(bill => {
    const customer = customers.find(c => c.id === bill.customerId);
    return {
      ...bill,
      customerName: customer?.name,
      customerPhone: customer?.phone,
    };
  });

  const dueBills = billsWithCustomers.filter(
    bill => bill.status === "due" || bill.status === "partially_paid"
  );

  const totalDue = dueBills.reduce((sum, bill) => sum + (bill.balanceDue || 0), 0);

  const handlePaymentClick = (bill: BillWithCustomer) => {
    setSelectedBill(bill);
    setShowPaymentDialog(true);
  };

  const handlePaymentSubmit = () => {
    if (!selectedBill) return;
    
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (amount > (selectedBill.balanceDue || 0)) {
      toast.error("Payment amount cannot exceed balance due");
      return;
    }

    addPaymentMutation.mutate({
      billId: selectedBill.id,
      amount,
      remarks: paymentRemarks || undefined,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500">Paid</Badge>;
      case "partially_paid":
        return <Badge className="bg-yellow-500">Partially Paid</Badge>;
      case "due":
        return <Badge className="bg-red-500">Due</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-6 py-8 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Credit Tracking</h1>
            <p className="text-primary-foreground/90 text-sm">ക്രെഡിറ്റ് ട്രാക്കിംഗ്</p>
          </div>
          <CreditCard className="h-10 w-10" />
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-4">
        {/* Total Due Summary */}
        <Card className="shadow-lg border-0 bg-gradient-to-r from-red-500/10 to-orange-500/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Outstanding</p>
                <p className="text-3xl font-bold text-destructive">₹{totalDue.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground mt-1">{dueBills.length} pending bills</p>
              </div>
              <AlertCircle className="h-12 w-12 text-destructive" />
            </div>
          </CardContent>
        </Card>

        {/* Due Bills List */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle>Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center text-muted-foreground py-8">Loading...</p>
            ) : dueBills.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No pending payments</p>
            ) : (
              <div className="space-y-4">
                {dueBills.map((bill) => (
                  <Card key={bill.id} className="border shadow-sm">
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold">{bill.billNumber}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(bill.date), "dd MMM yyyy")}
                            </p>
                          </div>
                          {getStatusBadge(bill.status)}
                        </div>

                        {bill.customerName && (
                          <div className="text-sm">
                            <p className="font-medium">Customer: {bill.customerName}</p>
                            {bill.customerPhone && (
                              <p className="text-muted-foreground">{bill.customerPhone}</p>
                            )}
                          </div>
                        )}

                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">Total</p>
                            <p className="font-semibold">₹{bill.totalAmount}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Paid</p>
                            <p className="font-semibold text-green-600">₹{bill.amountPaid}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Balance</p>
                            <p className="font-semibold text-red-600">₹{bill.balanceDue}</p>
                          </div>
                        </div>

                        <Button
                          onClick={() => handlePaymentClick(bill)}
                          size="sm"
                          className="w-full"
                        >
                          <DollarSign className="w-4 h-4 mr-2" />
                          Receive Payment
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* All Bills History */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle>All Bills History</CardTitle>
          </CardHeader>
          <CardContent>
            {billsWithCustomers.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No bills found</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bill #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {billsWithCustomers.map((bill) => (
                      <TableRow key={bill.id}>
                        <TableCell className="font-medium">{bill.billNumber}</TableCell>
                        <TableCell>{bill.customerName || "-"}</TableCell>
                        <TableCell>{format(new Date(bill.date), "dd/MM/yy")}</TableCell>
                        <TableCell>₹{bill.totalAmount}</TableCell>
                        <TableCell className={bill.balanceDue > 0 ? "text-red-600" : "text-green-600"}>
                          ₹{bill.balanceDue}
                        </TableCell>
                        <TableCell>{getStatusBadge(bill.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
              Record payment for {selectedBill?.billNumber}
            </DialogDescription>
          </DialogHeader>
          
          {selectedBill && (
            <div className="space-y-4">
              <div className="bg-muted p-3 rounded-md space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Amount:</span>
                  <span className="font-semibold">₹{selectedBill.totalAmount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Already Paid:</span>
                  <span className="font-semibold text-green-600">₹{selectedBill.amountPaid}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Balance Due:</span>
                  <span className="font-semibold text-red-600">₹{selectedBill.balanceDue}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Payment Amount *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="Enter amount"
                  max={selectedBill.balanceDue}
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
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handlePaymentSubmit}>
              Record Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
}
