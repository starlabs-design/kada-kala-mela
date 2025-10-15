import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { History, Eye } from "lucide-react";
import { format } from "date-fns";
import SideNav from "@/components/SideNav";

interface Customer {
  id: number;
  name: string;
  phone?: string;
}

interface BillItem {
  id: number;
  billId: number;
  inventoryItemId: number;
  name: string;
  quantity: string;
  rate: number;
  total: number;
  unit: string;
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

interface BillWithDetails extends Bill {
  customerName?: string;
  customerPhone?: string;
  items?: BillItem[];
}

export default function BillingHistory() {
  const [selectedBill, setSelectedBill] = useState<BillWithDetails | null>(null);
  const [showItemsDialog, setShowItemsDialog] = useState(false);

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

  const billsWithCustomers: BillWithDetails[] = bills.map(bill => {
    const customer = customers.find(c => c.id === bill.customerId);
    return {
      ...bill,
      customerName: customer?.name,
      customerPhone: customer?.phone,
    };
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleViewItems = async (bill: BillWithDetails) => {
    try {
      const response = await fetch(`/api/bills/${bill.id}/items`);
      if (!response.ok) throw new Error("Failed to fetch bill items");
      const items = await response.json();
      setSelectedBill({ ...bill, items });
      setShowItemsDialog(true);
    } catch (error) {
      console.error("Error fetching bill items:", error);
    }
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
    <div className="min-h-screen bg-background lg:ml-[280px]">
      <SideNav />
      {/* Header */}
      <div className="bg-primary text-primary-foreground pl-6 pr-16 lg:px-6 py-8 rounded-b-3xl shadow-lg">
        <h1 className="text-2xl font-bold mb-2">Billing History</h1>
        <p className="text-primary-foreground/90 text-sm">ബില്ലിംഗ് ചരിത്രം</p>
      </div>

      <div className="px-4 -mt-4 space-y-4">
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle>All Bills ({billsWithCustomers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center text-muted-foreground py-8">Loading...</p>
            ) : billsWithCustomers.length === 0 ? (
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
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {billsWithCustomers.map((bill) => (
                      <TableRow key={bill.id}>
                        <TableCell className="font-medium">{bill.billNumber}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{bill.customerName || "Walk-in"}</p>
                            {bill.customerPhone && (
                              <p className="text-xs text-muted-foreground">{bill.customerPhone}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{format(new Date(bill.date), "dd MMM yyyy")}</TableCell>
                        <TableCell>Rs.{bill.totalAmount.toFixed(2)}</TableCell>
                        <TableCell className={bill.balanceDue > 0 ? "text-red-600 font-semibold" : "text-green-600"}>
                          Rs.{bill.balanceDue.toFixed(2)}
                        </TableCell>
                        <TableCell>{getStatusBadge(bill.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewItems(bill)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Items
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bill Items Dialog */}
      <Dialog open={showItemsDialog} onOpenChange={setShowItemsDialog}>
        <DialogContent className="max-w-[95%] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Bill Details - {selectedBill?.billNumber}</DialogTitle>
            <DialogDescription>
              {selectedBill?.customerName && `Customer: ${selectedBill.customerName}`}
              {selectedBill && ` | Date: ${format(new Date(selectedBill.date), "dd MMM yyyy")}`}
            </DialogDescription>
          </DialogHeader>
          
          {selectedBill && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedBill.items?.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.quantity} {item.unit}</TableCell>
                        <TableCell>Rs.{item.rate.toFixed(2)}</TableCell>
                        <TableCell className="text-right">Rs.{item.total.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-semibold">Rs.{selectedBill.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount Paid:</span>
                  <span className="font-semibold text-green-600">Rs.{selectedBill.amountPaid.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="font-medium">Balance Due:</span>
                  <span className={`font-bold ${selectedBill.balanceDue > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    Rs.{selectedBill.balanceDue.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  {getStatusBadge(selectedBill.status)}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
