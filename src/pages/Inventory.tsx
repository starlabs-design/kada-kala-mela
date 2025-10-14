import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, AlertCircle, Package, Pencil, Trash2 } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { inventoryAPI } from "@/lib/api";
import { toast } from "sonner";
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

interface InventoryFormData {
  name: string;
  category: string;
  quantity: number;
  unit: string;
  purchasePrice: number;
  sellingPrice: number;
  lowStockAlert: boolean;
}

const Inventory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<InventoryFormData & { id: number } | null>(null);
  const queryClient = useQueryClient();

  const { data: items = [] } = useQuery({
    queryKey: ["inventory"],
    queryFn: inventoryAPI.getAll,
  });

  const createMutation = useMutation({
    mutationFn: inventoryAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      setIsDialogOpen(false);
      toast.success("Item added successfully!");
    },
    onError: () => {
      toast.error("Failed to add item");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InventoryFormData> }) =>
      inventoryAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      setIsEditDialogOpen(false);
      setEditingItem(null);
      toast.success("Item updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update item");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: inventoryAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      setDeletingItemId(null);
      toast.success("Item deleted successfully!");
    },
    onError: () => {
      toast.error("Failed to delete item");
    },
  });

  const [newItem, setNewItem] = useState<InventoryFormData>({
    name: "",
    category: "",
    quantity: 0,
    unit: "",
    purchasePrice: 0,
    sellingPrice: 0,
    lowStockAlert: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(newItem as any);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      const { id, ...data } = editingItem;
      updateMutation.mutate({ id, data });
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem({
      id: item.id,
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      purchasePrice: item.purchasePrice,
      sellingPrice: item.sellingPrice,
      lowStockAlert: item.lowStockAlert,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeletingItemId(id);
  };

  const confirmDelete = () => {
    if (deletingItemId) {
      deleteMutation.mutate(deletingItemId);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-6 py-6 rounded-b-3xl shadow-lg">
        <h1 className="text-2xl font-bold">Inventory</h1>
        <p className="text-primary-foreground/90 text-sm">സാധനങ്ങൾ</p>
      </div>

      {/* Search and Filter */}
      <div className="px-4 py-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-2xl border-border bg-card"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            onClick={() => setSelectedCategory("all")}
            className="rounded-full"
          >
            All
          </Button>
          <Button
            variant={selectedCategory === "Tea & Snacks" ? "default" : "outline"}
            onClick={() => setSelectedCategory("Tea & Snacks")}
            className="rounded-full"
          >
            Tea & Snacks
          </Button>
          <Button
            variant={selectedCategory === "Groceries" ? "default" : "outline"}
            onClick={() => setSelectedCategory("Groceries")}
            className="rounded-full"
          >
            Groceries
          </Button>
        </div>
      </div>

      {/* Items List */}
      <div className="px-4 space-y-3">
        {filteredItems.map((item) => (
          <Card key={item.id} className="bg-card shadow-md border-0">
            <CardContent className="pt-4">
              <div className="flex justify-between items-start">
                <div className="flex gap-3 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline" className="rounded-full">
                        ₹{item.sellingPrice}/{item.unit}
                      </Badge>
                      {item.lowStockAlert && (
                        <Badge variant="destructive" className="rounded-full gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Low Stock
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="text-right mr-2">
                    <p className="text-2xl font-bold">{item.quantity}</p>
                    <p className="text-xs text-muted-foreground">{item.unit}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEdit(item)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Item Button */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
            <DialogTitle>Add New Item</DialogTitle>
            <DialogDescription>Add a new product to your inventory</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="itemName">Item Name</Label>
              <Input 
                id="itemName" 
                placeholder="Enter item name" 
                className="rounded-xl"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={newItem.category} onValueChange={(value) => setNewItem({ ...newItem, category: value })}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tea & Snacks">Tea & Snacks</SelectItem>
                  <SelectItem value="Groceries">Groceries</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="0"
                  className="rounded-xl"
                  value={newItem.quantity || ""}
                  onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Input 
                  id="unit" 
                  placeholder="kg, pack, etc" 
                  className="rounded-xl"
                  value={newItem.unit}
                  onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="purchase">Purchase Price</Label>
                <Input
                  id="purchase"
                  type="number"
                  placeholder="₹0"
                  className="rounded-xl"
                  value={newItem.purchasePrice || ""}
                  onChange={(e) => setNewItem({ ...newItem, purchasePrice: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="selling">Selling Price</Label>
                <Input
                  id="selling"
                  type="number"
                  placeholder="₹0"
                  className="rounded-xl"
                  value={newItem.sellingPrice || ""}
                  onChange={(e) => setNewItem({ ...newItem, sellingPrice: Number(e.target.value) })}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full rounded-xl" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Adding..." : "Add Item"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="rounded-3xl max-w-[90%]">
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
            <DialogDescription>Update product information</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editItemName">Item Name</Label>
              <Input 
                id="editItemName" 
                placeholder="Enter item name" 
                className="rounded-xl"
                value={editingItem?.name || ""}
                onChange={(e) => setEditingItem(editingItem ? { ...editingItem, name: e.target.value } : null)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editCategory">Category</Label>
              <Select 
                value={editingItem?.category || ""} 
                onValueChange={(value) => setEditingItem(editingItem ? { ...editingItem, category: value } : null)}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tea & Snacks">Tea & Snacks</SelectItem>
                  <SelectItem value="Groceries">Groceries</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editQuantity">Quantity</Label>
                <Input
                  id="editQuantity"
                  type="number"
                  placeholder="0"
                  className="rounded-xl"
                  value={editingItem?.quantity || ""}
                  onChange={(e) => setEditingItem(editingItem ? { ...editingItem, quantity: Number(e.target.value) } : null)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editUnit">Unit</Label>
                <Input 
                  id="editUnit" 
                  placeholder="kg, pack, etc" 
                  className="rounded-xl"
                  value={editingItem?.unit || ""}
                  onChange={(e) => setEditingItem(editingItem ? { ...editingItem, unit: e.target.value } : null)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editPurchase">Purchase Price</Label>
                <Input
                  id="editPurchase"
                  type="number"
                  placeholder="₹0"
                  className="rounded-xl"
                  value={editingItem?.purchasePrice || ""}
                  onChange={(e) => setEditingItem(editingItem ? { ...editingItem, purchasePrice: Number(e.target.value) } : null)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editSelling">Selling Price</Label>
                <Input
                  id="editSelling"
                  type="number"
                  placeholder="₹0"
                  className="rounded-xl"
                  value={editingItem?.sellingPrice || ""}
                  onChange={(e) => setEditingItem(editingItem ? { ...editingItem, sellingPrice: Number(e.target.value) } : null)}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full rounded-xl" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Updating..." : "Update Item"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deletingItemId !== null} onOpenChange={(open) => !open && setDeletingItemId(null)}>
        <AlertDialogContent className="rounded-3xl max-w-[90%]">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the item from your inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="rounded-xl" 
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BottomNav />
    </div>
  );
};

export default Inventory;
