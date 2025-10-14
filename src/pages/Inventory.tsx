import { useState } from "react";
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
import { Plus, Search, AlertCircle, Package } from "lucide-react";
import BottomNav from "@/components/BottomNav";

interface InventoryItem {
  id: string;
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
  const [items] = useState<InventoryItem[]>([
    {
      id: "1",
      name: "Tea Powder",
      category: "Tea & Snacks",
      quantity: 5,
      unit: "kg",
      purchasePrice: 400,
      sellingPrice: 450,
      lowStockAlert: true,
    },
    {
      id: "2",
      name: "Parle-G Biscuits",
      category: "Tea & Snacks",
      quantity: 25,
      unit: "packs",
      purchasePrice: 15,
      sellingPrice: 20,
      lowStockAlert: false,
    },
    {
      id: "3",
      name: "Rice (Matta)",
      category: "Groceries",
      quantity: 8,
      unit: "kg",
      purchasePrice: 50,
      sellingPrice: 65,
      lowStockAlert: true,
    },
    {
      id: "4",
      name: "Sugar",
      category: "Groceries",
      quantity: 15,
      unit: "kg",
      purchasePrice: 35,
      sellingPrice: 42,
      lowStockAlert: false,
    },
  ]);

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
                <div className="flex gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <div>
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
                <div className="text-right">
                  <p className="text-2xl font-bold">{item.quantity}</p>
                  <p className="text-xs text-muted-foreground">{item.unit}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Item Button */}
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
            <DialogTitle>Add New Item</DialogTitle>
            <DialogDescription>Add a new product to your inventory</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="itemName">Item Name</Label>
              <Input id="itemName" placeholder="Enter item name" className="rounded-xl" />
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
                  <SelectItem value="others">Others</SelectItem>
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Input id="unit" placeholder="kg, pack, etc" className="rounded-xl" />
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="selling">Selling Price</Label>
                <Input
                  id="selling"
                  type="number"
                  placeholder="₹0"
                  className="rounded-xl"
                />
              </div>
            </div>
            <Button className="w-full rounded-xl">Add Item</Button>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
};

export default Inventory;
