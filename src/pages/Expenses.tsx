import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, TrendingUp, TrendingDown, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionsAPI } from "@/lib/api";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";
import type { Transaction } from "@shared/schema";

const Expenses = () => {
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<number | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    type: "income" as "income" | "expense",
    category: "",
    amount: "",
    date: new Date().toISOString().split('T')[0],
    notes: ""
  });

  const { data: transactions = [] } = useQuery<Transaction[]>({
    queryKey: ["transactions"],
    queryFn: transactionsAPI.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => transactionsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Transaction deleted successfully");
      setDeleteDialogOpen(false);
      setTransactionToDelete(null);
    },
    onError: () => {
      toast.error("Failed to delete transaction");
    },
  });

  const createMutation = useMutation({
    mutationFn: transactionsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      setIsAddDialogOpen(false);
      setNewTransaction({
        type: "income",
        category: "",
        amount: "",
        date: new Date().toISOString().split('T')[0],
        notes: ""
      });
      toast.success("Transaction added successfully");
    },
    onError: () => {
      toast.error("Failed to add transaction");
    },
  });

  const handleDeleteClick = (id: number) => {
    setTransactionToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (transactionToDelete !== null) {
      deleteMutation.mutate(transactionToDelete);
    }
  };

  const handleAddTransaction = () => {
    if (!newTransaction.category || !newTransaction.amount || !newTransaction.date) {
      toast.error("Please fill in all required fields");
      return;
    }
    createMutation.mutate({
      type: newTransaction.type,
      category: newTransaction.category,
      amount: parseInt(newTransaction.amount),
      date: newTransaction.date,
      notes: newTransaction.notes || undefined
    });
  };

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
      <div className="px-4 pt-6 grid grid-cols-2 gap-4 mb-6">
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
            {transactions.length === 0 ? (
              <Card className="bg-card shadow-md border-0">
                <CardContent className="pt-6 pb-6 text-center">
                  <p className="text-muted-foreground">No transactions yet</p>
                  <p className="text-sm text-muted-foreground mt-1">Add your first transaction to get started</p>
                </CardContent>
              </Card>
            ) : (
              transactions.map((transaction) => (
                <Card key={transaction.id} className="bg-card shadow-md border-0">
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{transaction.category}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{transaction.notes}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(transaction.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className="flex items-start gap-2 flex-shrink-0">
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
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteClick(transaction.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="income" className="space-y-3">
            {transactions.filter((t) => t.type === "income").length === 0 ? (
              <Card className="bg-card shadow-md border-0">
                <CardContent className="pt-6 pb-6 text-center">
                  <p className="text-muted-foreground">No income transactions yet</p>
                  <p className="text-sm text-muted-foreground mt-1">Add an income transaction to track your earnings</p>
                </CardContent>
              </Card>
            ) : (
              transactions
                .filter((t) => t.type === "income")
                .map((transaction) => (
                  <Card key={transaction.id} className="bg-card shadow-md border-0">
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{transaction.category}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{transaction.notes}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(transaction.date).toLocaleDateString('en-IN')}
                          </p>
                        </div>
                        <div className="flex items-start gap-2 flex-shrink-0">
                          <p className="text-xl font-bold text-success">
                            +₹{transaction.amount.toLocaleString('en-IN')}
                          </p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteClick(transaction.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
            )}
          </TabsContent>

          <TabsContent value="expense" className="space-y-3">
            {transactions.filter((t) => t.type === "expense").length === 0 ? (
              <Card className="bg-card shadow-md border-0">
                <CardContent className="pt-6 pb-6 text-center">
                  <p className="text-muted-foreground">No expense transactions yet</p>
                  <p className="text-sm text-muted-foreground mt-1">Add an expense transaction to track your spending</p>
                </CardContent>
              </Card>
            ) : (
              transactions
                .filter((t) => t.type === "expense")
                .map((transaction) => (
                  <Card key={transaction.id} className="bg-card shadow-md border-0">
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{transaction.category}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{transaction.notes}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(transaction.date).toLocaleDateString('en-IN')}
                          </p>
                        </div>
                        <div className="flex items-start gap-2 flex-shrink-0">
                          <p className="text-xl font-bold text-destructive">
                            -₹{transaction.amount.toLocaleString('en-IN')}
                          </p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteClick(transaction.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Transaction Button */}
      <Button
        className="fixed bottom-24 right-6 h-14 w-14 rounded-full shadow-lg"
        size="icon"
        onClick={() => setIsAddDialogOpen(true)}
      >
        <Plus className="h-6 w-6" />
      </Button>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="rounded-3xl max-w-[90%] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Transaction</DialogTitle>
            <DialogDescription>Record income or expense</DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); handleAddTransaction(); }} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={newTransaction.type}
                onValueChange={(value) =>
                  setNewTransaction({ ...newTransaction, type: value as "income" | "expense" })
                }
              >
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
              <Input
                id="category"
                value={newTransaction.category}
                onChange={(e) =>
                  setNewTransaction({ ...newTransaction, category: e.target.value })
                }
                placeholder="Enter category"
                className="rounded-xl"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={newTransaction.amount}
                onChange={(e) =>
                  setNewTransaction({ ...newTransaction, amount: e.target.value })
                }
                placeholder="₹0"
                className="rounded-xl"
                required
                min="1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={newTransaction.date}
                onChange={(e) =>
                  setNewTransaction({ ...newTransaction, date: e.target.value })
                }
                className="rounded-xl"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={newTransaction.notes}
                onChange={(e) =>
                  setNewTransaction({ ...newTransaction, notes: e.target.value })
                }
                placeholder="Add notes..."
                className="rounded-xl"
              />
            </div>
          </form>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="rounded-xl"
            >
              {createMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rounded-3xl max-w-[90%]">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this transaction? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeleteConfirm}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BottomNav />
    </div>
  );
};

export default Expenses;
