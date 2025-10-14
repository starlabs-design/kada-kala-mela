import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, TrendingUp, TrendingDown } from "lucide-react";
import BottomNav from "@/components/BottomNav";

interface Transaction {
  id: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  date: string;
  notes?: string;
}

const Expenses = () => {
  const [transactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "income",
      category: "Tea & Snacks",
      amount: 1200,
      date: "2025-10-14",
      notes: "Morning sales",
    },
    {
      id: "2",
      type: "income",
      category: "Groceries",
      amount: 1250,
      date: "2025-10-14",
      notes: "Afternoon sales",
    },
    {
      id: "3",
      type: "expense",
      category: "Purchase",
      amount: 800,
      date: "2025-10-14",
      notes: "Stock from wholesale",
    },
    {
      id: "4",
      type: "expense",
      category: "Electricity",
      amount: 400,
      date: "2025-10-14",
      notes: "Monthly bill",
    },
  ]);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-secondary text-secondary-foreground px-6 py-6 rounded-b-3xl shadow-lg">
        <h1 className="text-2xl font-bold">Income & Expenses</h1>
        <p className="text-secondary-foreground/90 text-sm">വരവ് & ചെലവ്</p>
      </div>

      {/* Summary Cards */}
      <div className="px-4 -mt-6 grid grid-cols-2 gap-4 mb-6">
        <Card className="bg-success/10 border-success/20 shadow-lg">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-success" />
              <p className="text-xs font-medium text-success">Income</p>
            </div>
            <p className="text-2xl font-bold text-success">
              ₹{totalIncome.toLocaleString('en-IN')}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-destructive/10 border-destructive/20 shadow-lg">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="h-4 w-4 text-destructive" />
              <p className="text-xs font-medium text-destructive">Expenses</p>
            </div>
            <p className="text-2xl font-bold text-destructive">
              ₹{totalExpenses.toLocaleString('en-IN')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="px-4">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4 rounded-2xl">
            <TabsTrigger value="all" className="rounded-xl">All</TabsTrigger>
            <TabsTrigger value="income" className="rounded-xl">Income</TabsTrigger>
            <TabsTrigger value="expense" className="rounded-xl">Expense</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3">
            {transactions.map((transaction) => (
              <Card key={transaction.id} className="bg-card shadow-md border-0">
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{transaction.category}</h3>
                      <p className="text-sm text-muted-foreground">{transaction.notes}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(transaction.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-xl font-bold ${
                          transaction.type === "income" ? "text-success" : "text-destructive"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"}₹
                        {transaction.amount.toLocaleString('en-IN')}
                      </p>
                      <Badge
                        variant={transaction.type === "income" ? "default" : "destructive"}
                        className="rounded-full mt-1"
                      >
                        {transaction.type === "income" ? "Income" : "Expense"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="income" className="space-y-3">
            {transactions
              .filter((t) => t.type === "income")
              .map((transaction) => (
                <Card key={transaction.id} className="bg-card shadow-md border-0">
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{transaction.category}</h3>
                        <p className="text-sm text-muted-foreground">{transaction.notes}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(transaction.date).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                      <p className="text-xl font-bold text-success">
                        +₹{transaction.amount.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>

          <TabsContent value="expense" className="space-y-3">
            {transactions
              .filter((t) => t.type === "expense")
              .map((transaction) => (
                <Card key={transaction.id} className="bg-card shadow-md border-0">
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{transaction.category}</h3>
                        <p className="text-sm text-muted-foreground">{transaction.notes}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(transaction.date).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                      <p className="text-xl font-bold text-destructive">
                        -₹{transaction.amount.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Transaction Button */}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="fixed bottom-24 right-6 h-14 w-14 rounded-full shadow-lg"
            size="icon"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent className="rounded-3xl max-w-[90%]">
          <DialogHeader>
            <DialogTitle>Add Transaction</DialogTitle>
            <DialogDescription>Record income or expense</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tea">Tea & Snacks</SelectItem>
                  <SelectItem value="groceries">Groceries</SelectItem>
                  <SelectItem value="purchase">Purchase</SelectItem>
                  <SelectItem value="rent">Rent</SelectItem>
                  <SelectItem value="electricity">Electricity</SelectItem>
                  <SelectItem value="misc">Miscellaneous</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="₹0"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input id="notes" placeholder="Add notes..." className="rounded-xl" />
            </div>
            <Button className="w-full rounded-xl">Add Transaction</Button>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
};

export default Expenses;
